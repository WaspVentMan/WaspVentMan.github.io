const numb = document.querySelector(".numb")
const perc = document.querySelector(".perc")
const numbmps = document.querySelector(".numbmps")
const percmps = document.querySelector(".percmps")
const numbtps = document.querySelector(".numbtps")
const perctps = document.querySelector(".perctps")

function bee(){
    document.querySelector('.gen3addnumb').textContent = '🐝'
    document.querySelector('.gen3addperc').textContent = 'Bee Space'
    return "Bee-ster egg enabled!"
}

let money = 1
let mps = 0
let last_tick = Date.now()

let defaultvals = [
    [1e2, 1e5, 1e15],
    [1e5, 1e15, 1e30],
    [false, false, false],
    [0, 0, 0],
    [1, 1, 1]
]

let cost = defaultvals[0]
let autocost = defaultvals[1]
let autobuy = defaultvals[2]
let owned = defaultvals[3]
let multi = defaultvals[4]
let tcost = defaultvals[0]
let tautocost = defaultvals[1]
let tautobuy = defaultvals[2]
let towned = defaultvals[3]
let tmulti = defaultvals[4]
let tokens = 0
let upgrades = [false, false, false, false, false, false, false]
let upgradescost = [1e1, 1e1, 1e2, 1e3, 1e1, 1e2, 1e3]
let seen = [false, false, false, false, false, false]

let rates = [[1.15, 1.1], [2, 1.15], [4, 1.2]]
let trates = [[2, 1.05], [4, 1.025], [8, 1.01]]

let numbperc = [0, 0]

let saveData = localStorage.getItem("OBFUSCATION100")
if (saveData == null){
    localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": money, "cost": cost, "autobuy": autobuy, "autocost": autocost, "owned": owned, "multi": multi, "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen}))

    location.reload()
}

function obfuscate(value){
    numbperc = value.toExponential().split("e+")

    if (Math.round((((numbperc[0]-1)*10)/90)*10000)/100 != 0){
        numbperc[0] = `(${Math.round((((numbperc[0]-1)*10)/90)*10000)/100}%)`
    } else (
        numbperc[0] = "(0%)"
    )

    if (numbperc[1] == undefined){
        numbperc[1] = 0
    }

    numbperc[2] = numbperc[1] + ' ' + numbperc[0]

    return numbperc
}

function purchase(x){
    if (money >= cost[x]){
        money -= cost[x]; owned[x] += 1; cost[x] *= rates[x][0]; multi[x] *= rates[x][1]
    }
    let numbperc = obfuscate(cost[x])
    document.querySelector('.gen' + (x+1) + 'cost').textContent = numbperc[2]
}

