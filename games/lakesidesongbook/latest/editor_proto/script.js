let gridWidth = 16
let gridHeight = 9

let PX = 1
let PY = 1

let map = 0
let cursor = 0
let tiles = [
    "DEBUG",
    "EMPTY",
    "PA_BRIDGE_BOTTOM_SHADOW_V_3PX",
    "PA_BRIDGE_BOTTOM",
    "PA_BRIDGE_TOP_SHADOW_V_3PX",
    "PA_BRIDGE_TOP",
    "PA_FLOOR_SHADOW_HALF",
    "PA_FLOOR_SHADOW",
    "PA_FLOOR",
    "PA_PATH_ES",
    "PA_PATH_EW",
    "PA_PATH_NE",
    "PA_PATH_NE_SHADOW_HALF",
    "PA_PATH_NS",
    "PA_PATH_NS_SHADOW",
    "PA_PATH_NW",
    "PA_PATH_SW",
    "PA_WALL_BOTTOM",
    "PA_WALL",
    "PA_WATER_EDGE",
    "PA_WATER_EDGE_V_3PX",
    "PA_WATER",
    "PA_WATER_SHADOW_BC_3PX",
    "PA_WATER_SHADOW_H_3PX",
    "PA_WATER_SHADOW_L_3PX",
    "PA_WATER_SHADOW_TC_3PX",
    "PA_WATER_SHADOW_V_3PX"
]

const tileInfo = document.querySelector(".tileInfo")
const pieceDisplay = document.querySelector(".pieceDisplay")
const pieceDisplayImage = document.querySelector(".pieceDisplayImage")

let grid = document.createElement("div")

grid.className = "grid"
grid.style.display = "grid"
grid.style.gridTemplateColumns = "repeat(16, 1fr)"
grid.style.gridTemplateRows = "repeat(9, 1fr)"

grid.style.width = "1024px"
grid.style.height = "768px"

grid.style.display = "grid"
grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`
grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`

grid.style.width = `${64*gridWidth}px`
grid.style.height = `${64*gridHeight}px`
grid.style.margin = "8px"

grid.style.outlineColor = "black"
grid.style.outlineStyle = "solid"
grid.style.outlineWidth = "8px"

grid.backgroundColor = "black"

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

        if (gridData[(gridY - 1)] == undefined){
            gridData[(gridY - 1)] = []
        }

        if (gridData[(gridY - 1)][(gridX - 1)] == undefined){
            gridData[(gridY - 1)][(gridX - 1)] = {
                "tile": "DEBUG",
                "solid": true,
                "water": false
            }
        }

        gridData[(gridY - 1)][(gridX - 1)].loot = "water"

        try {gridElement.style.backgroundImage = `url('../tiles/${gridData[(gridY - 1)][(gridX - 1)].tile}.png')`}
        catch {
            gridElement.style.backgroundImage = `url('../tiles/DEBUG.png')`
        }

        gridX++
        if (gridX > gridWidth) {
            gridY++
            gridX = 1
        }
    }
}

console.log(gridData)

document.body.appendChild(grid)
loadGrid(gridData[map])

function whereAmI(PY, PX, clean) {
    let tileEdit = document.querySelector(`.gridElement${PY}_${PX}`)

    if (clean) {
        tileEdit.style.outlineColor = ""
        tileEdit.style.outlineStyle = ""
        tileEdit.style.zIndex = "0"
    } else {
        tileEdit.style.outlineColor = "red"
        tileEdit.style.outlineStyle = "solid"
        tileEdit.style.zIndex = "1"
        tileInfo.textContent = `solid: ${gridData[map][PY - 1][PX - 1].solid}`
    }
}

window.addEventListener('keydown', function (e) {
    if (e.key == " ") {
        let tileEdit = document.querySelector(`.gridElement${PY}_${PX}`)

        tileEdit.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
        gridData[map][PY - 1][PX - 1].tile = tiles[cursor]
        console.log(gridData)
    } else if (e.key == "." && cursor < (tiles.length - 1)) {
        cursor++

        pieceDisplay.textContent = tiles[cursor]
        pieceDisplayImage.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
    } else if (e.key == "," && cursor > 0) {
        cursor--

        pieceDisplay.textContent = tiles[cursor]
        pieceDisplayImage.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
    } else if (e.key == "/") {
        gridData[map][PY - 1][PX - 1].solid = !gridData[map][PY - 1][PX - 1].solid
    } else if (e.key == "'") {
        gridData[map][PY - 1][PX - 1].water = !gridData[map][PY - 1][PX - 1].water
    } else if (e.key == "a" && PX > 1) {
        whereAmI(PY, PX, true)
        PX--
        whereAmI(PY, PX, false)
    } else if (e.key == "d" && PX < 16) {
        whereAmI(PY, PX, true)
        PX++
        whereAmI(PY, PX, false)
    } else if (e.key == "w" && PY > 1) {
        whereAmI(PY, PX, true)
        PY--
        whereAmI(PY, PX, false)
    } else if (e.key == "s" && PY < 12) {
        whereAmI(PY, PX, true)
        PY++
        whereAmI(PY, PX, false)
    } else if (e.key == "ArrowLeft" && map > 0) {
        map--
        loadGrid(gridData[map])
    } else if (e.key == "ArrowRight" && map < gridData.length-1) {
        map++
        loadGrid(gridData[map])
    } else if (e.key == "1") {
        
    } else if (e.key == "2") {
        
    }

    tileInfo.textContent = `solid: ${gridData[map][PY - 1][PX - 1].solid}, water: ${gridData[map][PY - 1][PX - 1].water}`
    document.querySelector(".inputDisplay").innerHTML = `You pressed [${e.key}]`
}, false);

whereAmI(PY, PX, false)