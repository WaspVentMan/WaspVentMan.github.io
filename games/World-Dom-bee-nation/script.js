let hive = {
    "beeswax": 0,
    "honey": 0,
    "nectar": 0,
    "bees": 1
}

let bees = {
    "swarmqueue": 0,
    "swarm": {"pos": 0, "to": true, "nectar": 0, "bees": 0},
    "worker": {"bees": 0},
    "constructor": {"bees": 0}
}

let saveData = localStorage.getItem("BEE_IDLE")

try{
    if (saveData != null){
        saveData = JSON.parse(saveData)
    }
    if (saveData.hive != undefined){
        hive = saveData.hive
    }
    if (saveData.bees != undefined){
        bees = saveData.bees
    }
}
catch{console.log(":(")}

function totalBee(){return bees.swarmqueue + bees.swarm.bees + bees.worker.bees + bees.constructor.bees}

const hiveVars = ["beeswax", "honey", "nectar", "bees"] // "beeswaxcap", "honeycap", "nectarcap", "beecap", 

let t = Date.now()

setInterval(function(){
    for (let x = 0; x < hiveVars.length; x++){
        document.querySelector("." + hiveVars[x]).textContent = Math.round(hive[hiveVars[x]]*100)/100
        if (x >= 4){
            document.querySelector("." + hiveVars[x]).textContent += "/"
        }
    }

    document.querySelector(".swarm").textContent = " Swarm: " + Math.round(bees.swarm.bees*100)/100 + " (" +  Math.round(bees.swarmqueue*100)/100 + " in queue)"
    document.querySelector(".worker").textContent = " Workers: " + Math.round(bees.worker.bees*100)/100
    document.querySelector(".constructor").textContent = " Constructors: " + Math.round(bees.constructor.bees*100)/100

    if (bees.swarm.pos <= 0){
        bees.swarm.bees += bees.swarmqueue
        bees.swarmqueue = 0
    }

    if (bees.swarm.bees != 0){
        if (bees.swarm.to){
            document.querySelector(".lilbee").style.transform = "scaleX(1)"
            bees.swarm.pos += 100*((Date.now()-t)/100)
            if (bees.swarm.pos >= 5000){
                bees.swarm.to = false
                bees.swarm.nectar = 1
                bees.swarm.pos = 5000
            }
        }

        else {
            document.querySelector(".lilbee").style.transform = "scaleX(-1)"
            bees.swarm.pos -= 100*((Date.now()-t)/100)
            if (bees.swarm.pos <= 0){
                bees.swarm.to = true
                bees.swarm.nectar = 0
                bees.swarm.pos = 0

                hive.nectar += 1*bees.swarm.bees
            }
        }

        document.querySelector(".swarmtracker").style.width = ((bees.swarm.pos/5000)*100) + "%"
        document.querySelector(".lilbee").style.left = "calc(" + ((bees.swarm.pos/5000)*100) + "% - " + 64*(bees.swarm.pos/5000) + "px)"
    }

    if (bees.worker.bees != 0 && hive.nectar > 0){
        if (hive.nectar - (0.01*bees.worker.bees*((Date.now()-t)/100)) >= 0){
            hive.honey += 0.01*bees.worker.bees*((Date.now()-t)/100)
            hive.nectar -= 0.01*bees.worker.bees*((Date.now()-t)/100)
        } else {
            hive.honey += (hive.nectar - 0.01*bees.worker.bees*((Date.now()-t)/100))
            hive.nectar = 0
        }
    }

    if (bees.constructor.bees != 0 && hive.honey > 0){
        if (hive.honey - (0.001*bees.constructor.bees*((Date.now()-t)/100)) >= 0){
            hive.beeswax += 0.001*bees.constructor.bees*((Date.now()-t)/100)
            hive.honey -= 0.001*bees.constructor.bees*((Date.now()-t)/100)
        } else {
            hive.beeswax += 0 - (0.001*bees.constructor.bees*((Date.now()-t)/100))
            hive.honey = 0
        }
    }

    t = Date.now()
}, 0)

setInterval(function(){
    if (bees.swarm.bees > 0){
        document.querySelector(".ac0").style.backgroundColor = "green"
    }

    if (bees.swarm.bees > 0 && bees.worker.bees > 0 && bees.constructor.bees > 0){
        document.querySelector(".ac1").style.backgroundColor = "green"
    }

    if (hive.beeswax >= 100){
        document.querySelector(".ac2").style.backgroundColor = "green"
        document.querySelector(".lilbee").src = "img/beeplusplus.png"
    }

    localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees}))
}, 33)