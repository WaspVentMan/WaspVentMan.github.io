let version = "0.4.0.1"
document.title = `Lakeside Songbook v${version}`

const textNotif = document.querySelector(".textNotif")
const textNotifText = document.querySelector(".textNotifText")
const textNotifImg = document.querySelector(".textNotifImg")
const text = document.querySelector(".text")

let gridWidth = 16
let gridHeight = 9

let xSkew = 0
let ySkew = 0
let rez = 0

let PX = 4
let PY = 3

let IL = fishUltralist.length

let XP = 0
let LV = 0
let NLV = 100

let map = 0
let cursor = 0

let inventory = {"fish": {}}

let saveData = JSON.parse(localStorage.getItem("savedataLSSB"))

try{
    inventory = saveData.inventory
    map = saveData.map
    PX = saveData.PX
    PY = saveData.PY
} catch {}

inventory["fish"] = inventoryRepair(inventory["fish"], IL)

const play = document.getElementById("play")

document.addEventListener('click', () => {
    music.play()
})

const controlsDiv = document.querySelector(".controlsDiv")

const daylight = document.querySelector(".light")
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

function setRez(step = 0.01, set = false){
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

    controlsDiv.style.width = `${(16*rez)*gridWidth}px`
    controlsDiv.style.height = `${(16*rez)*gridHeight}px`

    grid.style.width = `${(16*rez)*gridWidth}px`
    grid.style.height = `${(16*rez)*gridHeight}px`

    daylight.style.width = `${(16*rez)*gridWidth}px`
    daylight.style.height = `${(16*rez)*gridHeight}px`
    daylight.style.top = `${ySkew}px`
    daylight.style.left = `${xSkew}px`

    player.style.width = `${(14*rez)}px`
    player.style.height = `${(14*rez)}px`

    cast.style.width = `${(16*rez)}px`
    cast.style.height = `${(16*rez)}px`

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
    textNotifImg.style.height = `${(25/4)*rez}px`
    textNotifImg.style.marginTop = `${0.5*rez}px`
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
    if (cursor + offset > (IL-1)) {
        cursor -= IL
    }

    if (cursor + offset < 0) {
        cursor += IL
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

    let selectedfish = inventory["fish"][fishUltralist[cursor+offset]]

    if (selectedfish.count == 0 || selectedfish.count == undefined || selectedfish.count == NaN){
        icon.src = "invImgs/fishless.png"
        invName.textContent = ""
        catchCount.textContent = ""
        bestWeight.textContent = ""
        description.textContent = ""
    } else {
        icon.src = fish[fishUltralist[cursor+offset]].imgSrc

        invName.textContent = fish[fishUltralist[cursor+offset]].name
        catchCount.textContent = `Caught: ${selectedfish.count}`

        if (selectedfish.size < 1000){
            bestWeight.textContent = `Best weight: ${selectedfish.size}g`
        } else if (selectedfish.size < 1000000){
            bestWeight.textContent = `Best weight: ${Math.round((selectedfish.size/1000)*100)/100}kg`
        } else {
            bestWeight.textContent = `Best weight: ${Math.round((selectedfish.size/1000000)*100)/100}T`
        }

        description.textContent = fish[fishUltralist[cursor+offset]].description
    }
    
    if (selectedfish.countR == 0 || selectedfish.countR == undefined || selectedfish.countR == NaN){
        catchCountR.textContent = ""
        bestWeightR.textContent = ""
    } else {
        if (selectedfish.countR == 0 || selectedfish.countR == undefined){
            catchCountR.textContent = `You haven't caught any rares`
            bestWeightR.textContent = ""
        } else {
            catchCountR.textContent = `Rares caught: ${selectedfish.countR}`

            if (selectedfish.sizeR < 1000){
                bestWeightR.textContent = `Best rare weight: ${selectedfish.sizeR}g`
            } else if (selectedfish.sizeR < 1000000){
                bestWeightR.textContent = `Best rare weight: ${Math.round((selectedfish.size/1000)*100)/100}kg`
            } else {
                bestWeightR.textContent = `Best rare weight: ${Math.round((selectedfish.size/1000000)*100)/100}T`
            }
        }
    }

    try{
        let invNameText = invName.textContent
        stats.style.background = "linear-gradient(169deg, rgba(255,255,255,1) 0%, rgba(215,215,215,1) 100%)"
        if (selectedfish.size >= weightCalc(fishUltralist[cursor+offset], 1)[1]){
            stats.style.background = "linear-gradient(169deg, rgba(255,255,0,1) 0%, rgba(255,215,0,1) 100%)"
            bestWeight.textContent += " ★"

            if (fish[fishUltralist[cursor+offset]].name != "Magikarp"){
                invName.textContent = "Perfect " + invNameText
            } else {
                invName.textContent = "Worthless " + invNameText
            }
        }
        if (selectedfish.sizeR >= weightCalc(fishUltralist[cursor+offset], 2)[1]){
            stats.style.background = "linear-gradient(169deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
            bestWeightR.textContent += " ★"

            if (fish[fishUltralist[cursor+offset]].name != "Magikarp"){
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
    try{
        clearInterval(gameloop)
    } catch {}
    //localStorage.clear()
    location.reload()
}

function loadSave(data){
    try{
        clearInterval(gameloop)
    } catch {}
    localStorage.setItem("savedata", JSON.stringify({"version": ":3", "inventory": JSON.parse(atob(data)), "map": map, "PX": PX, "PY": PY}))
    location.reload()
}

function copySave(){
    navigator.clipboard.writeText(btoa(JSON.stringify(inventory)))

    textNotifText.textContent = `Save data copied.`
    textNotif.style.opacity = "100"
    textNotif.style.visibility = "visible"
    setTimeout(() => {textNotif.style.opacity="0"}, 1000)
}

function weightCalc(id, weightMult){
    let newWeight

    let min = fish[id].wmin
    let max = fish[id].wmax - min + 1
    
    newWeight = (Math.floor(Math.random() * max)+min)*weightMult
    maxWeight = (fish[id].wmax)*weightMult
    
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

setRez(1)

setInterval(() => {localStorage.setItem("savedataLSSB", JSON.stringify({"version": version, "inventory": inventory, "map": map, "PX": PX, "PY": PY}))}, 1000)

let gameloop = setInterval(() => {
    if (Date.now() < (lastFish + 1500)){
        return
    }

    if (key["Escape"] && lastInv != key["Escape"]) { //  && Date.now() < (lastInv + 1000)
        lastInv = key["Escape"]
        controlsVisibility = !controlsVisibility
        cursor = 0
    }
    
    if (key["i"] && lastInv != key["i"]) { //  && Date.now() < (lastInv + 1000)
        lastInv = key["i"]
        inInv = !inInv
        cursor = 0
    }

    if (controlsVisibility) {
        controlsDiv.style.visibility = "visible"
    } else if (inInv){
        invContainer.style.visibility = "visible"
        textNotif.style.visibility = "hidden"
        controlsDiv.style.visibility = "hidden"
        if (key["ArrowLeft"] && Date.now() > (lastInvMove + 100)) {
            lastInvMove = Date.now()

            if (cursor > 0){
                cursor--
            } else {
                cursor += IL-1
            }
        }

        if (key["ArrowRight"] && Date.now() > (lastInvMove + 100)) {
            lastInvMove = Date.now()

            if (cursor < IL-4){
                cursor++
            } else {
                cursor -= IL-1
            }
        }

        updateInv(cursor, inventory, 0)
        updateInv(cursor, inventory, 1)
        updateInv(cursor, inventory, 2)
        updateInv(cursor, inventory, 3)
    } else {
        invContainer.style.visibility = "hidden"
        textNotif.style.visibility = "visible"
        controlsDiv.style.visibility = "hidden"
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
                let bow = ""

                id = Math.floor(Math.random() * lootpool[gridData[map][PY+FY][PX+FX].loot].length)

                if (Math.floor(Math.random() * 32) == 1) {
                    fishType = "R"
                } else {
                    fishType = ""
                }

                if (inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] == undefined || inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] == NaN || inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] == 0){
                    fishType = ""
                    inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] = 1
                } else if (inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] == undefined || inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] == NaN){
                    inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`] = 1
                } else {
                    inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`count${fishType}`]++
                }

                let weightMult = 1
                if (fishType == "R"){
                    weightMult = 2
                }

                newWeight = weightCalc(lootpool[gridData[map][PY+FY][PX+FX].loot][id], weightMult)[0]*weightMult

                if (inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`] != undefined && inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`] != NaN){
                    if (newWeight == weightCalc(lootpool[gridData[map][PY+FY][PX+FX].loot][id], weightMult)[1]){
                        inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`] = newWeight
                        bow = "★"
                    } else if (newWeight == inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`]){
                        bow = "="
                    } else if (newWeight > inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`]){
                        inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`] = newWeight
                        bow = "↑"
                    } else if (newWeight < inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`]){
                        bow = "↓"
                    } else {
                        bow = ""
                    }
                } else {
                    inventory["fish"][lootpool[gridData[map][PY+FY][PX+FX].loot][id]][`size${fishType}`] = newWeight
                    bow = "↑"
                }

                let weightSymbol = "g"
                if (newWeight > 999){
                    weightSymbol = "kg"
                    newWeight /= 1000
                }
                if (newWeight > 999){
                    weightSymbol = "T"
                    newWeight /= 1000
                }

                newWeight = Math.round(newWeight*100)/100
                
                if (fishType == "R"){
                    textNotifText.textContent = `Rare ${fish[lootpool[gridData[map][PY+FY][PX+FX].loot][id]].name}, Weight: ${bow}${newWeight}${weightSymbol}`
                } else {
                    textNotifText.textContent = `${fish[lootpool[gridData[map][PY+FY][PX+FX].loot][id]].name}, Weight: ${bow}${newWeight}${weightSymbol}`
                }
                textNotifImg.src = fish[lootpool[gridData[map][PY+FY][PX+FX].loot][id]].imgSrc
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

    let time = gametime()
    let AMPM = "AM"

    if (time[0] > 12){
        time[0] -= 12
        AMPM = "PM"
    }
    time[0] = time[0].toString()
    time[1] = time[1].toString()

    if (time[0].length != 2){
        time[0] = "0" + time[0]
    }

    if (time[1].length != 2){
        time[1] = "0" + time[1]
    }
        
    document.querySelector(".time").textContent = `${time[0]}:${time[1] + AMPM} // days since epoch: ${time[2]}`
}, 0)