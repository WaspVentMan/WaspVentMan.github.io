let version = "0.1.1.1"
document.title = `Lakeside Songbook v${version}`

const textNotif = document.querySelector(".textNotif")

let gridWidth = 16
let gridHeight = 10

let xSkew = (screen.width - (64*gridWidth)) / 2
let ySkew = (screen.height - (64*gridHeight)) / 2

let PX = 0
let PY = 0

let map = 0

let cursor = 0

let inventory = {
    "fish": [
        {
            "imgSrc": "invImgs/DEBUGFISH.png",
            "name": "DEBUG.FISH",
            "count": 0,
            "size": 0,
            "description": "The first"
        },
        {
            "imgSrc": "invImgs/realfakefish.png",
            "name": "Real fake fish",
            "count": 0,
            "size": 0,
            "description": "A plastic fish indistinguishable from a real one, at least at its initial time of production, it's broken now."
        }
    ]
}

let saveData = localStorage.getItem("savedata")

if (saveData != null){
    saveData = JSON.parse(saveData)

    if (saveData.version != version){
        try{
            if (saveData.version == "0.1"){
                localStorage.clear()
                textNotif.textContent = `Your save data, created on v${saveData.version} has been wiped due to incompatability with a new format, sorry for the inconvenience.`
                textNotif.style.opacity = "100"
                textNotif.style.visibility = "visible"
                console.log("cum")
            } else {
            inventory = saveData.inventory
            }
        } catch {
            localStorage.clear()
                textNotif.textContent = `Your save data, created on v${saveData.version} has been wiped due to incompatability with a new format, sorry for the inconvenience.`
                textNotif.style.opacity = "100"
                textNotif.style.visibility = "visible"
                console.log("cum")
        }
    } else {
        inventory = saveData.inventory
    }

    inventory["fish"] = inventoryRepair(inventory["fish"])

    if (saveData.version == version){
        PX = saveData.PX
        PY = saveData.PY
        map = saveData.map
    }
} else {
    console.log("No save data detected, proceeding with fresh data")
    PX = 4
    PY = 2
}

const play = document.getElementById("play")

document.addEventListener('click', () => {
    music.play()
})

const player = document.querySelector(".man")
const cast = document.querySelector(".cast")

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

const icon = document.querySelector(".icon")
const invName = document.querySelector(".name")
const catchCount = document.querySelector(".catchCount")
const bestWeight = document.querySelector(".bestWeight")
const description = document.querySelector(".description")

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

loadGrid(gridData[map])

player.style.left = `${(64*PX)+xSkew+4}px`
player.style.top = `${(64*PY)+ySkew}px`

let lastPress = 0

let FX = 0
let FY = 0
let FV = false
let FR = 1

let lastFish = 0

textNotif.style.left = `${xSkew+4}px`
textNotif.style.top = `${ySkew}px`

let inInv = false

window.addEventListener('keydown', function (e) {
    if (e.key == "i") {
        inInv = !inInv
        if (inInv) {
            invContainer.style.top = `${ySkew}px`
            textNotif.style.visibility = "hidden"
        } else {
            invContainer.style.top = `-100%`
            textNotif.style.visibility = "visible"
        }
    }

    if (inInv){
        if (e.key == "ArrowLeft" && cursor > 0) {
            cursor--
        }

        if (e.key == "ArrowRight" && cursor < inventory.fish.length-1) {
            cursor++
        }

        if (inventory.fish[cursor].count == 0){
            icon.src = "invImgs/fishless.png"
            invName.textContent = "You haven't caught this fish yet!"
            catchCount.textContent = "Caught: 0"
            bestWeight.textContent = "Best weight: 0g"
            description.textContent = "???"
        } else {
            icon.src = inventory.fish[cursor].imgSrc
            invName.textContent = inventory.fish[cursor].name
            catchCount.textContent = `Caught: ${inventory.fish[cursor].count}`
            bestWeight.textContent = `Best weight: ${inventory.fish[cursor].size}g`
            description.textContent = inventory.fish[cursor].description
        }
    } else {
        if(Date.now() > (lastPress + 100)){
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

            if (e.key == " " && Date.now() > (lastFish + 1500)) {
                if (FV){
                    id = Math.floor(Math.random() * 2)
                    inventory.fish[id].count++

                    if (id == 0){
                        newWeight = Math.floor(Math.random() * 999)+1
                    } else if (id == 1){
                        newWeight = Math.floor(Math.random() * 2)+50
                    }

                    if (newWeight > inventory.fish[id].size){
                        inventory.fish[id].size = newWeight
                    }
                    
                    textNotif.textContent = `+1 ${inventory.fish[id].name}, Weight: ${newWeight}g`
                    textNotif.style.opacity = "100"
                    setTimeout(() => {
                        textNotif.style.opacity = "0"
                    }, 1000)

                    lastFish = Date.now()
                }
                //loadGrid(PX, PY)
            }

            if(map == 0 && PX == 0 && PY == 0 && e.key == "Enter"){
                map = 1
                loadGrid(gridData[map])
                PX = 7
                PY = 3
            }

            if(map == 1 && PX >= 6 && PX <= 9 && PY == 9 && e.key == "Enter"){
                map = 0
                loadGrid(gridData[map])
                PX = 4
                PY = 2
            }

            localStorage.setItem("savedata", JSON.stringify({"version": version, "inventory": inventory, "map": map, "PX": PX, "PY": PY}))

            player.style.left = `${(64*PX)+xSkew+4}px`
            player.style.top = `${(64*PY)+ySkew}px`

            cast.style.left = `${(64*FX)+(64*PX)+xSkew}px`
            cast.style.top = `${(64*FY)+(64*PY)+ySkew}px`

            if (FV || !(FX == FY)) {
                cast.style.visibility = "visible"
            } else {
                cast.style.visibility = "hidden"
            }
        }
    }
}, false)