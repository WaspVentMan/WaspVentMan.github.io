const numb = document.querySelector(".numb")
const perc = document.querySelector(".perc")
const numbmps = document.querySelector(".numbmps")
const percmps = document.querySelector(".percmps")

let money = 1
let mps = 0
let last_tick = Date.now()

let cost = [100, 1e5]
let autobuy = [false, false]
let owned = [0, 0]
let multi = [1, 1]

let numbperc = [0, 0]

function gameloop(){
    numbperc = money.toExponential().split("e+")

    numb.textContent = numbperc[1]

    if (Math.round((((numbperc[0]-1)*10)/90)*10000)/100 != 0){
        perc.textContent = `(${Math.round((((numbperc[0]-1)*10)/90)*10000)/100}%)`
    } else (
        perc.textContent = ""
    )

    numbperc = (owned[0]*10*multi[0]).toExponential().split("e+")

    numbmps.textContent = numbperc[1] + "/s"

    if (Math.round((((numbperc[0]-1)*10)/90)*10000)/100 != 0){
        percmps.textContent = `(${Math.round((((numbperc[0]-1)*10)/90)*10000)/100}%)`
    } else (
        percmps.textContent = ""
    )

    owned[0] += ((owned[1]/10*multi[1] / 1000) * (Date.now() - last_tick))
    money += ((owned[0]*10*multi[0] / 1000) * (Date.now() - last_tick))
    last_tick = Date.now()

    if (autobuy[0]){
        if (money >= cost[0]){
            money -= cost[0]; owned[0] += 1; cost[0] *= 1.15; multi[0] *= 1.1

            let numbperc = cost[0].toExponential().split('e+')

            document.querySelector('.gen1cost').textContent = numbperc[1] + ' (' + Math.round((((numbperc[0]-1)*10)/90)*10000)/100 + '%)'
        }
    }
    if (autobuy[1]){
        if (money >= cost[1]){
            money -= cost[1]; owned[1] += 1; cost[1] *= 2; multi[1] *= 1.05

            let numbperc = cost[1].toExponential().split('e+')

            document.querySelector('.gen2cost').textContent = numbperc[1] + ' (' + Math.round((((numbperc[0]-1)*10)/90)*10000)/100 + '%)'
        }
    }
}

function kill(name){
    clearInterval(name)
    //localStorage.setItem("savedataobfuscation100")
}
life = setInterval(gameloop, 0)