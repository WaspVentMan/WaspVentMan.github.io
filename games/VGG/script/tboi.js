function tboiSlotRoll(){
    if (player.machines.tboiSlot.last == undefined){
        player.machines.tboiSlot.last = 0
    }

    if (player.money <= 0 || Date.now() - player.machines.tboiSlot.last < 750){
        return
    }
    
    player.money --
    player.machines.tboiSlot.held++
    player.machines.tboiSlot.last = Date.now()

    let drama = 0
    
    const symbols = [
        "bomb",
        "fly",
        "pill",
        "key",
        "heart",
        "coin",
        "dollar"
    ]

    let results = []
    
    for (let x = 0; x < 3; x++){
        results.push(symbols[Math.floor(Math.random()*7)])
    }

    if (Math.floor(Math.random()*5) < 1 && player.money <= 10 || Math.floor(Math.random()*10) < 1){
        results[1] = results[0]
        results[2] = results[0]
    }

    player.machines.tboiSlot.spinning = true
    if (player.options.tboiSlotSFX){playSound("sfx/tboi/coin slot.wav", 25)}
    
    let life = setInterval(()=>{
        if (!player.machines.tboiSlot.spinning){
            clearInterval(life)
            return
        }

        let spinny = ""
        for (let x = 0; x < 3; x++){
            if (x >= drama){
                spinny += `<div style="width: 9px; height: 10px; background-image: url(img/tboi/slot/spin${Math.ceil(Math.random()*6)}.png); user-select: none;"></div>`
            } else {
                spinny += `<div style="width: 9px; height: 10px; background-image: url(img/tboi/slot/${results[x]}.png); user-select: none;"></div>`
            }
        }
        document.querySelector(".tboiSlotSymbol").innerHTML = spinny
    }, 0)
    setTimeout(()=>{document.querySelector(".tboiSlotMachine").style.backgroundImage = "url(img/tboi/slot/machinePull.png"}, 50)
    setTimeout(()=>{document.querySelector(".tboiSlotMachine").style.backgroundImage = "url(img/tboi/slot/machinePullFull.png"}, 100)
    setTimeout(()=>{document.querySelector(".tboiSlotMachine").style.backgroundImage = "url(img/tboi/slot/machinePull.png"}, 150)
    setTimeout(()=>{document.querySelector(".tboiSlotMachine").style.backgroundImage = "url(img/tboi/slot/machine.png"}, 200)
    setTimeout(()=>{drama++; if (player.options.tboiSlotSFX){playSound("sfx/tboi/chest drop 1.wav", 5)}}, 300)
    setTimeout(()=>{drama++; if (player.options.tboiSlotSFX){playSound("sfx/tboi/chest drop 1.wav", 5)}}, 400)
    setTimeout(()=>{
        player.machines.tboiSlot.spinning = false

        let change = 0
        if (results[0] == results[1] && results[1] == results[2]){
            switch (results[0]){
                case "bomb":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/chest drop 1.wav", 25)}
                    change = player.machines.tboiSlot.held
                    player.machines.tboiSlot.held = 0
                    break
                case "fly":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/fart.wav", 25)}
                    change = 1
                    break
                case "pill":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/i found pills 3.wav", 25)}
                    change = Math.ceil(Math.random()*25)
                    break
                case "key":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/key drop 2.wav", 25)}
                    change = 10
                    break
                case "heart":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/holy!.wav", 25)}
                    change = 50
                    break
                case "coin":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/penny drop 1.wav", 25)}
                    change = 25
                    break
                case "dollar":
                    if (player.options.tboiSlotSFX){playSound("sfx/tboi/superholy.wav", 25)}
                    change = 100
                    break
            }
        } else {
            if (player.options.tboiSlotSFX){playSound("sfx/tboi/thumbs down.wav", 5)}
        }

        let spinny = ""
        for (let x = 0; x < 3; x++){
            results.push(symbols[Math.floor(Math.random()*7)])
            spinny += `<div style="width: 9px; height: 10px; background-image: url(img/tboi/slot/${results[x]}.png); user-select: none;"></div>`
        }
        document.querySelector(".tboiSlotSymbol").innerHTML = spinny

        player.money += change
        
        document.querySelector(".tboiSlotOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(change + "", "none", "isaacA")
    }, 500)
}

function tboiBloodDonate(){
    if (Date.now() - player.machines.tboiBlood.lastDono < 60000){
        if (player.options.tboiDonoSFX){playSound("sfx/tboi/thumbs down.wav", 5)}
        return
    }

    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machineSlosh0.png"}, 100)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machine.png"}, 150)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machineSlosh1.png"}, 200)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machine.png"}, 250)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machineSlosh0.png"}, 300)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machine.png"}, 350)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machineSlosh1.png"}, 400)
    setTimeout(()=>{document.querySelector(".tboiBloodMachine").style.backgroundImage = "url(img/tboi/blood/machine.png"}, 450)

    let change = Math.ceil(Math.random()*10)
    player.money += change
    player.machines.tboiBlood.lastDono = Date.now()
    if (player.options.tboiDonoSFX){playSound("sfx/tboi/blood bank touched.wav", 25)}
    document.querySelector(".tboiBloodOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(change + "", "none", "isaacA")
}

function tboiClaw(){
    if (player.money < 5 || Date.now() - player.machines.tboiClaw.last < 750){
        return
    }
}

function tboiOptions(){
    if (document.querySelector(".tboiOptionsCont").style.height == "40px"){
        document.querySelector(".tboiOptionsCont").style.height = "230px"
        document.querySelector(".tboiOptions").style.backgroundImage = "url(img/tboi/bg/options.png)"
    } else {
        document.querySelector(".tboiOptionsCont").style.height = "40px"
        document.querySelector(".tboiOptions").style.backgroundImage = "url(img/tboi/bg/optionsNoPaper.png)"
    }
}

document.querySelector(".tboiBloodOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString("0", "none", "isaacA")
document.querySelector(".tboiSlotOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString("0", "none", "isaacA")
document.querySelector(".tboiClawOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString("0", "none", "isaacA")

// stupid, bad and dumb. it's perfect.
tboiToggleOption('tboiDonoSFX'); tboiToggleOption('tboiDonoSFX')
tboiToggleOption('tboiSlotSFX'); tboiToggleOption('tboiSlotSFX')
tboiToggleOption('tboiClawSFX'); tboiToggleOption('tboiClawSFX')