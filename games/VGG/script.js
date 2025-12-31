let version = 4

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
            "lastDono": 0
        },
        "tboiClaw": {
            "spinning": false,
            "lastDono": 0
        }
    },
    "upgrades": {

    },
    "options": {
        "tboiDonoSFX": true,
        "tboiSlotSFX": true,
        "tboiClawSFX": true
    }
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

function tboiToggleOption(option){
    player.options[option] = !player.options[option]
    document.querySelector("."+option).style.backgroundImage = ["url(img/tboi/options/off.png)", "url(img/tboi/options/on.png)"][player.options[option]+0]
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
    document.querySelector(".tboiCash").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(player.money + "", "none", "isaacA")
    document.querySelector(".nsmbCash").innerHTML = `<div style="width: 16px; height: 16px; margin: -1px; margin-right: 0px; background-image: url(img/nsmb/coin.png);"></div>` + renderString(Math.floor(player.money/100) + "", "none", "nsmbPissSmall") + `<div style="width: 3px; height: 15px; background-image: url(img/nsmb/decimal.png);"></div><div style="margin-top: 6px">` + renderString(["", "0"][(player.money - (Math.floor(player.money/100)*100) < 10) + 0] + (player.money - (Math.floor(player.money/100)*100)) + "", "none", "nsmbPissSuperSmall") + `</div>`
}

loadBGs()

setInterval(()=>{
    if (Date.now() - player.machines.tboiBlood.lastDono >= 60000){
        if (player.machines.tboiBlood.lastDono != 0){
            if (player.options.tboiDonoSFX){playSound("sfx/tboi/battery charge.wav", 25)}
            player.machines.tboiBlood.lastDono = 0
        }
    }

    document.querySelector(".tboiBloodTimer2").style.width = Math.min(Math.floor((Date.now() - player.machines.tboiBlood.lastDono)/10000)/6, 1)*24 + "px"
    document.querySelector(".tboiSlotTimer").style.width = Math.min((Date.now() - player.machines.tboiSlot.last)/750, 1)*24 + "px"

    refreshMoneyCount()
}, 1000/60)

setInterval(()=>{
    localStorage.setItem("VideoGameGambling", JSON.stringify(player))
}, 1000)