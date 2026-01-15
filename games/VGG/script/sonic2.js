function sonic2SlotRoll(){
    if (player.money < 100){
        playSound("sfx/sonic2/S2_6D.wav", 25)
        return
    } else if (player.machines.sonic2Slot.spinning){
        return
    }

    player.machines.sonic2Slot.spinning = true

    player.money -= 100

    const symbols = [
        "eggman",
        "bar",
        "tails",
        "sonic",
        "jackpot"
    ]

    let results = []
    
    for (let x = 0; x < 3; x++){
        document.querySelector(".sonic2Collumn"+x).innerHTML = `<div style="width: 32px; height: 32px; background-image: url(img/sonic2/symbol/${player.machines.sonic2Slot.last[x]}.png); user-select: none;"></div>`
        document.querySelector(".sonic2Collumn"+x).style.transition = "margin-top 6s ease-in-out"
        results.push(randomListItem(symbols))
        if (results[x] == "eggman"){
            results[x] = randomListItem(symbols)
        }
    }

    for (let y = 0; y < 78; y++){
        for (let x = 0; x < 3; x++){
            document.querySelector(".sonic2Collumn"+x).innerHTML += `<div style="width: 32px; height: 32px; background-image: url(img/sonic2/symbol/${randomListItem(symbols)}.png); user-select: none;"></div>`
        }
    }

    for (let x = 0; x < 3; x++){
        setTimeout(()=>{
            document.querySelector(".sonic2Collumn"+x).style.marginTop = -(79*32) + "px"
        }, (x)*100)

        setTimeout(()=>{
            document.querySelector(".sonic2Collumn"+x).innerHTML = `<div style="width: 32px; height: 32px; background-image: url(img/sonic2/symbol/${results[x]}.png); user-select: none;"></div>`
            document.querySelector(".sonic2Collumn"+x).style.marginTop = "0px"
            document.querySelector(".sonic2Collumn"+x).style.transition = "none"

            playSound("sfx/sonic2/S2_3A.wav", 25)
        }, (x+2.5)*1000)

        setTimeout(()=>{
            document.querySelector(".sonic2Collumn"+x).style.transition = "margin-top 6s ease-in-out"
        }, (x+2.6)*1000)
        
        document.querySelector(".sonic2Collumn"+x).innerHTML += `<div style="width: 32px; height: 32px; background-image: url(img/sonic2/symbol/${results[x]}.png); user-select: none;"></div>`
    }

    for (let x = 0; x < 9; x++){
        setTimeout(()=>{
            playSound("sfx/sonic2/S2_40.wav", 25)
        }, x*300)
    }

    player.machines.sonic2Slot.last = results
    let change = 0

    let resultSymbols = {}
    for (let x = 0; x < 5; x++){
        let value = results.filter(y => y==symbols[x]).length
        if (value != 0){
            resultSymbols[symbols[x]] = value
        }
    }

    var items = Object.keys(resultSymbols).map(function(key) {
        return [key, resultSymbols[key]];
    })

    items.sort(function(first, second) {
        return second[1] - first[1];
    })
    
    setTimeout(()=>{
        if (results.includes("eggman")){
            change = -100
            if (player.money < 0){
                player.money = 0
            }
        } else if (results[0] == results[1] && results[1] == results[2]){
            if (results[0] == "sonic"){
                change = 30
            } else if (results[0] == "tails"){
                change = 25
            } else if (results[0] == "bar"){
                change = 20
            } else if (results[0] == "jackpot"){
                change = 150
            }
        } else if (results.includes("jackpot") && items[0][1] == 2){
            if (results.reduce((total,x) => total+(x=="jackpot"), 0) == 2){
                if (player.money*3 > 99900){
                    change = 999
                } else {
                    change = Math.ceil(player.money/100) * 4
                }
            } else if (items[0][1] == 2){
                if (player.money > 99900){
                    change = 999
                } else {
                    change = Math.ceil(player.money/100) * 2
                }
            }
        } else if (results.includes("bar")){
            if (results.reduce((total,x) => total+(x=="bar"), 0) == 2){
                change = 4
            } else {
                change = 2
            }
        }

        if (change > 0){
            playSound("sfx/sonic2/S2_4E.wav", 25)
        } else if (change < 0){
            playSound("sfx/sonic2/S2_46.wav", 25)
        } else {
            playSound("sfx/sonic2/S2_6D.wav", 25)
        }

        player.money += change*100
        if (player.money < 0){
            player.money = 0
        }
        refreshMoneyCount()
        document.querySelector(".sonic2CashOut").innerHTML = textIcons.sonic2RingText + renderString(change + "", "none", "sonic2UI") + `</div>`

        player.machines.sonic2Slot.spinning = false
    }, 4600)
}

for (let x = 0; x < 3; x++){
    document.querySelector(".sonic2Collumn"+x).innerHTML = `<div style="width: 32px; height: 32px; background-image: url(img/sonic2/symbol/${player.machines.sonic2Slot.last[x]}.png); user-select: none;"></div>`
}