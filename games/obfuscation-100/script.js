const numb = document.querySelector(".numb")
const perc = document.querySelector(".perc")
const numbmps = document.querySelector(".numbmps")
const percmps = document.querySelector(".percmps")

let money = 1
let mps = 0
let last_tick = Date.now()

let defaultvals = [
    [1e2, 1e5, 1e15, 1e1],
    [1e5, 1e15, 1e30, 1e100],
    [false, false, false, false],
    [0, 0, 0, 0],
    [1, 1, 1, 1]
]

let cost = defaultvals[0]
let autocost = defaultvals[1]
let autobuy = defaultvals[2]
let owned = defaultvals[3]
let multi = defaultvals[4]
let tokens = 0
let upgrades = [false, false, false, false]
let upgradescost = [1e1, 1e1, 1e2, 1e3]
let seen = [false, false, false, false, false, false]

let rates = [[1.15, 1.1], [2, 1.15], [4, 1.2], [2, 1.01]]

let numbperc = [0, 0]

let saveData = localStorage.getItem("OBFUSCATION100")

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

if (upgrades[0] && owned[0] == 0){
    owned[0] += 1
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

for (let x = 0; x < 4; x++){
    if (upgrades[x] == undefined){
        upgrades[x] == false
    }
}

function bee(){
    document.querySelector('.gen3addnumb').textContent = '🐝'
    document.querySelector('.gen3addperc').textContent = 'Bee Space'
    return "Bee-ster egg enabled!"
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

function purchase(x){
    if (money >= cost[x]){
        money -= cost[x]; owned[x] += 1; cost[x] *= rates[x][0]; multi[x] *= rates[x][1]
    }
    let numbperc = obfuscate(cost[x])
    document.querySelector('.gen' + (x+1) + 'cost').textContent = numbperc[2]
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

function purchaseupgrade(x){
    if (tokens >= upgradescost[x]){
        tokens -= upgradescost[x]; upgrades[x] = true
        document.querySelector('.upgrade' + (x+1)).setAttribute('disabled', true)
        if (autocost[x-1] != 0 && x != 0){
            autobuy[x] = !autobuy[x]
            document.querySelector('.gen' + (x)).setAttribute('disabled', true)
            autocost[x] = 0
        }
    }
}

function gameloop(){
    numbperc = obfuscate(money)

    numb.textContent = numbperc[1]
    perc.textContent = numbperc[0]

    numbperc = obfuscate(owned[0]*10*multi[0]*(tokens+1))

    numbmps.textContent = "+" + numbperc[1] + "/s"
    percmps.textContent = numbperc[0]

    owned[1] += ((owned[2]/10*multi[2]*(tokens+1) / 1000) * (Date.now() - last_tick))
    owned[0] += ((owned[1]/10*multi[1]*(tokens+1) / 1000) * (Date.now() - last_tick))
    money += ((owned[0]*10*multi[0]*(tokens+1) / 1000) * (Date.now() - last_tick))
    last_tick = Date.now()

    if (autobuy[0]){purchase(0)}
    if (autobuy[1]){purchase(1)}
    if (autobuy[2]){purchase(2)}

    localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": money, "cost": cost, "autobuy": autobuy, "autocost": autocost, "owned": owned, "multi": multi, "last_tick": last_tick, "tokens": tokens, "upgrades": upgrades, "seen": seen}))

    if (money >= 1e100){
        tokens += 1
        localStorage.setItem("OBFUSCATION100", JSON.stringify({"money": 1, "cost": defaultvals[0], "autobuy": defaultvals[2],  "owned": defaultvals[3], "multi": defaultvals[4], "last_tick": last_tick, "tokens": tokens, "upgrades": upgrades, "seen": seen}))
        clearInterval(life)
        numb.textContent = "100"
        perc.textContent = ""
        document.querySelector('.an_ending').style.visibility = "visible"
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
        document.querySelector('.tokencount').style.visibility = "visible"
        document.querySelector('.mult').style.visibility = "visible"
        document.querySelector('.tokenzone').style.visibility = "visible"
        document.querySelector('.upgradezone').style.visibility = "visible"
        document.querySelector('.tnumb').textContent = obfuscate(tokens)[1]
        document.querySelector('.tperc').textContent = obfuscate(tokens)[0]
        document.querySelector('.numbmult').textContent = obfuscate(tokens+1)[1] + "x"
        document.querySelector('.percmult').textContent = obfuscate(tokens+1)[0]
        seen[4] = true
        seen[5] = true
    }

    if (tokens > 1e1 || seen[5]){
        document.querySelector('.upgrade1').style.visibility = "visible"
        document.querySelector('.upgrade2').style.visibility = "visible"
        document.querySelector('.upgrade3').style.visibility = "visible"
        document.querySelector('.upgrade4').style.visibility = "visible"
    }
;}

function kill(name){
    clearInterval(name)
    //localStorage.setItem("savedataobfuscation100")

    console.log("Killed: " + name)
}
life = setInterval(gameloop, 0)