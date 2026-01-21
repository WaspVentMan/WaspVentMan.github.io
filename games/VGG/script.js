let version = 10

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
        },
        "nsmbPoker": {
            "hand": [],
            "discard": [false, false, false, false, false],
            "dealerHand": [],
            "played": false,
            "bet": 0
        },
        "sonic2Slot": {
            "spinning": false,
            "last": ["sonic", "jackpot", "tails"],
            "held": 0
        },
        "mscRettipokka": {
            "hand": [],
            "discard": [false, false, false, false, false],
            "dealerHand": [],
            "played": false,
            "bet": 0,
            "pelit": 0,
            "voitot": 0
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

const textIcons = {
    "tboiCoin": `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>`,
    "nsmbCoin": `<div style="width: 16px; height: 16px; margin: -1px; margin-right: 0px; background-image: url(img/nsmb/coin.png);"></div>`,
    "sonic2Ring": `<div style="width: 16px; height: 16px; margin-right: 2px; background-image: url(img/sonic2/ring.png);"></div>`,
    "sonic2RingText": `<div style="width: 40px; height: 11px; margin-right: 8px; background-image: url(img/sonic2/rings.png);"></div>`,
    "nsmbDecimal": `<div style="width: 3px; height: 15px; background-image: url(img/nsmb/decimal.png);"></div><div style="margin-top: 6px">`,
    "nsmbHierarchy": {
        "startOdd": `<div style="width: 20px; height: 17px; margin-left: 19px; background-image: url(img/nsmb/hierarchy/`,
        "endOdd": `.png);"></div>`,
        "startEven": `<div style="width: 20px; height: 17px; background-image: url(img/nsmb/hierarchy/`,
        "endEven": `.png);"></div>`
    },
    "nsmbCard": {
        "start": `<div onclick="`,
        "mid": `" style="width: 32px; height: 48px; margin: 2px; margin-top: -192px; transition: all 0.05s linear; background-image: url(img/nsmb/card/`,
        "end": `.png);"></div>`
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

function randomListItem(list){
    return list[Math.floor(Math.random()*list.length)]
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
    document.querySelector(".cash").innerHTML = player.money
    document.querySelector(".tboiCash").innerHTML = textIcons.tboiCoin + renderString(player.money + "", "none", "isaacA")
    document.querySelector(".tboiExchangeCash").innerHTML = textIcons.tboiCoin + renderString(player.money + "", "none", "isaacA")
    document.querySelector(".nsmbCash").innerHTML = textIcons.nsmbCoin + renderString(Math.floor(player.money/100) + "", "none", "nsmbPissSmall") + textIcons.nsmbDecimal + renderString(["", "0"][(player.money - (Math.floor(player.money/100)*100) < 10) + 0] + (player.money - (Math.floor(player.money/100)*100)) + "", "none", "nsmbPissSuperSmall") + `</div>`
    document.querySelector(".nsmbExchangeCash").innerHTML = textIcons.nsmbCoin + renderString(Math.floor(player.money/100) + "", "none", "nsmbPissSmall") + textIcons.nsmbDecimal + renderString(["", "0"][(player.money - (Math.floor(player.money/100)*100) < 10) + 0] + (player.money - (Math.floor(player.money/100)*100)) + "", "none", "nsmbPissSuperSmall") + `</div>`
    document.querySelector(".sonic2Cash").innerHTML = textIcons.sonic2RingText + renderString(Math.floor(player.money) + "", "none", "sonic2UI") + `</div>`
    document.querySelector(".sonic2ExchangeCash").innerHTML = textIcons.sonic2RingText + renderString(Math.floor(player.money) + "", "none", "sonic2UI") + `</div>`
    document.querySelector(".mscCash").innerHTML = `<div style="font-family: FugazOne; color: yellow; text-shadow: 1.5px 1.5px black; margin-right: 4px">MONEY</div><div style="background-color: black; color: white; font-family: FugazOne; padding-left: 2px; padding-right: 2px; min-width: 75px; text-align: left;">${Math.floor(player.money*0.0428)/100}</div>`
    document.querySelector(".mscExchangeCash").innerHTML = `<div style="font-family: FugazOne; color: yellow; text-shadow: 1.5px 1.5px black; margin-right: 8px">MONEY</div><div style="background-color: black; color: white; font-family: FugazOne; padding-left: 2px; padding-right: 2px; min-width: 75px; text-align: left;">${Math.floor(player.money*0.0428)/100}</div>`
}

loadBGs()

setInterval(()=>{
    document.querySelector(".tboiBloodTimer").style.width = Math.min(Math.floor((Date.now() - player.machines.tboiBlood.last)/10000)/6, 1)*24 + "px"
    document.querySelector(".tboiSlotTimer").style.width = Math.min(Math.floor((Date.now() - player.machines.tboiSlot.last)/250)/3, 1)*24 + "px"
    document.querySelector(".tboiClawTimer").style.width = Math.min(Math.floor((Date.now() - player.machines.tboiClaw.last)/1000)/5, 1)*24 + "px"

    if (player.options.tboiDonoAuto && player.upgrades.tboiDonoAuto){
        document.querySelector(".tboiAutoBloodTimer").style.width = Math.min(Math.floor(Math.max(Date.now() - player.machines.tboiBlood.last-60000, 0)/10000)/6, 1)*24 + "px"
        if (Date.now() - player.machines.tboiBlood.last >= 120000){
            tboiBloodDonate()
        }
    } else {
        document.querySelector(".tboiAutoBloodTimer").style.width = "0px"
    }

    if (player.options.tboiSlotAuto && player.upgrades.tboiSlotAuto){
        document.querySelector(".tboiAutoSlotTimer").style.width = Math.min(Math.floor(Math.max((Date.now() - player.machines.tboiSlot.last-750), 0)/250)/3, 1)*24 + "px"
        if (Date.now() - player.machines.tboiSlot.last >= 1500){
            tboiSlotRoll()
        }
    } else {
        document.querySelector(".tboiAutoSlotTimer").style.width = "0px"
    }

    if (player.options.tboiClawAuto && player.upgrades.tboiClawAuto){
        document.querySelector(".tboiAutoClawTimer").style.width = Math.min(Math.floor(Math.max((Date.now() - player.machines.tboiClaw.last-5000), 0)/1000)/5, 1)*24 + "px"
        if (Date.now() - player.machines.tboiClaw.last >= 10000){
            tboiClaw()
        }
    } else {
        document.querySelector(".tboiAutoClawTimer").style.width = "0px"
    }

    if (player.money < 0){
        player.money = 0
    }
}, 250)

setInterval(()=>{
    localStorage.setItem("VideoGameGambling", JSON.stringify(player))
}, 1000)