let version = "0.3.0.3"
document.title = `Lakeside Songbook v${version}`

const textNotif = document.querySelector(".textNotif")
const text = document.querySelector(".text")

let gridWidth = 16
let gridHeight = 10

let xSkew = 0
let ySkew = 0
let rez = 0

let PX = 4
let PY = 3

let XP = 0
let LV = 0
let NLV = 100

let map = 0
let cursor = 0

let inventory = {"fish": [], "rareFish": []}

let saveData = localStorage.getItem("savedata")

try{
    if (saveData != null){
        saveData = JSON.parse(saveData)

        inventory.fish = saveData.inventory.fish

        if (saveData.inventory.rareFish != undefined){
            inventory.rareFish = saveData.inventory.rareFish
        } else {
            console.log("Pre v0.2.1 save file detected")
            inventory.rareFish = []
        }
    } else {
        console.log("No save data detected, proceeding with fresh data")
    }
} catch {
    localStorage.clear()
    textNotif.textContent = `Your save data is corrupt.`
    textNotif.style.opacity = "100"
    textNotif.style.visibility = "visible"
}

inventory["fish"] = inventoryRepair(inventory["fish"], 12)
inventory["rareFish"] = inventoryRepair(inventory["rareFish"], 12)

const play = document.getElementById("play")

document.addEventListener('click', () => {
    music.play()
})

const controlsDiv = document.querySelector(".controlsDiv")

const player = document.querySelector(".man")
const cast = document.querySelector(".cast")
const splash = document.querySelector(".splash")

const gridContainer = document.querySelector(".gridContainer")
const grid = document.querySelector(".grid")

const invContainer = document.querySelector(".invContainer")
const inv = document.querySelector(".inventory")

grid.style.display = "grid"
grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`
grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`

function setRez(step = 0.5, set = false){
    rez = 0

    if (!set){
        while (rez*16*gridWidth < screen.width || rez*16*gridHeight < screen.height){
            rez += step
        }

        while (rez*16*gridWidth > screen.width || rez*16*gridHeight > screen.height){
            rez -= step
        }
    } else {
        rez = step
    }

    xSkew = (screen.width - ((16*rez)*gridWidth)) / 2
    ySkew = (screen.height - ((16*rez)*gridHeight)) / 2

    controlsDiv.style.left = `${xSkew}px`
    controlsDiv.style.top = `${ySkew}px`

    grid.style.width = `${(16*rez)*gridWidth}px`
    grid.style.height = `${(16*rez)*gridHeight}px`

    player.style.width = `${(14*rez)}px`
    player.style.height = `${(14*rez)}px`

    cast.style.width = `${(14*rez)}px`
    cast.style.height = `${(14*rez)}px`

    splash.style.width = `${(14*rez)}px`
    splash.style.height = `${(14*rez)}px`

    gridContainer.style.left = `${xSkew}px`
    gridContainer.style.top = `${ySkew}px`

    inv.style.width = `${(16*rez)*gridWidth}px`
    inv.style.height = `${(16*rez)*gridHeight}px`

    invContainer.width = `${(16*rez)*gridWidth}px`
    invContainer.height = `${(16*rez)*gridHeight}px`
    invContainer.style.top = `${ySkew}px`
    invContainer.style.left = `${xSkew}px`

    textNotif.style.left = `${xSkew+4}px`
    textNotif.style.top = `${ySkew}px`

    textNotif.style.fontSize = `${(25/4)*rez}px`
    text.style.fontSize = `${(16/4)*rez}px`
}

let gridX = 1
let gridY = 1
for (let x = 0; x < (gridWidth * gridHeight); x++) {
    let gridElement = document.createElement("div")

    gridElement.style.gridArea = `${gridY} / ${gridX}`
    
    gridElement.style.backgroundRepeat = "no-repeat"
    gridElement.style.backgroundSize = "cover"
    gridElement.style.imageRendering = "pixelated"

    gridElement.className = `gridElement${gridY}_${gridX}`

    grid.appendChild(gridElement)

    gridX++

    if (gridX > gridWidth) {
        gridY++
        gridX = 1
    }
}

