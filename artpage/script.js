let scrollSpeed = 0
let scrollXPos = 0

console.log(navigator.userAgentData.mobile)
if (navigator.userAgentData.mobile){
    document.querySelector(".background").remove()
    document.querySelector(".leftControl").remove()
    document.querySelector(".rightControl").remove()

    let mobBlock = document.createElement("div")

    mobBlock.style.position = "fixed"
    mobBlock.style.width = "100%"
    mobBlock.style.height = "100%"
    mobBlock.style.backgroundColor = "#f55"

    let text = document.createElement("h1")
    text.textContent = "Sorry, mobile is not currently supported."
    text.style.fontSize = "xx-large"
    text.style.textAlign = "center"

    mobBlock.appendChild(text)
    document.body.appendChild(mobBlock)
}

//    if (e.clientX < (screen.width/10)) {
//        scrollSpeed -= 1.66
//        console.log("left")
//    } else if (e.clientX > (screen.width-(screen.width/10))) {
//        scrollSpeed += 1.66
//        console.log("right")
//    }

setInterval(async function () {
    scrollSpeed = Math.round((scrollSpeed*0.9)*1000)/1000

    if (scrollSpeed <= 0.005 && scrollSpeed >= -0.005){
        scrollSpeed = 0
    }

    scrollXPos += scrollSpeed

    window.scrollTo(scrollXPos, 0)

    //console.log(`scrollSpeed: ${scrollSpeed} || scrollXPos: ${scrollXPos}`)
}, 1000/60)