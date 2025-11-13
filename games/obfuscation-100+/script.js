const numb = document.querySelector(".numb")
const perc = document.querySelector(".perc")
const numbmps = document.querySelector(".numbmps")
const percmps = document.querySelector(".percmps")
const numbtps = document.querySelector(".numbtps")
const perctps = document.querySelector(".perctps")

if (screen.width < 500){
    document.head.innerHTML += `<link rel="stylesheet" href="mobile.css">`
}

let money = 0
let mps = 0
let last_tick = Date.now()

let defaultvals = [
    [1e2, 1e5, 1e15],
    [1e5, 1e15, 1e30],
    [false, false, false],
    [0, 0, 0],
    [1, 1, 1]
]

let cost = Object.assign([], defaultvals[0])
let autocost = Object.assign([], defaultvals[1])
let autobuy = Object.assign([], defaultvals[2])
let owned = Object.assign([], defaultvals[3])
let multi = Object.assign([], defaultvals[4])
let tcost = Object.assign([], defaultvals[0])
let tautocost = Object.assign([], defaultvals[1])
let tautobuy = Object.assign([], defaultvals[2])
let towned = Object.assign([], defaultvals[3])
let tmulti = Object.assign([], defaultvals[4])
let tokens = 0
let upgrades = [false, false, false, false, false, false, false, false, false]
let upgradescost = [1e1, 1e1, 1e2, 1e3, 1e1, 1e2, 1e3, 1e10, 1e5]
let seen = [false, false, false, false, false, false]
let start = Date.now()

let rates = [[1.15, 1.1], [2, 1.15], [4, 1.2]]
let trates = [[2, 1.5], [4, 1.75], [8, 2]]

let numbperc = [0, 0]

let saveData = localStorage.getItem("OBFUSCATION100")
if (saveData == null){
    localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": money, "cost": cost, "autobuy": autobuy, "autocost": autocost, "owned": owned, "multi": multi, "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen, "start": start}))

    location.reload()
}

function obfuscate(value){
    let numbperc = ""
    try {
        numbperc = value.toExponential().split("e+")

        numbperc[0] = `(${Math.round(numbperc[0]*1000)/100}%)`

        if (numbperc[1] == undefined){
            numbperc[1] = 0
        }

        numbperc[2] = numbperc[1] + ' ' + numbperc[0]
    } catch {
        numbperc = "ERROR"
    }
    
    return numbperc
}

function basicClick(){
    if (money + tokens + upgrades.reduce((a, b) => a + b, 0) + seen.reduce((a, b) => a + b, 0) == 0){
        start = Date.now()
    }
    money += 10*(tokens+1)
}

function purchase(x){
    if (money >= cost[x]){
        if (!upgrades[7]){
            money -= cost[x]
        }

        if (!offline && owned[x] + tokens + upgrades.reduce((a, b) => a + b, 0) == 0){
            NGIO.postScore(15101+x, Date.now() - start, function(){})
        }

        owned[x] += 1
        cost[x] *= rates[x][0]
        multi[x] *= rates[x][1]
    }
    let numbperc = obfuscate(cost[x])
    document.querySelector('.gen' + (x+1) + 'cost').textContent = numbperc[2]
}

function tpurchase(x){
    if (tokens >= tcost[x]){
        tokens -= tcost[x]

        if (!offline && towned[x] == 0){
            NGIO.postScore(15105+x, Date.now() - start, function(){})
        }
        
        towned[x] += 1
        tcost[x] *= trates[x][0]
        tmulti[x] *= trates[x][1]
    }
    let numbperc = obfuscate(tcost[x])
    document.querySelector('.tgen' + (x+1) + 'cost').textContent = numbperc[2]
}

function purchaseauto(x){
    if (money >= autocost[x]){
        money -= autocost[x]; autobuy[x] = !autobuy[x]
        document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
        autocost[x] = 0

        if (!autobuy[x]){
            document.querySelector('.gen' + (x+1)).removeAttribute('disabled')
            document.querySelector('.auto' + (x+1) + 'cost').textContent = 'OFF'
        }
    }
}

