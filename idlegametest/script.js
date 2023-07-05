let cashMoney = 1
let auto = []

let unlocked = 0

let last = Date.now()

let saveData = localStorage.getItem("savedata")

try{
    if (saveData != null){
        saveData = JSON.parse(saveData)

        auto = saveData.auto
        cashMoney = saveData.cashMoney
        last = saveData.last
        unlocked = saveData.unlocked

        for (let x = 0; x <= unlocked; x++){
            addButton(x, true)

            if (auto[x].autobuy){
                document.querySelector(`.autobuy${x}`).remove()
            }
        }
    } else {
        console.log("No save data detected, proceeding with fresh data.")

        addButton(unlocked)
    }
} catch {
    localStorage.clear()
    console.log("Data is corrupt.")
    location.reload()
}

let lastSave = Date.now()

function exponentFilter(number, dp = 2){
    if (number >= (10**5)){
        number = number.toExponential(3).replace("+", "")
    } else {
        number = Math.round(number*(10**dp))/(10**dp)
    }

    return number
}

function purchase(id){
    if (cashMoney >= auto[id].cost){
        cashMoney -= auto[id].cost
        auto[id].count++
        auto[id].mult *= 1.05
        auto[id].cost *= 1.25
    }
}

function purchaseAutobuy(id){
    if (cashMoney >= auto[id].autobuyCost){
        cashMoney -= auto[id].autobuyCost
        auto[id].autobuy = true
    }
}

function addButton(id, dataless = false){
    let buttoncontainer = document.createElement("div")
    let newbutton = document.createElement("button")

    buttoncontainer.style.margin = "2px"
    newbutton.className = `autoButton${id}`

    temp = [
        document.createElement("p"),
        document.createElement("br"),
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("button")
    ]

    temp[0].className = `name${id}`
    temp[2].className = `multi${id}`
    temp[3].className = `auto${id}`
    temp[4].className = `owned${id}`
    temp[5].className = `autobuy${id}`

    temp[0].textContent = `auto ${id+1}`
    temp[2].textContent = `x`
    temp[3].textContent = `cost: ${10 ** (id+1)}`
    temp[4].textContent = `owned: 0`
    temp[5].textContent = `autobuyer: ${exponentFilter(10 ** ((id+3)*1.25))}`

    newbutton.appendChild(temp[0])
    newbutton.appendChild(temp[1])
    newbutton.appendChild(temp[2])
    newbutton.appendChild(temp[3])
    newbutton.appendChild(temp[4])

    if (!dataless){
        auto.push({"cost": 10 ** ((id)*1.1249), "autobuyCost": 10 ** ((id+3)*1.25), "count": 0, "mult": 1, "autobuy": false})
    }

    buttoncontainer.appendChild(newbutton)
    buttoncontainer.appendChild(document.createElement("br"))
    buttoncontainer.appendChild(temp[5])
    document.querySelector(".autoHolder").appendChild(buttoncontainer)

    document.querySelector(`.autoButton${id}`).onclick = function(){
        purchase(id)
    }

    document.querySelector(`.autobuy${id}`).onclick = function(){
        purchaseAutobuy(id)
    }
}

function gameloop(){
    cashMoney += (auto[0].count*((Date.now()-last)/10000))*auto[0].mult

    for (let x = 0; x < unlocked; x++){
        auto[x].count += (auto[x+1].count*((Date.now()-last)/10000))*auto[x+1].mult

        document.querySelector(`.owned${x}`).textContent = `owned: ${exponentFilter(auto[x].count, 0)}`
    }

    for (let x = 0; x <= unlocked; x++){
        if (auto[x].autobuy){
            purchase(x)
            
            try{
                document.querySelector(`.autobuy${x}`).remove()
            } catch {}
        }

        document.querySelector(`.auto${x}`).textContent = `cost: ${exponentFilter(auto[x].cost)}`
        document.querySelector(`.multi${x}`).textContent = `x${exponentFilter(auto[x].mult, 2)}`
    }

    last = Date.now()

    document.querySelector(`.cashMoney`).textContent = exponentFilter(cashMoney)
    document.querySelector(`.stats`).textContent = `${exponentFilter((auto[0].count/10)*auto[0].mult)}/s`

    if (auto[unlocked].count != 0){
        unlocked++

        addButton(unlocked)
    }

    if ((lastSave+1000) < Date.now()){
        localStorage.setItem("savedata", JSON.stringify({"auto": auto, "cashMoney": cashMoney,  "last": last, "unlocked": unlocked}))
    }
}

setInterval(gameloop, 0)