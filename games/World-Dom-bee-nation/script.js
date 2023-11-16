let params = new URL(document.location).searchParams
let code = params.get("b")

if (code != undefined){
    try{
        code = atob(atob(atob(atob(atob(code)))))
    } catch {
        location.href = location.href.split("?")[0]
    }
}

let hive = {}
let bees = {}

let decpla = "0.00a"

let skinselect = "bee"

let rawstring = ["0"]

for (let x = 0; x < 8; x++){
    rawstring = rawstring.concat(rawstring)
}

let achievements = rawstring.concat(rawstring)
let beeswaxbuffs = rawstring.concat(rawstring)
let unlockedskin = rawstring.concat(rawstring)

let skin = {"bee": "bee", "hive": "hive", "flower": "flower"}

let manager = true

let saveData = localStorage.getItem("BEE_IDLE")
let lastchild = Date.now()
let lastmanage = Date.now()

let buycount = 1

try{
    if (saveData != null){
        saveData = JSON.parse(saveData)
    
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
        if (saveData.unlockedskin != undefined){
            unlockedskin = saveData.unlockedskin
        }
        if (bees.constructor != undefined){
            delete bees.constructor
        }
    }
}
catch{console.log(":(")}

savecheck()

/**
 * Returns the total number of bees that aren't unemployed
 * @returns the total number of bees that aren't unemployed */
function totalBee(){return bees.swarmqueue + bees.swarm.bees + bees.worker.bees + bees.constructors.bees + bees.queen.bees}

/**
 * Sets bee, hive or flower to the current value of skinselect, does nothing if skin is locked.
 * @param {*} newskin Type of cosmetic to be equipped, either "bee", "hive" or "flower"
 * @param {*} i Used at first launch to apply cosmetics from save file
 */
function updateskin(newskin, i=true){
    if (!i){
        document.querySelector(".lil" + newskin).src = "img/" + skin[newskin] + ".png"
        document.querySelector(".lil" + newskin + "prev").src = "img/" + skin[newskin] + ".png"
    }
    if (unlockedskin[skinselect] == "1"){
        if (i){
            skin[newskin] = beeslist[skinselect].img
        }
        document.querySelector(".lil" + newskin).src = "img/" + skin[newskin] + ".png"
        document.querySelector(".lil" + newskin + "prev").src = "img/" + skin[newskin] + ".png"
    }
}

unlockedskin[0] = "1"
unlockedskin[1] = "1"
unlockedskin[2] = "1"
unlockedskin[7] = "1"

if (code != null){
    console.log("code")
    for (let x = 0; x < beeslist.length; x++){
        if (beeslist[x].img == code){
            skin.bee = code
            unlockedskin[x] = "1"
            localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees, "achievements": achievements, "skin": skin, "beeswaxbuffs": beeswaxbuffs, "unlockedskin": unlockedskin}))
            location.href = location.href.split("?")[0]
        }
    }
}

updateskin("bee", i=false)
updateskin("hive", i=false)
updateskin("flower", i=false)

let skip = 0
for (let x = 0; x < loadorder.length; x++){
    let temp = ""
    if (loadorder[x] != null){
        temp = document.createElement("img")
        temp.src = "img/" + beeslist[loadorder[x]].img + ".png"
        temp.style.width = "64px"
        temp.style.filter = "opacity(50%) contrast(0%)"
        temp.className = "select" + (x -skip)

        temp.onclick = function(){skinselect = loadorder[x]; cosprevupdate(loadorder[x])}
    } else {
        skip += 1
        temp = document.createElement("br")
    }
    document.querySelector(".cosgrid").appendChild(temp)
}

/**
 * Updates the cosmetic preview
 * @param {*} x Cosmetic ID
 */
function cosprevupdate(x){
    if (unlockedskin[x] == "1"){
        document.querySelector(".cosprev").src = "img/" + beeslist[x].img + ".png"
        document.querySelector(".cosname").textContent = beeslist[x].name
        document.querySelector(".cosinternal").textContent = "(" + beeslist[x].img + ")"
        document.querySelector(".cosart").textContent = beeslist[x].artist
        document.querySelector(".cosart").href = beeslist[x].artistlink
    }
}

cosprevupdate(0)

const hiveVars = ["beeswax", "honey", "nectar", "bees"] // "beeswaxcap", "honeycap", "nectarcap", "beecap", 

let t = Date.now()

/**
 * Main gameloop, controls almost everything
 */
