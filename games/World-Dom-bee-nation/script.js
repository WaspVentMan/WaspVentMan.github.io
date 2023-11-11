let hive = {}
let bees = {}

let rawstring = ["0"]

for (let x = 0; x < 9; x++){
    rawstring = rawstring.concat(rawstring)
}

let achievements = rawstring
let beeswaxbuffs = rawstring
let skin = {"bee": "bee", "hive": "hive", "flower": "flower"}

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
    if (saveData.achievements != undefined){
        achievements = saveData.achievements
    }
    if (saveData.skin != undefined){
        skin = saveData.skin
    }
    if (saveData.beeswaxbuffs != undefined){
        beeswaxbuffs = saveData.beeswaxbuffs
    }
    if (bees.constructor != undefined){
        delete bees.constructor
    }
}
catch{console.log(":(")}

savecheck()

function totalBee(){return bees.swarmqueue + bees.swarm.bees + bees.worker.bees + bees.constructors.bees + bees.queen.bees}

function updateskin(newskin, i=true){
    if (i){
        skin[newskin] = document.querySelector(".sel").value
    }
    document.querySelector(".lil" + newskin).src = "img/" + skin[newskin] + ".png"
    document.querySelector(".lil" + newskin + "prev").src = "img/" + skin[newskin] + ".png"
}

updateskin("bee", i=false)
updateskin("hive", i=false)
updateskin("flower", i=false)

const hiveVars = ["beeswax", "honey", "nectar", "bees"] // "beeswaxcap", "honeycap", "nectarcap", "beecap", 

let t = Date.now()

setInterval(function(){
    for (let x = 0; x < hiveVars.length; x++){
        document.querySelector("." + hiveVars[x]).textContent = numeral(Math.round(hive[hiveVars[x]]*100)/100).format('0a')
        if (x >= 4){
            document.querySelector("." + hiveVars[x]).textContent += "/"
        }
    }

    document.querySelector(".swarm").textContent = " Swarm: " + Math.round(bees.swarm.bees*100)/100 + " (" +  Math.round(bees.swarmqueue*100)/100 + " in queue)"
    document.querySelector(".worker").textContent = " Workers: " + Math.round(bees.worker.bees*100)/100
    document.querySelector(".constructors").textContent = " constructors: " + Math.round(bees.constructors.bees*100)/100
    document.querySelector(".queen").textContent = " Queens: " + Math.round(bees.queen.bees*100)/100

    document.querySelector('.queencost').textContent = numeral(100*((bees.queen.bees+1)**2)).format('0a') + ' Honey + 1 Bee'

    buycount = parseInt(document.querySelector('.buycount').value)

    if (bees.swarm.pos <= 0){
        bees.swarm.bees += bees.swarmqueue
        bees.swarmqueue = 0
    }

    let beemove = 100*((Date.now()-t)/100)

    if (beeswaxbuffs[0] == "1"){
        beemove *= 2
    }

    if (bees.swarm.bees != 0){
        if (bees.swarm.to){
            document.querySelector(".lilbee").style.transform = "scaleX(1)"
            bees.swarm.pos += beemove
            if (bees.swarm.pos >= 5000){
                bees.swarm.to = false
                bees.swarm.nectar = 1
                bees.swarm.pos = 5000
            }
        }

        else {
            document.querySelector(".lilbee").style.transform = "scaleX(-1)"
            bees.swarm.pos -= beemove
            if (bees.swarm.pos <= 0){
                bees.swarm.to = true
                bees.swarm.nectar = 0
                bees.swarm.pos = 0

                hive.nectar += 1*bees.swarm.bees
            }
        }

        document.querySelector(".swarmtracker").style.width = (bees.swarm.pos/5000*100) + "%"
        document.querySelector(".lilbee").style.left = "calc(" + (bees.swarm.pos/5000*100) + "% - " + parseInt(document.querySelector('.BS').value)*(bees.swarm.pos/5000) + "px)"
        document.querySelector(".lilbee").style.top = Math.sin(Date.now()/100)*document.querySelector(".BBI").value + "px"
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

    if (document.querySelector('.BBI').value == "5"){
        document.querySelector('.BBIdisp').textContent = document.querySelector('.BBI').value + " (Default)"
    } else {
        document.querySelector('.BBIdisp').textContent = document.querySelector('.BBI').value
    }
    

    if (document.querySelector('.BS').value == "0"){
        document.querySelector('.BSdisp').textContent = "Hidden"
    } else if (document.querySelector('.BS').value == "64"){
        document.querySelector('.BSdisp').textContent = (parseInt(document.querySelector('.BS').value)/64)*100 + "% (Default)"
    } else {
        document.querySelector('.BSdisp').textContent = (parseInt(document.querySelector('.BS').value)/64)*100 + "%"
    }
    
    if (document.querySelector('.BSP').value == "64"){
        document.querySelector('.BSPdisp').textContent = (parseInt(document.querySelector('.BSP').value)/64)*100 + "% (Default)"
    } else {
        document.querySelector('.BSPdisp').textContent = (parseInt(document.querySelector('.BSP').value)/64)*100 + "%"
    }

    if (document.querySelector('.TITLECLEAR').value == "1"){
        document.querySelector('.TITLECLEARdisp').textContent = "No"
    } else {
        document.querySelector('.TITLECLEARdisp').textContent = "Yes (Default)"
    }

    document.querySelector('.lilbee').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilhive').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilflower').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilbeeprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.lilhiveprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.lilflowerprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.bg').style.height = parseInt(document.querySelector('.BS').value)*parseInt(document.querySelector('.TITLECLEAR').value) + "px"
}, 1000/60)

setInterval(function(){
    // ACHIEVEMENTS
    if (achievements[0] == "1" || bees.swarm.bees > 0){
        achievements[0] = "1"
        document.querySelector(".ac0").style.backgroundColor = "green"
        document.querySelector(".otherskin0").removeAttribute("disabled")
    }

    if (achievements[1] == "1" || bees.swarm.bees > 0 && bees.worker.bees > 0 && bees.constructors.bees > 0){
        achievements[1] = "1"
        document.querySelector(".ac1").style.backgroundColor = "green"
        document.querySelector(".flowerskin1").removeAttribute("disabled")
    }

    if (achievements[2] == "1" || hive.beeswax >= 100){
        achievements[2] = "1"
        document.querySelector(".ac2").style.backgroundColor = "green"
        document.querySelector(".beeskin1").removeAttribute("disabled")
    }

    if (achievements[3] == "1" || bees.queen.bees > 0){
        achievements[3] = "1"
        document.querySelector(".ac3").style.backgroundColor = "green"
        document.querySelector(".hiveskin1").removeAttribute("disabled")
    }

    // BEESWAXBUFFS
    if (beeswaxbuffs[0] == "1"){
        document.querySelector(".bw0").style.backgroundColor = "green"
    }
    else if (beeswaxbuffs[0] != "1" && hive.beeswax > 100){
        document.querySelector(".bw0").style.backgroundColor = "lightgreen"
    }

    localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees, "achievements": achievements, "skin": skin, "beeswaxbuffs": beeswaxbuffs}))
}, 100)