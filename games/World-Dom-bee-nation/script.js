let params = new URL(document.location).searchParams
let code = params.get("b")

if (code != undefined){
    try{
        code = atob(code)
    } catch {
        location.href = location.href.split("?")[0]
    }
}

let hive = {}
let bees = {}

let rawstring = ["0"]

for (let x = 0; x < 9; x++){
    rawstring = rawstring.concat(rawstring)
}

let achievements = rawstring
let beeswaxbuffs = rawstring
let skin = {"bee": "bee", "hive": "hive", "flower": "flower"}

let manager = true

let saveData = localStorage.getItem("BEE_IDLE")
let lastchild = Date.now()
let lastmanage = Date.now()

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

if (code != undefined){
    skin.bee = code
}

updateskin("bee", i=false)
updateskin("hive", i=false)
updateskin("flower", i=false)

const hiveVars = ["beeswax", "honey", "nectar", "bees"] // "beeswaxcap", "honeycap", "nectarcap", "beecap", 

let t = Date.now()

function gameloop(){
    for (let x = 0; x < hiveVars.length; x++){
        document.querySelector("." + hiveVars[x]).textContent = numeral(Math.round(hive[hiveVars[x]]*100)/100).format('0.00a')
        if (x >= 4){
            document.querySelector("." + hiveVars[x]).textContent += "/"
        }
    }

    if (bees.swarmqueue == 0){
        document.querySelector(".swarm").textContent = numeral(bees.swarm.bees).format('0.00a')
    } else {
        document.querySelector(".swarm").textContent = numeral(bees.swarm.bees).format('0.00a') + " (" + numeral(bees.swarmqueue).format('0a') + ")"
    }

    document.querySelector(".worker").textContent = numeral(bees.worker.bees).format('0.00a')
    document.querySelector(".constructors").textContent = numeral(bees.constructors.bees).format('0.00a')
    document.querySelector(".queen").textContent = numeral(bees.queen.bees).format('0a')

    if (manager){
        document.querySelector(".manager").textContent = "On"
    } else {
        document.querySelector(".manager").textContent = "Off"
    }
    

    document.querySelector('.queencost').textContent = numeral(100*((bees.queen.bees+1)**2)).format('0.00a') + ' Honey + 1 Bee'

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
        document.querySelector(".swarmtracker").style.backgroundColor = "rgba("+document.querySelector('.PBR').value+", "+document.querySelector('.PBG').value+", "+document.querySelector('.PBB').value+", "+parseInt(document.querySelector('.PBA').value)/100+")"

        if (document.querySelector('.PB').value == "1"){
            document.querySelector(".swarmtracker").style.visibility = "hidden"
        } else {
            document.querySelector(".swarmtracker").style.visibility = "visible"
        }
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

    if (beeswaxbuffs[1] == "1" && Date.now() - lastmanage > 100 && manager){
        let average = (bees.swarm.bees + bees.swarmqueue + bees.worker.bees + bees.constructors.bees)/3

        if (bees.swarm.bees + bees.swarmqueue <= average && totalBee()+1 < hive.bees){
            bees.swarmqueue += 1
        } else if (bees.worker.bees <= average && totalBee()+1 < hive.bees){
            bees.worker.bees += 1
        } else if (bees.constructors.bees <= average && totalBee()+1 < hive.bees){
            bees.constructors.bees += 1
        }

        lastmanage = Date.now()
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
    
    if (document.querySelector('.BSP').value == "128"){
        document.querySelector('.BSPdisp').textContent = (parseInt(document.querySelector('.BSP').value)/64)*100 + "% (Default)"
    } else {
        document.querySelector('.BSPdisp').textContent = (parseInt(document.querySelector('.BSP').value)/64)*100 + "%"
    }

    if (document.querySelector('.TITLECLEAR').value == "1"){
        document.querySelector('.TITLECLEARdisp').textContent = "No"
    } else {
        document.querySelector('.TITLECLEARdisp').textContent = "Yes (Default)"
    }

    if (document.querySelector('.PB').value == "1"){
        document.querySelector('.PBdisp').textContent = "Hidden (Default)"
    } else {
        document.querySelector('.PBdisp').textContent = "Shown"
    }

    if (document.querySelector('.PBR').value == "128"){
        document.querySelector('.PBRdisp').textContent = document.querySelector('.PBR').value + " (Default)"
    } else {
        document.querySelector('.PBRdisp').textContent = document.querySelector('.PBR').value
    }

    if (document.querySelector('.PBG').value == "128"){
        document.querySelector('.PBGdisp').textContent = document.querySelector('.PBG').value + " (Default)"
    } else {
        document.querySelector('.PBGdisp').textContent = document.querySelector('.PBG').value
    }

    if (document.querySelector('.PBB').value == "128"){
        document.querySelector('.PBBdisp').textContent = document.querySelector('.PBB').value + " (Default)"
    } else {
        document.querySelector('.PBBdisp').textContent = document.querySelector('.PBB').value
    }

    if (document.querySelector('.PBA').value == "25"){
        document.querySelector('.PBAdisp').textContent = document.querySelector('.PBA').value + "% (Default)"
    } else {
        document.querySelector('.PBAdisp').textContent = document.querySelector('.PBA').value + "%"
    }

    if (document.querySelector('.TR').value == "10"){//🥔
        document.querySelector('.TRdisp').textContent = parseInt(document.querySelector('.TR').value)/1000 + "s (Default)"
    } else if (document.querySelector('.TR').value == "100"){
        document.querySelector('.TRdisp').textContent = "🥔"
    } else {
        document.querySelector('.TRdisp').textContent = parseInt(document.querySelector('.TR').value)/1000 + "s"
    }

    if (document.querySelector('.STR').value == "200"){
        document.querySelector('.STRdisp').textContent = parseInt(document.querySelector('.STR').value)/1000 + "s (Default)"
    } else if (document.querySelector('.STR').value == "1000"){
        document.querySelector('.STRdisp').textContent = "🥔"
    } else {
        document.querySelector('.STRdisp').textContent = parseInt(document.querySelector('.STR').value)/1000 + "s"
    }

    document.querySelector('.lilbee').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilhive').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilflower').style.width = parseInt(document.querySelector('.BS').value) + "px"
    document.querySelector('.lilbeeprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.lilhiveprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.lilflowerprev').style.width = parseInt(document.querySelector('.BSP').value) + "px"
    document.querySelector('.bg').style.height = parseInt(document.querySelector('.BS').value)*parseInt(document.querySelector('.TITLECLEAR').value) + "px"
}

