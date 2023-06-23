let version = "0.2.1"
document.title = `Lakeside Songbook v${version}`

const textNotif = document.querySelector(".textNotif")

let gridWidth = 16
let gridHeight = 10

let xSkew = (screen.width - (64*gridWidth)) / 2
let ySkew = (screen.height - (64*gridHeight)) / 2

let PX = 4
let PY = 3

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


        if (saveData.version == version){
            PX = saveData.PX
            PY = saveData.PY
            map = saveData.map
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

inventory["fish"] = inventoryRepair(inventory["fish"])
inventory["rareFish"] = inventoryRepair(inventory["rareFish"])

const play = document.getElementById("play")

document.addEventListener('click', () => {
    music.play()
})

const player = document.querySelector(".man")
const cast = document.querySelector(".cast")
const splash = document.querySelector(".splash")

const gridContainer = document.querySelector(".gridContainer")
const grid = document.querySelector(".grid")

grid.style.display = "grid"
grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`
grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`

grid.style.width = `${64*gridWidth}px`
grid.style.height = `${64*gridHeight}px`

gridContainer.style.left = `${xSkew}px`
gridContainer.style.top = `${ySkew}px`

const invContainer = document.querySelector(".invContainer")
const inv = document.querySelector(".inventory")

inv.style.width = `${64*gridWidth}px`
inv.style.height = `${64*gridHeight}px`

invContainer.style.left = `${xSkew}px`

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

function updateInv(cursor, inventory, offset, type = "fish"){
    if (cursor + offset > (inventory.fish.length-1)) {
        cursor -= inventory.fish.length
        type = "rareFish"
    }
    const icon = document.querySelector(`.icon${offset}`)
    const invName = document.querySelector(`.name${offset}`)
    const catchCount = document.querySelector(`.catchCount${offset}`)
    const bestWeight = document.querySelector(`.bestWeight${offset}`)
    const description = document.querySelector(`.description${offset}`)

    if (inventory[type][cursor+offset].count == 0 || inventory[type][cursor+offset].count == undefined || inventory[type][cursor+offset].count == NaN){
        icon.src = "invImgs/fishless.png"
        invName.textContent = "You haven't caught this fish yet!"
        catchCount.textContent = ""
        bestWeight.textContent = ""
        description.textContent = ""
    } else {
        icon.src = inventory[type][cursor+offset].imgSrc

        if (type == "rareFish"){
            invName.textContent = "Rare " + inventory[type][cursor+offset].name
        } else {
            invName.textContent = inventory[type][cursor+offset].name
        }
        catchCount.textContent = `Caught: ${inventory[type][cursor+offset].count}`

        if (inventory[type][cursor+offset].size < 1000){
            bestWeight.textContent = `Best weight: ${inventory[type][cursor+offset].size}g`
        } else if (inventory[type][cursor+offset].size < 1000000){
            bestWeight.textContent = `Best weight: ${inventory[type][cursor+offset].size/1000}kg`
        } else {
            bestWeight.textContent = `Best weight: ${inventory[type][cursor+offset].size/1000000}T`
        }
        description.textContent = inventory[type][cursor+offset].description
    }
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
    localStorage.clear()
    location.reload()
}

function loadSave(data){
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

loadGrid(gridData[map])

player.style.left = `${(64*PX)+xSkew+4}px`
player.style.top = `${(64*PY)+ySkew-16}px`

let lastPress = 0

let FX = 0
let FY = 0
let FV = false
let FR = 3
let FS = false

let lastFish = 0

let type = "fish"

textNotif.style.left = `${xSkew+4}px`
textNotif.style.top = `${ySkew}px`

let inInv = false
invContainer.style.top = `${ySkew}px`

window.addEventListener('keydown', function (e) {
    if (Date.now() < (lastFish + 1000)){
        return
    }

    if (e.key == "i") {
        inInv = !inInv
        cursor = 0
        if (inInv) {
            invContainer.style.visibility = "visible"
            textNotif.style.visibility = "hidden"
        } else {
            invContainer.style.visibility = "hidden"
            textNotif.style.visibility = "visible"
        }
    }

    if (inInv){
        if (e.key == "ArrowLeft" && cursor > 0) {
            cursor--
        }

        if (e.key == "ArrowRight" && cursor < ((inventory.fish.length-1)*2)-2) {
            cursor++
        }

        if (e.key == " ") {
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
        if(map == 0 && PX == 15 && e.key == "d"){
            map = 1
            loadGrid(gridData[map])
            PX = 0
        } else if(map == 1 && PX == 0 && e.key == "a"){
            map = 0
            loadGrid(gridData[map])
            PX = 15
        } else if(Date.now() > (lastPress + 100)){
            try{
                if (e.key == "a") {
                    if (!gridData[map][PY][PX-1].solid){
                        PX--
                        lastPress = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                }
            } catch {console.log("edge")}
            
            try{
                if (e.key == "d") {
                    if (!gridData[map][PY][PX+1].solid){
                        PX++
                        lastPress = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                }
            } catch {console.log("edge")}
            
            try{
                if (e.key == "s") {
                    if (!gridData[map][PY+1][PX].solid){
                        PY++
                        lastPress = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                }
            } catch {console.log("edge")}
            
            try{
                if (e.key == "w") {
                    if (!gridData[map][PY-1][PX].solid){
                        PY--
                        lastPress = Date.now()
                        FX = 0
                        FY = 0
                        FV = false
                    }
                    //loadGrid(PX, PY)
                }
            } catch {console.log("edge")}
        }

        if (e.key == "ArrowUp") {
            if (gridData[map][PY-1+FY][PX].water && FY > -FR){
                FY--
                FX = 0
                FV = true
            }
            //loadGrid(PX, PY)
        }

        if (e.key == "ArrowDown") {
            if (gridData[map][PY+1+FY][PX].water && FY < FR){
                FY++
                FX = 0
                FV = true
            }
            //loadGrid(PX, PY)
        }

        if (e.key == "ArrowLeft") {
            if (gridData[map][PY][PX-1+FX].water && FX > -FR){
                FX--
                FY = 0
                FV = true
            }
            //loadGrid(PX, PY)
        }

        if (e.key == "ArrowRight") {
            if (gridData[map][PY][PX+1+FX].water && FX < FR){
                FX++
                FY = 0
                FV = true
            }
            //loadGrid(PX, PY)
        }

        if (e.key == " ") {
            if (FV){
                FS = true

                id = Math.floor(Math.random() * 6)
                if (Math.floor(Math.random() * 128) == 1) {
                    fish = "rareFish"
                } else {
                    fish = "fish"
                }

                if (inventory[fish][id].count == undefined || inventory[fish][id].count == NaN){
                    inventory[fish][id].count = 1
                } else {
                    inventory[fish][id].count++
                }

                let weightMult = 1
                if (fish == "rareFish"){
                    weightMult = 2
                }

                if (id <= 0){
                    newWeight = (Math.floor(Math.random() * 999)+1)*weightMult
                } else if (id <= 1){
                    newWeight = (Math.floor(Math.random() * 20)+50)*weightMult
                } else if (id <= 4){
                    newWeight = (Math.floor(Math.random() * 201)+200)*weightMult
                } else if (id <= 5){
                    newWeight = (Math.floor(Math.random() * 1401)+100)*weightMult
                }

                if (inventory[fish][id].size != undefined && inventory[fish][id].size != NaN){
                    if (newWeight > inventory[fish][id].size){
                        inventory[fish][id].size = newWeight
                    }
                } else {
                    inventory[fish][id].size = newWeight
                }
                
                if (fish == "rareFish"){
                    textNotif.textContent = `+1 Rare ${inventory["fish"][id].name}, Weight: ${newWeight}g`
                } else {
                    textNotif.textContent = `+1 ${inventory["fish"][id].name}, Weight: ${newWeight}g`
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

        localStorage.setItem("savedata", JSON.stringify({"version": version, "inventory": inventory, "map": map, "PX": PX, "PY": PY}))

        player.style.left = `${(64*PX)+xSkew+4}px`
        player.style.top = `${(64*PY)+ySkew-16}px`

        cast.style.left = `${(64*FX)+(64*PX)+xSkew}px`
        cast.style.top = `${(64*FY)+(64*PY)+ySkew}px`

        splash.style.left = `${(64*FX)+(64*PX)+xSkew}px`
        splash.style.top = `${(64*FY)+(64*PY)+ySkew}px`

        if ((FV || !(FX == FY)) && !FS) {
            cast.style.visibility = "visible"
        } else {
            cast.style.visibility = "hidden"
        }
    }
}, false)