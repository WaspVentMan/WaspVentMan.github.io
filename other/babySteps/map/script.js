let fogs = [
    7076,
    6617,
    6102,
    4699,
    4544,
    3336,
    2559,
    1634,
    0
]

function fogAdjust(site){
    for (let x = 0; x < 9; x++){
        if (x < site){
            document.querySelector(".fogOfWar" + x).style.display = "none"
            window.scrollTo(0, fogs[x])
        } else {
            document.querySelector(".fogOfWar" + x).style.display = "block"
        }
    }
    
    document.querySelector('.warning').remove()
    document.body.style.overflow = 'scroll'
}