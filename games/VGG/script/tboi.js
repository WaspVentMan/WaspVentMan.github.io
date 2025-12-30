function tboiSlotRoll(){
    if (player.money <= 0 || player.machines.tboiSlot.spinning){
        playSound("sfx/tboi/thumbs down.wav", 5)
        return
    }
    
    player.money --
    player.machines.tboiSlot.held++
    const symbols = [
        "bomb",
        "fly",
        "pill",
        "key",
        "heart",
        "coin",
        "dollar"
    ]

    let drama = 0
    let results = []
    
    for (let x = 0; x < 3; x++){
        results.push(symbols[Math.floor(Math.random()*7)])
    }

    if (Math.floor(Math.random()*5) < 1 && player.money <= 10){
        results[1] = results[0]
        results[2] = results[0]
    }

    player.machines.tboiSlot.spinning = true
    playSound("sfx/tboi/coin slot.wav", 25)
    
    let life = setInterval(()=>{
        if (!machines.tboiSlot.spinning){
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
    setTimeout(()=>{drama++; playSound("sfx/tboi/chest drop 1.wav", 5)}, 300)
    setTimeout(()=>{drama++; playSound("sfx/tboi/chest drop 1.wav", 5)}, 400)
    setTimeout(()=>{
        player.machines.tboiSlot.spinning = false

        let change = 0
        if (results[0] == results[1] && results[1] == results[2]){
            switch (results[0]){
                case "bomb":
                    playSound("sfx/tboi/chest drop 1.wav", 25)
                    change = 1
                    break
                case "fly":
                    playSound("sfx/tboi/chest drop 1.wav", 25)
                    change = 2
                    break
                case "pill":
                    playSound("sfx/tboi/chest drop 1.wav", 25)
                    change = Math.ceil(Math.random()*10)
                    break
                case "key":
                    playSound("sfx/tboi/chest drop 1.wav", 25)
                    change = 10
                    break
                case "heart":
                    playSound("sfx/tboi/holy!.wav", 25)
                    change = 50
                    break
                case "coin":
                    playSound("sfx/tboi/penny drop 1.wav", 25)
                    change = 25
                    break
                case "dollar":
                    playSound("sfx/tboi/superholy.wav", 25)
                    change = 100
                    break
            }
        } else {
            playSound("sfx/tboi/thumbs down.wav", 5)
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
        playSound("sfx/tboi/thumbs down.wav", 5)
        return
    }

    let change = Math.ceil(Math.random()*10)
    player.money += change
    player.machines.tboiBlood.lastDono = Date.now()
    playSound("sfx/tboi/blood bank touched.wav", 25)
    document.querySelector(".tboiBloodOut").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(change + "", "none", "isaacA")
    document.querySelector(".tboiBloodTimer").innerHTML = `<div style="width: 9px; height: 11px; margin: -1px; margin-right: 2px; background-image: url(img/tboi/coinUI.png);"></div>` + renderString(change + "", "none", "isaacA")
}