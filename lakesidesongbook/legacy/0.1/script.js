let gridWidth = 16
let gridHeight = 10

let xSkew = (screen.width - (64*gridWidth)) / 2
let ySkew = (screen.height - (64*gridHeight)) / 2

let PX = 0
let PY = 0

let inventory = {
    "debug": {
        "name": "DEBUG.FISH",
        "count": 0,
        "size": 0,
        "description": "The first"
    }
}

let saveData = localStorage.getItem("savedata")
if (saveData != null){
    saveData = JSON.parse(saveData)
    inventory = saveData.inventory
    PX = saveData.PX
    PY = saveData.PY
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
const textNotif = document.querySelector(".textNotif")

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

const invName = document.querySelector(".name")
const catchCount = document.querySelector(".catchCount")
const bestWeight = document.querySelector(".bestWeight")
const description = document.querySelector(".description")

function loadGrid(PX, PY) {
    let gridX = 1
    let gridY = 1
    for (let x = 0; x < (gridWidth * gridHeight); x++) {
        let gridElement = document.createElement("div")

        gridElement.style.gridArea = `${gridY} / ${gridX}`
        try {
            gridElement.style.backgroundImage = `url('tiles/${gridData[(gridY - 1) + PY][(gridX - 1) + PX].tile}.png')`
        } catch {
            gridElement.style.backgroundImage = `url('tiles/DEBUG.png')`
            try {
                gridData[gridY - 1].push({"tile": "DEBUG"})
            } catch {
                gridData[gridY - 1] = []
                gridData[gridY - 1].push({"tile": "DEBUG"})
            }
        }
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
}

loadGrid(0, 0)

player.style.left = `${(64*PX)+xSkew+4}px`
player.style.top = `${(64*PY)+ySkew}px`

let lastPress = 0

let FX = 0
let FY = 0
let FV = false
let FR = 1

let lastFish = 0

textNotif.style.left = `${xSkew}px`
textNotif.style.top = `${ySkew}px`

let inInv = false

window.addEventListener('keydown', function (e) {
    if (e.key == "i") {
        inInv = !inInv
        if (inInv) {
            invContainer.style.top = "0px"
            textNotif.style.visibility = "hidden"
        } else {
            invContainer.style.top = "-100%"
            textNotif.style.visibility = "visible"
        }
    }

    if (inInv){
        invName.textContent = inventory["debug"]["name"]
        catchCount.textContent = `Caught: ${inventory["debug"]["count"]}`
        bestWeight.textContent = `Best weight: ${inventory["debug"]["size"]}g`
        description.textContent = inventory["debug"]["description"]
    } else {
        if(Date.now() > (lastPress + 500)){
            try{
                if (e.key == "a") {
                    if (!gridData[PY][PX-1].solid){
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
                    if (!gridData[PY][PX+1].solid){
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
                    if (!gridData[PY+1][PX].solid){
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
                    if (!gridData[PY-1][PX].solid){
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
                if (gridData[PY-1+FY][PX].water && FY > -FR){
                    FY--
                    FX = 0
                    FV = true
                }
                //loadGrid(PX, PY)
            }

            if (e.key == "ArrowDown") {
                if (gridData[PY+1+FY][PX].water && FY < FR){
                    FY++
                    FX = 0
                    FV = true
                }
                //loadGrid(PX, PY)
            }

            if (e.key == "ArrowLeft") {
                if (gridData[PY][PX-1+FX].water && FX > -FR){
                    FX--
                    FY = 0
                    FV = true
                }
                //loadGrid(PX, PY)
            }

            if (e.key == "ArrowRight") {
                if (gridData[PY][PX+1+FX].water && FX < FR){
                    FX++
                    FY = 0
                    FV = true
                }
                //loadGrid(PX, PY)
            }

            if (e.key == " " && Date.now() > (lastFish + 1500)) {
                if (FV){
                    inventory.debug.count++

                    newWeight = Math.floor(Math.random() * 900)+99
                    if (newWeight > inventory.debug.size){
                        inventory.debug.size = newWeight
                    }
                    
                    textNotif.textContent = `+1 DEBUGFISH, Weight: ${newWeight}g`
                    textNotif.style.opacity = "100"
                    setTimeout(() => {
                        textNotif.style.opacity = "0"
                    }, 1000);

                    lastFish = Date.now()
                }
                //loadGrid(PX, PY)
            }

            localStorage.setItem("savedata", JSON.stringify({"inventory": inventory, "PX": PX, "PY": PY}))

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