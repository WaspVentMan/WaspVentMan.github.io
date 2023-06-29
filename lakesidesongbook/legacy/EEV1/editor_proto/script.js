let gridWidth = 16
let gridHeight = 10

let PX = 1
let PY = 1

let cursor = 0
let tiles = ["DEBUG", "PA_FLOOR", "PA_PATH_ES", "PA_PATH_EW", "PA_PATH_NE", "PA_PATH_NS", "PA_PATH_NW", "PA_PATH_SW", "PA_WALL", "PA_WATER", "PA_WATER_EDGE"]

const pieceDisplay = document.querySelector(".pieceDisplay")
const pieceDisplayImage = document.querySelector(".pieceDisplayImage")

let grid = document.createElement("div")

grid.className = "grid"
grid.style.display = "grid"
grid.style.gridTemplateColumns = "repeat(16, 1fr)"
grid.style.gridTemplateRows = "repeat(12, 1fr)"

grid.style.width = "1024px"
grid.style.height = "768px"

grid.style.display = "grid"
grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`
grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`

grid.style.width = `${64*gridWidth}px`
grid.style.height = `${64*gridHeight}px`

function loadGrid(PX, PY) {
    let gridX = 1
    let gridY = 1
    for (let x = 0; x < (gridWidth * gridHeight); x++) {
        let gridElement = document.createElement("div")

        gridElement.style.gridArea = `${gridY} / ${gridX}`
        try {
            gridElement.style.backgroundImage = `url('../tiles/${gridData[(gridY - 1) + PY][(gridX - 1) + PX].tile}.png')`
        } catch {
            gridElement.style.backgroundImage = `url('../tiles/DEBUG.png')`
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

console.log(gridData)

document.body.appendChild(grid)

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
    }
}

window.addEventListener('keydown', function (e) {
    if (e.key == " ") {
        let tileEdit = document.querySelector(`.gridElement${PY}_${PX}`)

        tileEdit.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
        gridData[PY - 1][PX - 1].tile = tiles[cursor]
        console.log(gridData)
    } else if (e.key == "." && cursor < (tiles.length - 1)) {
        cursor++

        pieceDisplay.textContent = tiles[cursor]
        pieceDisplayImage.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
    } else if (e.key == "," && cursor > 0) {
        cursor--

        pieceDisplay.textContent = tiles[cursor]
        pieceDisplayImage.style.backgroundImage = `url('../tiles/${tiles[cursor]}.png')`
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
    }
    else {
        document.querySelector(".inputDisplay").innerHTML = `You pressed [${e.key}]`
    }
}, false);

whereAmI(PY, PX, false)