function gameloop(){
    for (let x = 0; x < hiveVars.length; x++){
        document.querySelector("." + hiveVars[x]).textContent = numeral(hive[hiveVars[x]]).format(decpla)
        if (x >= 4){
            document.querySelector("." + hiveVars[x]).textContent += "/"
        }
    }

    if (bees.swarmqueue == 0){
        document.querySelector(".swarm").textContent = numeral(bees.swarm.bees).format(decpla)
    } else {
        document.querySelector(".swarm").textContent = numeral(bees.swarm.bees).format(decpla) + " (" + numeral(bees.swarmqueue).format('0a') + ")"
    }

    document.querySelector(".unemployed").textContent = numeral(hive["bees"]-totalBee()).format(decpla)
    document.querySelector(".worker").textContent = numeral(bees.worker.bees).format(decpla)
    document.querySelector(".constructors").textContent = numeral(bees.constructors.bees).format(decpla)
    document.querySelector(".queen").textContent = numeral(bees.queen.bees).format(decpla)

    if (manager){
        document.querySelector(".manager").textContent = "On"
    } else {
        document.querySelector(".manager").textContent = "Off"
    }
    

    document.querySelector('.queencost').textContent = numeral(100*((bees.queen.bees+1)**2)).format(decpla) + ' HNY'

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
        while (bees.swarm.pos + beemove > 5000 && bees.swarm.pos - beemove < 0){
            if (bees.swarm.to){
                document.querySelector(".lilbee").style.transform = "scaleX(1)"
                let temp = 5000 - bees.swarm.pos
                bees.swarm.pos += beemove
                if (bees.swarm.pos >= 5000){
                    bees.swarm.to = false

                    beemove -= temp
                    bees.swarm.pos = 5000
                }
            }

            else {
                document.querySelector(".lilbee").style.transform = "scaleX(-1)"
                let temp = bees.swarm.pos
                bees.swarm.pos -= beemove
                if (bees.swarm.pos <= 0){
                    bees.swarm.to = true

                    beemove -= temp
                    bees.swarm.pos = 0

                    hive.nectar += bees.swarm.bees
                }
            }
        }

        if (bees.swarm.to){
            document.querySelector(".lilbee").style.transform = "scaleX(1)"
            bees.swarm.pos += beemove
            if (bees.swarm.pos >= 5000){
                bees.swarm.to = false
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

                hive.nectar += bees.swarm.bees
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

    if (document.querySelector('.DP').value == "2"){
        document.querySelector('.DPdisp').textContent = numeral(document.querySelector('.DP').value).format(decpla) + " (Default)"
        decpla = "0"
        if (document.querySelector('.DP').value != "0"){decpla += ".0"}
        if (document.querySelector('.DP').value == "2"){decpla += "0"}
        else if (document.querySelector('.DP').value == "3"){decpla += "00"}
        decpla += "a"
    } else {
        document.querySelector('.DPdisp').textContent = numeral(document.querySelector('.DP').value).format(decpla)
        decpla = "0"
        if (document.querySelector('.DP').value != "0"){decpla += ".0"}
        if (document.querySelector('.DP').value == "2"){decpla += "0"}
        else if (document.querySelector('.DP').value == "3"){decpla += "00"}
        decpla += "a"
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

/**
 * Same as gameloop, but updates things that don't need to be updated as frequently
 */
function acievementloop(){
    // SKINS
    let skip = 0
    for (let x = 0; x < loadorder.length; x++){
        if (loadorder[x] == null){
            skip += 1; continue
        }
        if (unlockedskin[(x -skip)] == "1"){
            document.querySelector(".select"+(x -skip)).style.filter = ""
        }
    }

    // ACHIEVEMENTS
    if (achievements[0] == "1" || bees.swarm.bees > 0){
        unlockedskin[6] = "1"
        achievements[0] = "1"
        document.querySelector(".ac0").style.backgroundColor = "green"
    }

    if (achievements[1] == "1" || bees.swarm.bees > 0 && bees.worker.bees > 0 && bees.constructors.bees > 0){
        unlockedskin[3] = "1"
        achievements[1] = "1"
        document.querySelector(".ac1").style.backgroundColor = "green"
    }

    if (achievements[2] == "1" || hive.beeswax >= 100){
        unlockedskin[4] = "1"
        achievements[2] = "1"
        document.querySelector(".ac2").style.backgroundColor = "green"
    }

    if (achievements[3] == "1" || bees.queen.bees > 0){
        unlockedskin[5] = "1"
        achievements[3] = "1"
        document.querySelector(".ac3").style.backgroundColor = "green"
    }

    if (achievements[4] == "1" || beeswaxbuffs[1] == "1"){
        unlockedskin[9] = "1"
        achievements[4] = "1"
        document.querySelector(".ac4").style.backgroundColor = "green"
    }

    if (achievements[5] == "1" || hive.bees > 1000000000){
        unlockedskin[8] = "1"
        achievements[5] = "1"
        document.querySelector(".ac5").style.backgroundColor = "green"
    }

    if (achievements[6] == "1" || hive.bees > 2000){
        unlockedskin[14] = "1"
        achievements[6] = "1"
        document.querySelector(".ac6").style.backgroundColor = "green"
    }

    if (achievements[7] == "1" || hive.bees > 20000){
        unlockedskin[15] = "1"
        achievements[7] = "1"
        document.querySelector(".ac7").style.backgroundColor = "green"
    }

    // BEESWAXBUFFS
    if (beeswaxbuffs[0] == "1"){
        document.querySelector(".bw0").style.backgroundColor = "green"
    }
    else if (beeswaxbuffs[0] != "1" && hive.beeswax > 100){
        document.querySelector(".bw0").style.backgroundColor = "lightgreen"
    } else {
        document.querySelector(".bw0").style.backgroundColor = "lightgrey"
    }

    if (beeswaxbuffs[1] == "1"){
        document.querySelector(".bw1").style.backgroundColor = "green"
    }
    else if (beeswaxbuffs[1] != "1" && hive.beeswax > 100 && bees.queen.bees >= 1){
        document.querySelector(".bw1").style.backgroundColor = "lightgreen"
    } else {
        document.querySelector(".bw1").style.backgroundColor = "lightgrey"
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

    localStorage.setItem("BEE_IDLE", JSON.stringify({"hive": hive, "bees": bees, "achievements": achievements, "skin": skin, "beeswaxbuffs": beeswaxbuffs, "unlockedskin": unlockedskin}))
}

let gamelife = setInterval(gameloop, 10)
let aclife = setInterval(acievementloop, 200)