function tpurchaseauto(x){
    console.log(x)
    if (tokens >= tautocost[x]){
        tokens -= tautocost[x]; tautobuy[x] = !tautobuy[x]
        document.querySelector('.tgen' + (x+1)).setAttribute('disabled', true)
        tautocost[x] = 0

        document.querySelector('.tauto' + (x+1) + 'cost').textContent = 'ON'

        if (!tautobuy[x]){
            document.querySelector('.tgen' + (x+1)).removeAttribute('disabled')
            document.querySelector('.tauto' + (x+1) + 'cost').textContent = 'OFF'
        }
    }
}

function purchaseupgrade(x){
    if (tokens >= upgradescost[x]){
        tokens -= upgradescost[x]; upgrades[x] = true
        document.querySelector('.upgrade' + (x+1)).setAttribute('disabled', true)
        if (autocost[x-1] != 0 && x != 0 && x < 4){
            autobuy[x-1] = true
            document.querySelector('.gen' + (x)).setAttribute('disabled', true)
            autocost[x-1] = 0
        }
    }
}

function an_ending(button = false){
    clearInterval(life)
    numb.textContent = "100"
    perc.textContent = "(0%)"
    document.querySelector('.gen3addnumb').textContent = ":("
    document.querySelector('.gen3addperc').textContent = "Scroll Down"
    document.querySelector('.an_ending').style.display = "block"
    document.querySelector('.reset').removeAttribute('disabled')

    if (upgrades[4] || button){
        tokens += 10
        document.querySelector('.reset').setAttribute('disabled', true)

        localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": 1, "cost": defaultvals[0], "autobuy": defaultvals[2],  "owned": defaultvals[3], "multi": defaultvals[4], "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen, "start": start}))
        console.log(JSON.stringify({"money": 1, "cost": defaultvals[0], "autobuy": defaultvals[2],  "owned": defaultvals[3], "multi": defaultvals[4], "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen, "start": start}))
        setup()
    }
}

function the_ending(){
    document.querySelector(".finale").style.animation = "theEnd 4s 1 ease-in-out"
    unlockMedal(80118)
    
    if (!offline){
        NGIO.postScore(14080, Date.now() - start, function(){})
    }

    setTimeout(function(){
        clearInterval(life);
        localStorage.removeItem('OBFUSCATION100')
        location.reload()
    }, 3500)
}

function tokenMult(){
    return Math.cbrt(tokens)+1
}

function setup(){
    document.querySelector('.gen3addnumb').textContent = ":)"
    document.querySelector('.gen3addperc').textContent = "Free Space"
    document.querySelector('.an_ending').style.display = "none"

    money = 1
    mps = 0
    last_tick = Date.now()

    defaultvals = [
        [1e2, 1e5, 1e15],
        [1e5, 1e15, 1e30],
        [false, false, false],
        [0, 0, 0],
        [1, 1, 1]
    ]

    cost = Object.assign([], defaultvals[0])
    autocost = Object.assign([], defaultvals[1])
    autobuy = Object.assign([], defaultvals[2])
    owned = Object.assign([], defaultvals[3])
    multi = Object.assign([], defaultvals[4])
    tcost = Object.assign([], defaultvals[0])
    tautocost = Object.assign([], defaultvals[1])
    tautobuy = Object.assign([], defaultvals[2])
    towned = Object.assign([], defaultvals[3])
    tmulti = Object.assign([], defaultvals[4])
    tokens = 0
    upgrades = [false, false, false, false, false, false, false, false, false]
    upgradescost = [1e1, 1e1, 1e2, 1e3, 1e1, 1e2, 1e3, 1e10, 1e5]
    seen = [false, false, false, false, false, false]
    start = undefined

    rates = [[1.15, 1.1], [2, 1.15], [4, 1.2]]
    trates = [[2, 1.5], [4, 1.75], [8, 2]]

    numbperc = [0, 0]

    document.querySelector('.gen1').removeAttribute('disabled')
    document.querySelector('.gen2').removeAttribute('disabled')
    document.querySelector('.gen3').removeAttribute('disabled')

    document.querySelector('.auto1cost').textContent = "5"
    document.querySelector('.auto2cost').textContent = "15"
    document.querySelector('.auto3cost').textContent = "30"

    saveData = localStorage.getItem("OBFUSCATION100")

    try {
        if (saveData != null){
            saveData = JSON.parse(saveData)
        }
        if (saveData.money != undefined){
            money = saveData.money
        }
        if (saveData.cost != undefined){
            cost = saveData.cost
        }
        if (saveData.autobuy != undefined){
            autobuy = saveData.autobuy
        }
        if (saveData.autocost != undefined){
            autocost = saveData.autocost
        }
        if (saveData.owned != undefined){
            owned = saveData.owned
        }
        if (saveData.multi != undefined){
            multi = saveData.multi
        }
        if (saveData.last_tick != undefined){
            last_tick = saveData.last_tick
        }
        if (saveData.tokens != undefined){
            tokens = saveData.tokens
        }
        if (saveData.tcost != undefined){
            tcost = saveData.tcost
        }
        if (saveData.tautobuy != undefined){
            tautobuy = saveData.tautobuy
        }
        if (saveData.tautocost != undefined){
            tautocost = saveData.tautocost
        }
        if (saveData.towned != undefined){
            towned = saveData.towned
        }
        if (saveData.tmulti != undefined){
            tmulti = saveData.tmulti
        }
        if (saveData.tokens != undefined){
            tokens = saveData.tokens
        }
        if (saveData.upgrades != undefined){
            upgrades = saveData.upgrades
        }
        if (saveData.seen != undefined){
            seen = saveData.seen
        }
        if (saveData.start != undefined){
            start = saveData.start
        }
    } catch {}

    numbperc = obfuscate(tcost[0])
    document.querySelector('.tgen1cost').textContent = numbperc[2]
    numbperc = obfuscate(tcost[1])
    document.querySelector('.tgen2cost').textContent = numbperc[2]
    numbperc = obfuscate(tcost[2])
    document.querySelector('.tgen3cost').textContent = numbperc[2]

    if (upgrades[0] && owned[0] == 0){
        owned[0] += 1
    }

    if (upgrades[5] && owned[1] == 0){
        owned[1] += 1
    }

    if (upgrades[6] && owned[2] == 0){
        owned[2] += 1
    }

    for (let x = 0; x < 3; x++){
        if (upgrades[x+1] && autocost[x] != 0){
            autobuy[x] = true
            document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
            autocost[x] = 0
        }
    }

    for (let x = 0; x < 3; x++){
        if (upgrades[x+1] && autocost[x] != 0){
            tautobuy[x] = !autobuy[x]
            document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
            autocost[x] = 0
        }
    }

    for (let x = 0; x < defaultvals[0].length; x++){
        if (cost[x] == undefined){
            cost[x] = defaultvals[0][x]
            autocost[x] = defaultvals[1][x]
            autobuy[x] = defaultvals[2][x]
            owned[x] = defaultvals[3][x]
            multi[x] = defaultvals[4][x]
        }
    }

    for (let x = 0; x < 5; x++){
        if (upgrades[x] == undefined){
            upgrades[x] == false
        }
    }

    for (let x = 0; x < upgrades.length; x++){
        if (upgrades[x]){
            document.querySelector('.upgrade' + (x+1)).setAttribute('disabled', true)
        }
    }

    while (upgrades.length < 9){
        upgrades.push(false)
    }

    life = setInterval(gameloop, 1000/60)
}

function gameloop(){
    unlockMedal(80088)
    numbperc = obfuscate(money)

    numb.textContent = numbperc[1]
    perc.textContent = numbperc[0]

    numbperc = obfuscate((owned[0]*10*multi[0]*(tokenMult())))

    numbmps.textContent = "+" + numbperc[1] + "/s"
    percmps.textContent = numbperc[0]

    numbperc = obfuscate((towned[0]/10*tmulti[0] / 1))

    numbtps.textContent = "+" + numbperc[1] + "/s"
    perctps.textContent = numbperc[0]

    owned[1] += ((owned[2]/10*multi[2]*(tokenMult()) / 1000) * (Date.now() - last_tick))
    owned[0] += ((owned[1]/10*multi[1]*(tokenMult()) / 1000) * (Date.now() - last_tick))
    money += ((owned[0]*10*multi[0]*(tokenMult()) / 1000) * (Date.now() - last_tick))

    towned[1] += ((towned[2]/10*tmulti[2] / 1000) * (Date.now() - last_tick))
    towned[0] += ((towned[1]/10*tmulti[1] / 1000) * (Date.now() - last_tick))
    tokens += ((towned[0]/10*tmulti[0] / 1000) * (Date.now() - last_tick))
    last_tick = Date.now()

    if (tokens >= 1e100){
        tokens = 1e100
        document.querySelector('.finale').style.outlineColor = "gold"
    } else {
        document.querySelector('.finale').style.outlineColor = "black"
    }

    if (money >= 1e100){
        unlockMedal(80070)
        an_ending()

        try {
            if (!offline && tokens + upgrades.reduce((a, b) => a + b, 0) == 0){
                NGIO.postScore(15104, (Date.now() - start), function(){})
            }
        } catch {}
        
    }

    if (upgrades[8]){
        if (autobuy[0]){while(money >= cost[0]){purchase(0)}}
        if (autobuy[1]){while(money >= cost[1]){purchase(1)}}
        if (autobuy[2]){while(money >= cost[2]){purchase(2)}}
    } else {
        if (autobuy[0]){purchase(0)}
        if (autobuy[1]){purchase(1)}
        if (autobuy[2]){purchase(2)}
    }

    if (tautobuy[0]){tpurchase(0)}
    if (tautobuy[1]){tpurchase(1)}
    if (tautobuy[2]){tpurchase(2)}

    localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": money, "cost": cost, "autobuy": autobuy, "autocost": autocost, "owned": owned, "multi": multi, "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen, "start": start}))

    if (money >= 1e50){
        unlockMedal(80069)
    }

    unlockMedal(80079, autobuy[0])
    unlockMedal(80082, autobuy[0] && autobuy[1] && autobuy[2])

    for (let x = 0; x < 3; x++){
        if (autobuy[x]){
            document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
            document.querySelector('.auto' + (x+1) + 'cost').textContent = 'ON'
            document.querySelector('.auto' + (x+1)).style.outlineColor = "black"
        } else if (autocost[x] == 0){
            document.querySelector('.gen' + (x+1)).removeAttribute('disabled')
            document.querySelector('.auto' + (x+1) + 'cost').textContent = 'OFF'
            document.querySelector('.auto' + (x+1)).style.outlineColor = "black"
        } else {
            if (money >= autocost[x]){
                document.querySelector('.auto' + (x+1)).style.outlineColor = "gold"
            } else {
                document.querySelector('.auto' + (x+1)).style.outlineColor = "black"
            }
        }

        let numbperc = obfuscate(cost[x])
        document.querySelector('.gen' + (x+1) + 'cost').textContent = numbperc[2]

        if (money >= cost[x]){
            document.querySelector('.gen' + (x+1)).style.outlineColor = "gold"
        } else {
            document.querySelector('.gen' + (x+1)).style.outlineColor = "black"
        }
    }

    for (let x = 0; x < 3; x++){
        if (tautobuy[x]){
            document.querySelector('.tgen' + (x+1)).setAttribute('disabled', true)
            document.querySelector('.tauto' + (x+1) + 'cost').textContent = 'ON'
            document.querySelector('.tauto' + (x+1)).style.outlineColor = "black"
            unlockMedal([80084,80086,80087][x])
        } else if (tautocost[x] == 0){
            document.querySelector('.tgen' + (x+1)).removeAttribute('disabled')
            document.querySelector('.tauto' + (x+1) + 'cost').textContent = 'OFF'
            document.querySelector('.tauto' + (x+1)).style.outlineColor = "black"
        } else {
            if (tokens >= tautocost[x]){
                document.querySelector('.tauto' + (x+1)).style.outlineColor = "gold"
            } else {
                document.querySelector('.tauto' + (x+1)).style.outlineColor = "black"
            }
        }

        let numbperc = obfuscate(tcost[x])
        document.querySelector('.tgen' + (x+1) + 'cost').textContent = numbperc[2]

        if (tokens >= tcost[x]){
            document.querySelector('.tgen' + (x+1)).style.outlineColor = "gold"
        } else {
            document.querySelector('.tgen' + (x+1)).style.outlineColor = "black"
        }
    }

    for (let x = 0; x < upgrades.length; x++ ){
        if (upgrades[x]){
            document.querySelector('.upgrade' + (x+1)).style.outlineColor = "black"
        } else if (tokens >= upgradescost[x]){
            document.querySelector('.upgrade' + (x+1)).style.outlineColor = "gold"
        } else {
            document.querySelector('.upgrade' + (x+1)).style.outlineColor = "black"
        }
    }

    unlockMedal(80068, money >= 1e1)

    if (money >= 1e2 || seen[0] == true){
        document.querySelector('.gen1').style.visibility = "visible"
        document.querySelector('.gen1zone').style.display = "flex"
        seen[0] = true
    }

    if (owned[0] != 0 || seen[1] == true){
        document.querySelector('.gen1').style.visibility = "visible"
        document.querySelector('.gen1count').style.visibility = "visible"
        document.querySelector('.auto1').style.visibility = "visible"
        document.querySelector('.gen2').style.visibility = "visible"
        document.querySelector('.mps').style.visibility = "visible"
        document.querySelector('.gen2zone').style.display = "flex"
        document.querySelector('.gen1numb').textContent = obfuscate(owned[0])[1]
        document.querySelector('.gen1perc').textContent = obfuscate(owned[0])[0]
        seen[1] = true

        unlockMedal(80078)
    }

    if (owned[1] != 0 || seen[2] == true){
        document.querySelector('.gen2count').style.visibility = "visible"
        document.querySelector('.gen1add').style.visibility = "visible"
        document.querySelector('.auto2').style.visibility = "visible"
        document.querySelector('.gen3').style.visibility = "visible"
        document.querySelector('.gen3zone').style.display = "flex"
        document.querySelector('.gen2numb').textContent = obfuscate(owned[1])[1]
        document.querySelector('.gen2perc').textContent = obfuscate(owned[1])[0]
        document.querySelector('.gen1addnumb').textContent = "+" + obfuscate(owned[1]/10*multi[1]*(tokenMult()))[1] + "/s"
        document.querySelector('.gen1addperc').textContent = obfuscate(owned[1]/10*multi[1]*(tokenMult()))[0]
        seen[2] = true
        unlockMedal(80080)
    }

    if (owned[2] != 0 || seen[3] == true){
        document.querySelector('.gen3count').style.visibility = "visible"
        document.querySelector('.gen2add').style.visibility = "visible"
        document.querySelector('.gen3add').style.visibility = "visible"
        document.querySelector('.auto3').style.visibility = "visible"
        document.querySelector('.gen3numb').textContent = obfuscate(owned[2])[1]
        document.querySelector('.gen3perc').textContent = obfuscate(owned[2])[0]
        document.querySelector('.gen2addnumb').textContent = "+" + obfuscate(owned[2]/10*multi[2]*(tokenMult()))[1] + "/s"
        document.querySelector('.gen2addperc').textContent = obfuscate(owned[2]/10*multi[2]*(tokenMult()))[0]
        seen[3] = true
        unlockMedal(80081)
    }

    if (tokens != 0 || seen[4]){
        document.querySelector('.tgen1').style.visibility = "visible"
        document.querySelector('.tokencount').style.visibility = "visible"
        document.querySelector('.mult').style.visibility = "visible"
        document.querySelector('.tokenzone').style.display = "flex"
        document.querySelector('.tgen1zone').style.display = "flex"
        document.querySelector('.tnumb').textContent = obfuscate(tokens)[1]
        document.querySelector('.tperc').textContent = obfuscate(tokens)[0]
        document.querySelector('.numbmult').textContent = obfuscate(tokenMult())[1] + "x"
        document.querySelector('.percmult').textContent = obfuscate(tokenMult())[0]
        seen[4] = true
    }

    if (tokens >= 1e1 || seen[5]){
        document.querySelector('.upgradelabel').style.visibility = "visible"
        document.querySelector('.upgradezone1').style.display = "flex"
        document.querySelector('.upgradezone2').style.display = "flex"
        document.querySelector('.upgradezone3').style.display = "flex"
        document.querySelector('.upgrade1').style.visibility = "visible"
        document.querySelector('.upgrade2').style.visibility = "visible"
        document.querySelector('.upgrade5').style.visibility = "visible"
        seen[5] = true
    }

    if (tokens >= 1e50 || seen[6]){
        document.querySelector('.finale').style.visibility = "visible"
        document.querySelector('.the_ending').style.display = "flex"
        unlockMedal(80122)
        seen[6] = true
    }

    if (towned[0] != 0){
        document.querySelector('.tgen1count').style.visibility = "visible"
        document.querySelector('.tauto1').style.visibility = "visible"
        document.querySelector('.tgen2').style.visibility = "visible"
        document.querySelector('.tps').style.visibility = "visible"
        document.querySelector('.tgen2zone').style.display = "flex"
        document.querySelector('.tgen1numb').textContent = obfuscate(towned[0])[1]
        document.querySelector('.tgen1perc').textContent = obfuscate(towned[0])[0]
        unlockMedal(80077)
    }

    if (towned[1] != 0){
        document.querySelector('.tgen2count').style.visibility = "visible"
        document.querySelector('.tgen1add').style.visibility = "visible"
        document.querySelector('.tauto2').style.visibility = "visible"
        document.querySelector('.tgen3').style.visibility = "visible"
        document.querySelector('.tgen3zone').style.display = "flex"
        document.querySelector('.tgen2numb').textContent = obfuscate(towned[1])[1]
        document.querySelector('.tgen2perc').textContent = obfuscate(towned[1])[0]
        document.querySelector('.tgen1addnumb').textContent = "+" + obfuscate(towned[1]/10*tmulti[1]/10)[1] + "/s"
        document.querySelector('.tgen1addperc').textContent = obfuscate(towned[1]/10*tmulti[1]/10)[0]
        unlockMedal(80083)
    }

    if (towned[2] != 0){
        document.querySelector('.tgen3count').style.visibility = "visible"
        document.querySelector('.tgen2add').style.visibility = "visible"
        document.querySelector('.tgen3add').style.visibility = "visible"
        document.querySelector('.tauto3').style.visibility = "visible"
        document.querySelector('.finale').style.visibility = "visible"
        document.querySelector('.tgen3numb').textContent = obfuscate(towned[2])[1]
        document.querySelector('.tgen3perc').textContent = obfuscate(towned[2])[0]
        document.querySelector('.tgen2addnumb').textContent = "+" + obfuscate(towned[2]/10*tmulti[2]/10)[1] + "/s"
        document.querySelector('.tgen2addperc').textContent = obfuscate(towned[2]/10*tmulti[2]/10)[0]
        unlockMedal(80085)
    }

    if (upgrades[1]){
        document.querySelector('.upgrade3').style.visibility = "visible"
        unlockMedal(80072)
    }

    if (upgrades[2]){
        document.querySelector('.upgrade4').style.visibility = "visible"
    }

    if (upgrades[3]){
        document.querySelector('.the_ending').style.display = "flex"
        document.querySelector('.upgrade9').style.visibility = "visible"
    }

    if (upgrades[0]){
        document.querySelector('.upgrade6').style.visibility = "visible"
        unlockMedal(80074)
    }

    if (upgrades[5]){
        document.querySelector('.upgrade7').style.visibility = "visible"
    }

    if (upgrades[8]){
        document.querySelector('.upgrade8').style.visibility = "visible"
        unlockMedal(80121)
    }

    unlockMedal(80076, upgrades[4])
    unlockMedal(80120, upgrades[7])
    unlockMedal(80073, upgrades[1] && upgrades[2] && upgrades[3])
    unlockMedal(80075, upgrades[0] && upgrades[5] && upgrades[6])
    unlockMedal(80119, upgrades[0] && upgrades[1] && upgrades[2] && upgrades[3] && upgrades[4] && upgrades[5] && upgrades[6] && upgrades[7] && upgrades[8])
}

setup()