function tpurchase(x){
    if (tokens >= tcost[x]){
        tokens -= tcost[x]; towned[x] += 1; tcost[x] *= trates[x][0]; tmulti[x] *= trates[x][1]
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
    if (tokens >= tautocost[x]){
        tokens -= tautocost[x]; tautobuy[x] = !tautobuy[x]
        document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
        tautocost[x] = 0

        if (!autobuy[x]){
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
            autobuy[x] = !autobuy[x]
            document.querySelector('.gen' + (x)).setAttribute('disabled', true)
            autocost[x] = 0
        }
    }
}

function setup(){
    document.querySelector('.gen3addnumb').textContent = ":)"
    document.querySelector('.gen3addperc').textContent = "Free Space"

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

    cost = defaultvals[0]
    autocost = defaultvals[1]
    autobuy = defaultvals[2]
    owned = defaultvals[3]
    multi = defaultvals[4]
    tcost = defaultvals[0]
    tautocost = defaultvals[1]
    tautobuy = defaultvals[2]
    towned = defaultvals[3]
    tmulti = defaultvals[4]
    tokens = 0
    upgrades = [false, false, false, false, false, false, false]
    upgradescost = [1e1, 1e1, 1e2, 1e3, 1e1, 1e2, 1e3]
    seen = [false, false, false, false, false, false]

    rates = [[1.15, 1.1], [2, 1.15], [4, 1.2]]
    trates = [[2, 1.05], [4, 1.025], [8, 1.01]]

    numbperc = [0, 0]

    saveData = localStorage.getItem("OBFUSCATION100")

    document.querySelector('.gen1').removeAttribute('disabled')
    document.querySelector('.gen2').removeAttribute('disabled')
    document.querySelector('.gen3').removeAttribute('disabled')

    document.querySelector('.auto1cost').textContent = "5"
    document.querySelector('.auto2cost').textContent = "15"
    document.querySelector('.auto3cost').textContent = "30"

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
            autobuy[x] = !autobuy[x]
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

    if (seen[0]){
        document.querySelector('.clickzone').style.visibility = "visible"
    } if (seen[1]){
        document.querySelector('.gen1zone').style.visibility = "visible"
    } if (seen[2]){
        document.querySelector('.gen2zone').style.visibility = "visible"
    } if (seen[3]){
        document.querySelector('.gen3zone').style.visibility = "visible"
    } if (seen[4]){
        document.querySelector('.tokenzone').style.visibility = "visible"
    } if (seen[5]){
        document.querySelector('.upgradezone').style.visibility = "visible"
    } 

    for (let x = 0; x < upgrades.length; x++){
        if (upgrades[x]){
            document.querySelector('.upgrade' + (x+1)).setAttribute('disabled', true)
        }
    }

    function gameloop(){
        numbperc = obfuscate(money)

        numb.textContent = numbperc[1]
        perc.textContent = numbperc[0]

        numbperc = obfuscate(owned[0]*10*multi[0]*(tokens+1))

        numbmps.textContent = "+" + numbperc[1] + "/s"
        percmps.textContent = numbperc[0]

        numbperc = obfuscate(towned[0]*10*tmulti[0]/1000)

        numbtps.textContent = "+" + numbperc[1] + "/s"
        perctps.textContent = numbperc[0]

        owned[1] += ((owned[2]/10*multi[2]*(tokens+1) / 1000) * (Date.now() - last_tick))
        owned[0] += ((owned[1]/10*multi[1]*(tokens+1) / 1000) * (Date.now() - last_tick))
        money += ((owned[0]*10*multi[0]*(tokens+1) / 1000) * (Date.now() - last_tick))

        towned[1] += ((towned[2]/10*tmulti[2] / 10000) * (Date.now() - last_tick))
        towned[0] += ((towned[1]/10*tmulti[1] / 10000) * (Date.now() - last_tick))
        tokens += ((towned[0]/10*tmulti[0] / 10000) * (Date.now() - last_tick))
        last_tick = Date.now()

        if (autobuy[0]){purchase(0)}
        if (autobuy[1]){purchase(1)}
        if (autobuy[2]){purchase(2)}

        localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": money, "cost": cost, "autobuy": autobuy, "autocost": autocost, "owned": owned, "multi": multi, "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen}))

        if (tokens >= 1e100){
            tokens = 1e100
        }

        if (money >= 1e100){
            tokens += 1
            localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": 1, "cost": defaultvals[0], "autobuy": defaultvals[2],  "owned": defaultvals[3], "multi": defaultvals[4], "last_tick": last_tick, "tokens": tokens, "tcost": tcost, "tautobuy": tautobuy, "tautocost": tautocost, "towned": towned, "tmulti": tmulti, "upgrades": upgrades, "seen": seen}))
            clearInterval(life)
            numb.textContent = "100"
            perc.textContent = "(0%)"
            document.querySelector('.gen3addnumb').textContent = ":("
            document.querySelector('.gen3addperc').textContent = "Scroll Down"
            document.querySelector('.an_ending').style.visibility = "visible"
            document.querySelector('.reset').removeAttribute('disabled')

            if (upgrades[4]){
                setup()
                document.querySelector('.reset').setAttribute('disabled', true)
            }
        }

        for (let x = 0; x < 3; x++){
            if (autobuy[x]){
                document.querySelector('.gen' + (x+1)).setAttribute('disabled', true)
                document.querySelector('.auto' + (x+1) + 'cost').textContent = 'ON'
            } else if (autocost[x] == 0){
                document.querySelector('.gen' + (x+1)).removeAttribute('disabled')
                document.querySelector('.auto' + (x+1) + 'cost').textContent = 'OFF'
            }
            let numbperc = obfuscate(cost[x])
            document.querySelector('.gen' + (x+1) + 'cost').textContent = numbperc[2]
        }

        if (money >= 1e2){
            document.querySelector('.gen1').style.visibility = "visible"
            document.querySelector('.clickzone').style.visibility = "visible"
            seen[0] = true
        }

        if (owned[0] != 0){
            document.querySelector('.gen1').style.visibility = "visible"
            document.querySelector('.gen1count').style.visibility = "visible"
            document.querySelector('.auto1').style.visibility = "visible"
            document.querySelector('.gen2').style.visibility = "visible"
            document.querySelector('.mps').style.visibility = "visible"
            document.querySelector('.gen1zone').style.visibility = "visible"
            document.querySelector('.gen1numb').textContent = obfuscate(owned[0])[1]
            document.querySelector('.gen1perc').textContent = obfuscate(owned[0])[0]
            seen[1] = true
        }

        if (owned[1] != 0){
            document.querySelector('.gen2count').style.visibility = "visible"
            document.querySelector('.gen1add').style.visibility = "visible"
            document.querySelector('.auto2').style.visibility = "visible"
            document.querySelector('.gen3').style.visibility = "visible"
            document.querySelector('.gen2zone').style.visibility = "visible"
            document.querySelector('.gen2numb').textContent = obfuscate(owned[1])[1]
            document.querySelector('.gen2perc').textContent = obfuscate(owned[1])[0]
            document.querySelector('.gen1addnumb').textContent = "+" + obfuscate(owned[1]/10*multi[1]*(tokens+1))[1] + "/s"
            document.querySelector('.gen1addperc').textContent = obfuscate(owned[1]/10*multi[1]*(tokens+1))[0]
            seen[2] = true
        }

        if (owned[2] != 0){
            document.querySelector('.gen3count').style.visibility = "visible"
            document.querySelector('.gen2add').style.visibility = "visible"
            document.querySelector('.gen3add').style.visibility = "visible"
            document.querySelector('.auto3').style.visibility = "visible"
            document.querySelector('.gen3zone').style.visibility = "visible"
            document.querySelector('.gen3numb').textContent = obfuscate(owned[2])[1]
            document.querySelector('.gen3perc').textContent = obfuscate(owned[2])[0]
            document.querySelector('.gen2addnumb').textContent = "+" + obfuscate(owned[2]/10*multi[2]*(tokens+1))[1] + "/s"
            document.querySelector('.gen2addperc').textContent = obfuscate(owned[2]/10*multi[2]*(tokens+1))[0]
            seen[3] = true
        }

        if (tokens != 0 || seen[4]){
            document.querySelector('.tokenlabel').style.visibility = "visible"
            document.querySelector('.tgen1').style.visibility = "visible"
            document.querySelector('.tokencount').style.visibility = "visible"
            document.querySelector('.mult').style.visibility = "visible"
            document.querySelector('.tokenzone').style.visibility = "visible"
            document.querySelector('.tnumb').textContent = obfuscate(tokens)[1]
            document.querySelector('.tperc').textContent = obfuscate(tokens)[0]
            document.querySelector('.numbmult').textContent = obfuscate(tokens+1)[1] + "x"
            document.querySelector('.percmult').textContent = obfuscate(tokens+1)[0]
            seen[4] = true
        }

        if (tokens > 1e1 || seen[5]){
            document.querySelector('.upgradelabel').style.visibility = "visible"
            document.querySelector('.upgradezone').style.visibility = "visible"
            document.querySelector('.upgrade1').style.visibility = "visible"
            document.querySelector('.upgrade2').style.visibility = "visible"
            document.querySelector('.upgrade3').style.visibility = "visible"
            document.querySelector('.upgrade4').style.visibility = "visible"
            document.querySelector('.upgrade5').style.visibility = "visible"
            document.querySelector('.upgrade6').style.visibility = "visible"
            document.querySelector('.upgrade7').style.visibility = "visible"
            document.querySelector('.upgrade8').style.visibility = "visible"
        }

        if (towned[0] != 0){
            document.querySelector('.tgen1count').style.visibility = "visible"
            document.querySelector('.tauto1').style.visibility = "visible"
            document.querySelector('.tgen2').style.visibility = "visible"
            document.querySelector('.tps').style.visibility = "visible"
            document.querySelector('.tgen1zone').style.visibility = "visible"
            document.querySelector('.tgen1numb').textContent = obfuscate(towned[0])[1]
            document.querySelector('.tgen1perc').textContent = obfuscate(towned[0])[0]
            seen[1] = true
        }

        if (towned[1] != 0){
            document.querySelector('.tgen2count').style.visibility = "visible"
            document.querySelector('.tgen1add').style.visibility = "visible"
            document.querySelector('.tauto2').style.visibility = "visible"
            document.querySelector('.tgen3').style.visibility = "visible"
            document.querySelector('.tgen2zone').style.visibility = "visible"
            document.querySelector('.tgen2numb').textContent = obfuscate(towned[1])[1]
            document.querySelector('.tgen2perc').textContent = obfuscate(towned[1])[0]
            document.querySelector('.tgen1addnumb').textContent = "+" + obfuscate(towned[1]/10*tmulti[1]/10)[1] + "/s"
            document.querySelector('.tgen1addperc').textContent = obfuscate(towned[1]/10*tmulti[1]/10)[0]
            seen[2] = true
        }

        if (towned[2] != 0){
            document.querySelector('.tgen3count').style.visibility = "visible"
            document.querySelector('.tgen2add').style.visibility = "visible"
            document.querySelector('.tgen3add').style.visibility = "visible"
            document.querySelector('.tauto3').style.visibility = "visible"
            document.querySelector('.tgen3zone').style.visibility = "visible"
            document.querySelector('.tgen3numb').textContent = obfuscate(towned[2])[1]
            document.querySelector('.tgen3perc').textContent = obfuscate(towned[2])[0]
            document.querySelector('.tgen2addnumb').textContent = "+" + obfuscate(towned[2]/10*tmulti[2]/10)[1] + "/s"
            document.querySelector('.tgen2addperc').textContent = obfuscate(towned[2]/10*tmulti[2]/10)[0]
            seen[3] = true
        }
    ;}

    life = setInterval(gameloop, 1000/60)
}

setup()