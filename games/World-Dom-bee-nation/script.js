let hive = {}
let bees = {}

let saveData = localStorage.getItem("BEE_IDLE")
let lastchild = Date.now()

let buycount = 1

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

savecheck()

function totalBee(){return bees.swarmqueue + bees.swarm.bees + bees.worker.bees + bees.constructors.bees + bees.queen.bees}

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
    document.querySelector(".constructors").textContent = " constructors: " + Math.round(bees.constructors.bees*100)/100
    document.querySelector(".queen").textContent = " Queens: " + Math.round(bees.queen.bees*100)/100

    document.querySelector('.queencost').textContent = 100*((bees.queen.bees+1)**2) + ' HONEY + BEE'

    buycount = parseInt(document.querySelector('.buycount').value)

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

    if (bees.constructors.bees != 0 && hive.honey > 0){
        if (hive.honey - (0.001*bees.constructors.bees*((Date.now()-t)/100)) >= 0){
            hive.beeswax += 0.001*bees.constructors.bees*((Date.now()-t)/100)
            hive.honey -= 0.001*bees.constructors.bees*((Date.now()-t)/100)
        } else {
            hive.beeswax += 0 - (0.001*bees.constructors.bees*((Date.now()-t)/100))
            hive.honey = 0
        }
    }

    if (bees.queen.bees != 0 && hive.honey > 10 && Date.now() - (lastchild + (20000 / bees.queen.bees+1)) > 0){
        hive.bees += 1
        hive.honey -= 10

        lastchild = Date.now()
    }

    if (hive.nectar < 0){hive.nectar = 0}
    if (hive.honey < 0){hive.honey = 0}
    if (hive.beeswax < 0){hive.beeswax = 0}

    t = Date.now()

    document.querySelector(".lilbee").src = "img/" + document.querySelector(".beesel").value + ".png"
    document.querySelector(".lilhive").src = "img/" + document.querySelector(".hivesel").value + ".png"
    document.querySelector(".lilflower").src = "img/" + document.querySelector(".flowersel").value + ".png"
}, 0)

setInterval(function(){
    if (bees.swarm.bees > 0){
        document.querySelector(".ac0").style.backgroundColor = "green"
    }

    if (bees.swarm.bees > 0 && bees.worker.bees > 0 && bees.constructors.bees > 0){
        document.querySelector(".ac1").style.backgroundColor = "green"
        document.querySelector(".flowerskin1").removeAttribute("disabled")
    }

    if (hive.beeswax >= 100){
        document.querySelector(".ac2").style.backgroundColor = "green"
        document.querySelector(".beeskin1").removeAttribute("disabled")
    }

    if (bees.queen.bees > 0){
        document.querySelector(".ac3").style.backgroundColor = "green"
        document.querySelector(".hiveskin1").removeAttribute("disabled")
    }

    localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees}))
}, 33)