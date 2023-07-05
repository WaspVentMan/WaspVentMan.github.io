let gridWidth = 16
let gridHeight = 10

let xSkew = (screen.width - (64*gridWidth)) / 2
let ySkew = (screen.height - (64*gridHeight)) / 2

let PX = 0
let PY = 0

const play = document.getElementById("play")

document.addEventListener('click', () => {
    music.play()
})

const player = document.querySelector(".man")
const gridContainer = document.querySelector(".gridContainer")
const grid = document.querySelector(".grid")

grid.style.display = "grid"
grid.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`
grid.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`

grid.style.width = `${64*gridWidth}px`
grid.style.height = `${64*gridHeight}px`

gridContainer.style.left = `${xSkew}px`
gridContainer.style.top = `${ySkew}px`

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

console.log(gridData)

window.addEventListener('keydown', function (e) {
    if (e.key == "a" && PX >= 1) {
        PX--
        //loadGrid(PX, PY)
    } else if (e.key == "d" && PX < gridWidth-1) {
        PX++
        //loadGrid(PX, PY)
    } else if (e.key == "w" && PY >= 1) {
        PY--
        //loadGrid(PX, PY)
    } else if (e.key == "s" && PY < gridHeight-1) {
        PY++
        //loadGrid(PX, PY)
    }

    player.style.left = `${(64*PX)+xSkew}px`
    player.style.top = `${(64*PY)+ySkew}px`
}, false)