let version = 6

let player = {
    "money": 10,
    "machines": {
        "tboiSlot": {
            "spinning": false,
            "last": 0,
            "held": 0
        },
        "tboiBlood": {
            "spinning": false,
            "last": 0
        },
        "tboiClaw": {
            "spinning": false,
            "last": 0
        }
    },
    "upgrades": {
        "tboiDonoAuto": false,
        "tboiSlotAuto": false,
        "tboiClawAuto": false
    },
    "options": {
        "tboiDonoSFX": true,
        "tboiSlotSFX": true,
        "tboiClawSFX": true,
        "tboiDonoAuto": true,
        "tboiSlotAuto": true,
        "tboiClawAuto": true
    }
}

const upgrades = {
    "tboiDonoAuto": 100,
    "tboiSlotAuto": 1000,
    "tboiClawAuto": 1e100
}

let saveData = localStorage.getItem("VideoGameGambling")
if (saveData != null){
    saveData = JSON.parse(saveData)
    player.money = saveData.money
    if (saveData.upgrades != undefined){
        let keys = Object.keys(saveData.machines)
        for (let x = 0; x < keys.length; x++){
            player.machines[keys[x]] = saveData.machines[keys[x]]
        }
    }
    if (saveData.upgrades != undefined){
        let keys = Object.keys(saveData.upgrades)
        for (let x = 0; x < keys.length; x++){
            player.upgrades[keys[x]] = saveData.upgrades[keys[x]]
        }
    }
    if (saveData.options != undefined){
        let keys = Object.keys(saveData.options)
        for (let x = 0; x < keys.length; x++){
            player.options[keys[x]] = saveData.options[keys[x]]
        }
    }
}

function poorFailsafe(){
    if (player.money <= 0){
        player.money++
        refreshMoneyCount()
    }
}

function loadBGs(){
    document.querySelector(".tboiBG").innerHTML = `
    <div style="width: 234px; height: 156px; background-image: url(img/tboi/bg/arcade${Math.floor(Math.random()*4)}.png);">
        <div style="width: 181px; height: 103px; margin: 53px; background-image: url(img/tboi/bg/arcadeFloor${Math.floor(Math.random()*6)}.png);"></div>
    </div>
    <div style="width: 234px; height: 156px; background-image: url(img/tboi/bg/arcade${Math.floor(Math.random()*4)}.png); transform: scaleX(-1);">
        <div style="width: 181px; height: 103px; margin: 53px; background-image: url(img/tboi/bg/arcadeFloor${Math.floor(Math.random()*6)}.png);"></div>
    </div>
    <div style="width: 234px; height: 156px; background-image: url(img/tboi/bg/arcade${Math.floor(Math.random()*4)}.png); transform: scaleY(-1);">
        <div style="width: 181px; height: 103px; margin: 53px; background-image: url(img/tboi/bg/arcadeFloor${Math.floor(Math.random()*6)}.png);"></div>
    </div>
    <div style="width: 234px; height: 156px; background-image: url(img/tboi/bg/arcade${Math.floor(Math.random()*4)}.png); transform: scale(-1);">
        <div style="width: 181px; height: 103px; margin: 53px; background-image: url(img/tboi/bg/arcadeFloor${Math.floor(Math.random()*6)}.png);"></div>
    </div>`
}

function refreshMoneyCount(){
    document.querySelector(".tboiCash").innerHTML = tboiTextIcons.coin + renderString(player.money + "", "none", "isaacA")
    document.querySelector(".nsmbCash").innerHTML = `<div style="width: 16px; height: 16px; margin: -1px; margin-right: 0px; background-image: url(img/nsmb/coin.png);"></div>` + renderString(Math.floor(player.money/100) + "", "none", "nsmbPissSmall") + `<div style="width: 3px; height: 15px; background-image: url(img/nsmb/decimal.png);"></div><div style="margin-top: 6px">` + renderString(["", "0"][(player.money - (Math.floor(player.money/100)*100) < 10) + 0] + (player.money - (Math.floor(player.money/100)*100)) + "", "none", "nsmbPissSuperSmall") + `</div>`
}

loadBGs()

setInterval(()=>{
    document.querySelector(".tboiBloodTimer").style.width = Math.min(Math.floor((Date.now() - player.machines.tboiBlood.last)/10000)/6, 1)*24 + "px"
    document.querySelector(".tboiSlotTimer").style.width = Math.min((Date.now() - player.machines.tboiSlot.last)/750, 1)*24 + "px"
    document.querySelector(".tboiClawTimer").style.width = Math.min((Date.now() - player.machines.tboiClaw.last)/5000, 1)*24 + "px"

    refreshMoneyCount()

    if (player.options.tboiDonoAuto && player.upgrades.tboiDonoAuto){
        document.querySelector(".tboiAutoBloodTimer").style.width = Math.min(Math.floor(Math.max(Date.now() - player.machines.tboiBlood.last-60000, 0)/10000)/6, 1)*24 + "px"
        if (Date.now() - player.machines.tboiBlood.last >= 120000){
            tboiBloodDonate()
        }
    }

    if (player.options.tboiSlotAuto && player.upgrades.tboiSlotAuto){
        document.querySelector(".tboiAutoSlotTimer").style.width = Math.min(Math.max((Date.now() - player.machines.tboiSlot.last-750)/750, 0), 1)*24 + "px"
        if (Date.now() - player.machines.tboiSlot.last >= 1500){
            tboiSlotRoll()
        }
    }

    if (player.options.tboiClawAuto && player.upgrades.tboiClawAuto){
        document.querySelector(".tboiAutoClawTimer").style.width = Math.min(Math.max((Date.now() - player.machines.tboiClaw.last-5000)/5000, 0), 1)*24 + "px"
        if (Date.now() - player.machines.tboiClaw.last >= 10000){
            tboiClaw()
        }
    }
}, 1000/60)

setInterval(()=>{
    localStorage.setItem("VideoGameGambling", JSON.stringify(player))
}, 1000)