function updateInv(cursor, inventory, offset){
    if (cursor + offset > (inventory.fish.length-1)) {
        cursor -= inventory.fish.length
    }

    if (cursor + offset < 0) {
        cursor += inventory.fish.length
    }

    const stats = document.querySelector(`.stats${offset}`)
    const icon = document.querySelector(`.icon${offset}`)
    const invName = document.querySelector(`.name${offset}`)
    const catchCount = document.querySelector(`.catchCount${offset}`)
    const bestWeight = document.querySelector(`.bestWeight${offset}`)

    const catchCountR = document.querySelector(`.catchCountR${offset}`)
    const bestWeightR = document.querySelector(`.bestWeightR${offset}`)

    const description = document.querySelector(`.description${offset}`)

    icon.style.width = `${((256/4)*rez)}px`
    icon.style.height = `${((256/4)*rez)}px`

    invName.style.fontSize = `${((1.17/4)*rez)}em`

    catchCount.style.fontSize = `${((16/4)*rez)}px`
    bestWeight.style.fontSize = `${((16/4)*rez)}px`
    catchCountR.style.fontSize = `${((16/4)*rez)}px`
    bestWeightR.style.fontSize = `${((16/4)*rez)}px`

    description.style.fontSize = `${((16/4)*rez)}px`

    if (inventory["fish"][cursor+offset].count == 0 || inventory["fish"][cursor+offset].count == undefined || inventory["fish"][cursor+offset].count == NaN){
        icon.src = "invImgs/fishless.png"
        invName.textContent = ""
        catchCount.textContent = ""
        bestWeight.textContent = ""
        description.textContent = ""
    } else {
        icon.src = fish[cursor+offset].imgSrc

        invName.textContent = fish[cursor+offset].name
        catchCount.textContent = `Caught: ${inventory["fish"][cursor+offset].count}`

        if (inventory["fish"][cursor+offset].size < 1000){
            bestWeight.textContent = `Best weight: ${inventory["fish"][cursor+offset].size}g`
        } else if (inventory["fish"][cursor+offset].size < 1000000){
            bestWeight.textContent = `Best weight: ${inventory["fish"][cursor+offset].size/1000}kg`
        } else {
            bestWeight.textContent = `Best weight: ${inventory["fish"][cursor+offset].size/1000000}T`
        }

        description.textContent = fish[cursor+offset].description
    }
    
    if (inventory["rareFish"][cursor+offset].count == 0 || inventory["rareFish"][cursor+offset].count == undefined || inventory["rareFish"][cursor+offset].count == NaN){
        catchCountR.textContent = ""
        bestWeightR.textContent = ""
    } else {
        if (inventory["rareFish"][cursor+offset].count == 0 || inventory["rareFish"][cursor+offset].count == undefined){
            catchCountR.textContent = `You haven't caught any rares`
            bestWeightR.textContent = ""
        } else {
            catchCountR.textContent = `Rares caught: ${inventory["rareFish"][cursor+offset].count}`

            if (inventory["rareFish"][cursor+offset].size < 1000){
                bestWeightR.textContent = `Best rare weight: ${inventory["rareFish"][cursor+offset].size}g`
            } else if (inventory["rareFish"][cursor+offset].size < 1000000){
                bestWeightR.textContent = `Best rare weight: ${inventory["rareFish"][cursor+offset].size/1000}kg`
            } else {
                bestWeightR.textContent = `Best rare weight: ${inventory["rareFish"][cursor+offset].size/1000000}T`
            }
        }
    }

    try{
        let invNameText = invName.textContent
        stats.style.background = "linear-gradient(169deg, rgba(255,255,255,1) 0%, rgba(215,215,215,1) 100%)"
        if (inventory["fish"][cursor+offset].size >= weightCalc(cursor+offset, 1)[1]){
            stats.style.background = "linear-gradient(169deg, rgba(255,255,0,1) 0%, rgba(255,215,0,1) 100%)"
            bestWeight.textContent += " ★"

            if (fish[cursor+offset].name != "Magikarp"){
                invName.textContent = "Perfect " + invNameText
            } else {
                invName.textContent = "Worthless " + invNameText
            }
        }
        if (inventory["rareFish"][cursor+offset].size >= weightCalc(cursor+offset, 2)[1]){
            stats.style.background = "linear-gradient(169deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
            bestWeightR.textContent += " ★"

            if (fish[cursor+offset].name != "Magikarp"){
                invName.textContent = "Truly Perfect " + invNameText
            } else {
                invName.textContent = "Truly Worthless " + invNameText
            }
        }
    } catch {}
}

function loadGrid(gridData){
    let gridX = 1
    let gridY = 1
    for (let x = 0; x < (gridWidth * gridHeight); x++) {
        let gridElement = document.querySelector(`.gridElement${gridY}_${gridX}`)

        gridElement.style.backgroundImage = `url('tiles/${gridData[(gridY - 1)][(gridX - 1)].tile}.png')`

        gridX++
        if (gridX > gridWidth) {
            gridY++
            gridX = 1
        }
    }
}

function resetSave(){
    clearInterval(gameloop)
    localStorage.clear()
    location.reload()
}

function loadSave(data){
    clearInterval(gameloop)
    localStorage.setItem("savedata", JSON.stringify({"version": ":3", "inventory": JSON.parse(atob(data)), "map": map, "PX": PX, "PY": PY}))
    location.reload()
}