function acievementloop(){
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

    if (beeswaxbuffs[1] == "1"){
        document.querySelector(".bw1").style.backgroundColor = "green"
    }
    else if (beeswaxbuffs[1] != "1" && hive.beeswax > 100 && bees.queen.bees >= 1){
        document.querySelector(".bw1").style.backgroundColor = "lightgreen"
    }

    //CREATION
    if (hive.nectar >= 1){
        document.querySelector(".cr0").style.backgroundColor = "lightgreen"
    } else {
        document.querySelector(".cr0").style.backgroundColor = "lightgray"
    }

    if (hive.honey >= 10){
        document.querySelector(".cr1").style.backgroundColor = "lightgreen"
        document.querySelector(".cr2").style.backgroundColor = "lightgreen"
    } else {
        document.querySelector(".cr1").style.backgroundColor = "lightgray"
        document.querySelector(".cr2").style.backgroundColor = "lightgray"
    }

    if (totalBee()+1 <= hive.bees && hive.honey >= 100*((bees.queen.bees+1)**2)){
        document.querySelector(".cr3").style.backgroundColor = "lightgreen"
    } else {
        document.querySelector(".cr3").style.backgroundColor = "lightgray"
    }

    localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees, "achievements": achievements, "skin": skin, "beeswaxbuffs": beeswaxbuffs}))
}

let gamelife = setInterval(gameloop, 10)
let aclife = setInterval(acievementloop, 200)