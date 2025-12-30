let version = 3

let player = {
    "money": 10,
    "machines": {
        "tboiSlot": {
            "spinning": false,
            "held": 0
        },
        "tboiBlood": {
            "spinning": false,
            "lastDono": 0
        }
    }
}

let saveData = localStorage.getItem("VideoGameGambling")
if (saveData != null){
    saveData = JSON.parse(saveData)
    let keys = Object.keys(saveData.machines)
    player.money = saveData.money
    for (let x = 0; x < keys.length; x++){
        player.machines[keys[x]] = saveData.machines[keys[x]]
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
    document.querySelector(".tboiCash").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(player.money + "", "none", "isaacA")
}

loadBGs()

setInterval(()=>{
    if (player.money <= 0){
        document.querySelector(".failsafe").style.marginTop = "0px"
    } else {
        document.querySelector(".failsafe").style.marginTop = "-18px"
    }

    if (Date.now() - player.machines.tboiBlood.lastDono < 60000){
        document.querySelector(".tboiBloodTimer").innerHTML = `<div style="width: 15px; height: 15px; margin: -3px; margin-right: 2px; background-image: url(img/tboi/refreshUI.png);"></div>` + renderString(60-Math.floor((Date.now() - player.machines.tboiBlood.lastDono)/1000) + "s", "none", "isaacA")
    } else {
        document.querySelector(".tboiBloodTimer").innerHTML = `<div style="width: 15px; height: 15px; margin: -3px; margin-right: 2px; background-image: url(img/tboi/refreshUI.png);"></div><div>${renderString("READY", "none", "isaacA")}</div><div style="margin-left: -6px; margin-top: 9px">${renderString("X", "none", "isaacA")}</div>`
    }

    refreshMoneyCount()
}, 1000/60)

setInterval(()=>{
    localStorage.setItem("VideoGameGambling", JSON.stringify(player))
}, 1000)