function copySave(){
    navigator.clipboard.writeText(btoa(JSON.stringify(inventory)))

    textNotif.textContent = `Save data copied.`
    textNotif.style.opacity = "100"
    textNotif.style.visibility = "visible"
    setTimeout(() => {textNotif.style.opacity="0"}, 1000)
}

function weightCalc(id, weightMult){
    if (id <= 0){
        newWeight = (Math.floor(Math.random() * 999)+1)*weightMult
        maxWeight = 999*weightMult
    } else if (id <= 1){
        newWeight = (Math.floor(Math.random() * 20)+50)*weightMult
        maxWeight = 69*weightMult
    } else if (id <= 4){
        newWeight = (Math.floor(Math.random() * 201)+200)*weightMult
        maxWeight = 400*weightMult
    } else if (id <= 5){
        newWeight = (Math.floor(Math.random() * 1401)+100)*weightMult
        maxWeight = 1500*weightMult
    } else if (id <= 6){
        newWeight = (Math.floor(Math.random() * 9901)+100)*weightMult
        maxWeight = 10000*weightMult
    } else if (id <= 7){
        newWeight = 10000*weightMult
        maxWeight = 10000*weightMult
    } else if (id <= 12){
        newWeight = (Math.floor(Math.random() * 2147483647)+1)*weightMult
        maxWeight = 2147483647*weightMult
    }
    return [newWeight, maxWeight]
}

loadGrid(gridData[map])

let FX = 0
let FY = 0
let FV = false
let FR = 3
let FS = false

let lastMove = 0
let lastInv = false
let lastInvMove = 0
let lastFish = false
let lastFishMove = 0

let type = "fish"

let inInv = false
let controlsVisibility = true

let key = {}

window.addEventListener('keydown', function (e) {
    key[e.key] = true
})

window.addEventListener('keyup', function (e) {
    key[e.key] = false

    if (!key["Escape"]){
        lastInv = key["Escape"]
    }

    if (!key["i"]){
        lastInv = key["i"]
    }

    if (!key[" "]){
        lastInv = key[" "]
    }

    if (key[e.key] != "ArrowLeft" && key[e.key] != "ArrowRight"){
        lastInvMove = 0
        if (key[e.key] != "ArrowUp" && key[e.key] != "ArrowDown"){
            lastFishMove = 0
        }
    }

    if (key[e.key] != "w" && key[e.key] != "a" && key[e.key] != "s" && key[e.key] != "d"){
        lastMove = 0
    }
})

function calcLV(){
    LV = 0
    XP = 0
    NLV = 100

    for (let x = 0; x < inventory.fish.length-1; x++){
        XP += inventory.fish[x].size
        XP += inventory.rareFish[x].size
    }

    while (XP > NLV){
        LV += 1
        XP -= NLV
        NLV *= 1.1
    }

    console.log(NLV)
    console.log(LV)
    console.log(XP)
}

calcLV()

setRez(1)

gameloop = setInterval(() => {
    if (Date.now() < (lastFish + 1500)){
        return
    }

    if (key["Escape"] && lastInv != key["Escape"]) { //  && Date.now() < (lastInv + 1000)
        lastInv = key["Escape"]
        controlsVisibility = !controlsVisibility
        cursor = 0
    }
    
    if (key["i"] && lastInv != key["i"] || (inInv && key["Escape"])) { //  && Date.now() < (lastInv + 1000)
        lastInv = key["i"]
        inInv = !inInv
        controlsVisibility = false
        cursor = 0
    }

    if (inInv) {
        invContainer.style.visibility = "visible"
        textNotif.style.visibility = "hidden"
    } else {
        invContainer.style.visibility = "hidden"
        textNotif.style.visibility = "visible"
    }

    if (controlsVisibility) {
        controlsDiv.style.visibility = "visible"
    } else {
        controlsDiv.style.visibility = "hidden"
    }

    if (inInv){
        if (key["ArrowLeft"] && Date.now() > (lastInvMove + 100)) {
            lastInvMove = Date.now()

            if (cursor > 0){
                cursor--
            } else {
                cursor += inventory.fish.length-1
            }
        }

        if (key["ArrowRight"] && Date.now() > (lastInvMove + 100)) {
            lastInvMove = Date.now()

            if (cursor < inventory.fish.length-4){
                cursor++
            } else {
                cursor -= inventory.fish.length-1
            }
        }

        if (key[" "]) {
            if (type == "rareFish"){
                type = "fish"
            } else {
                type = "rareFish"
            }
        }

        updateInv(cursor, inventory, 0)
        updateInv(cursor, inventory, 1)
        updateInv(cursor, inventory, 2)
        updateInv(cursor, inventory, 3)
    } else {
        if(map == 0 && PX == 15 && key["d"]){
            map = 1
            loadGrid(gridData[map])
            PX = 0
        } else if(map == 1 && PX == 0 && key["a"]){
            map = 0
            loadGrid(gridData[map])
            PX = 15
        } else if(Date.now() > (lastMove + 200)){
            try{
                if (key["a"]) {
                    if (!gridData[map][PY][PX-1].solid){
                        PX--
                        lastMove = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                } else if (key["d"]) {
                    if (!gridData[map][PY][PX+1].solid){
                        PX++
                        lastMove = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                } else if (key["s"]) {
                    if (!gridData[map][PY+1][PX].solid){
                        PY++
                        lastMove = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                } else if (key["w"]) {
                    if (!gridData[map][PY-1][PX].solid){
                        PY--
                        lastMove = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                }
            } catch {
                console.log("edge")
            }
        }

        if (key["ArrowUp"] && Date.now() > (lastFishMove + 250)) {
            if (gridData[map][PY-1+FY][PX].water && FY > -FR){
                lastFishMove = Date.now()
                FY--
                FX = 0
                FV = true
            }
            //loadGrid(PX, PY)
        } else if (key["ArrowDown"] && Date.now() > (lastFishMove + 250)) {
            if (gridData[map][PY+1+FY][PX].water && FY < FR){
                lastFishMove = Date.now()
                FY++
                FX = 0
                FV = true
            }
            //loadGrid(PX, PY)
        } else if (key["ArrowLeft"] && Date.now() > (lastFishMove + 250)) {
            if (gridData[map][PY][PX-1+FX].water && FX > -FR){
                lastFishMove = Date.now()
                FX--
                FY = 0
                FV = true
            }
            //loadGrid(PX, PY)
        } else if (key["ArrowRight"] && Date.now() > (lastFishMove + 250)) {
            if (gridData[map][PY][PX+1+FX].water && FX < FR){
                lastFishMove = Date.now()
                FX++
                FY = 0
                FV = true
            }
            //loadGrid(PX, PY)
        } else if (key[" "] && lastInv != key[" "] && Date.now() > (lastFishMove + 250)) {
            if (FV){
                lastInv = key[" "]
                FS = true

                id = Math.floor(Math.random() * 12)
                if (Math.floor(Math.random() * 32) == 1) {
                    fishType = "rareFish"
                } else {
                    fishType = "fish"
                }

                if (inventory["fish"][id].count == undefined || inventory["fish"][id].count == NaN){
                    fishType = "fish"
                    inventory[fishType][id].count = 1
                } else if (inventory[fishType][id].count == undefined || inventory[fishType][id].count == NaN){
                    inventory[fishType][id].count = 1
                } else {
                    inventory[fishType][id].count++
                }

                let weightMult = 1
                if (fishType == "rareFish"){
                    weightMult = 2
                }

                newWeight = weightCalc(id, weightMult)[0]

                if (inventory[fishType][id].size != undefined && inventory[fishType][id].size != NaN){
                    if (newWeight > inventory[fishType][id].size){
                        inventory[fishType][id].size = newWeight
                    }
                } else {
                    inventory[fishType][id].size = newWeight
                }

                let weightSymbol = "g"
                if (newWeight > 999){
                    weightSymbol = "kg"
                    newWeight /= 1000
                }
                
                if (fishType == "rareFish"){
                    textNotif.textContent = `+1 Rare ${fish[id].name}, Weight: ${newWeight}${weightSymbol}`
                } else {
                    textNotif.textContent = `+1 ${fish[id].name}, Weight: ${newWeight}${weightSymbol}`
                }
                textNotif.style.opacity = "100"

                splash.style.backgroundImage = `url('char/splash.gif?${new Date().getTime()}')`

                let sfx = new Audio(`sfx/splash.mp3`)
                sfx.play()

                setTimeout(() => {
                    textNotif.style.opacity = "0"
                    FS = false

                    FX = 0
                    FY = 0
                    FV = false
                }, 1000)

                lastFish = Date.now()
            }
            //loadGrid(PX, PY)
        }
    }

    localStorage.setItem("savedata", JSON.stringify({"version": version, "inventory": inventory, "map": map, "PX": PX, "PY": PY}))

    player.style.left = `${((16*rez)*PX)+xSkew+rez}px`
    player.style.top = `${((16*rez)*PY)+ySkew-(rez*4)}px`

    cast.style.left = `${((16*rez)*FX)+((16*rez)*PX)+xSkew}px`
    cast.style.top = `${((16*rez)*FY)+((16*rez)*PY)+ySkew}px`

    splash.style.left = `${((16*rez)*FX)+((16*rez)*PX)+xSkew}px`
    splash.style.top = `${((16*rez)*FY)+((16*rez)*PY)+ySkew}px`

    if ((FV || !(FX == FY)) && !FS) {
        cast.style.visibility = "visible"
    } else {
        cast.style.visibility = "hidden"
    }
}, 0)