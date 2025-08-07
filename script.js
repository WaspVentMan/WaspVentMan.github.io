const theStart = new Date("August 16, 2025 12:00:00 GMT+00:00")
const theEnd = new Date("August 23, 2025 12:00:00 GMT+00:00")

setInterval (()=>{
    if (Math.floor(((theStart.getTime() - Date.now())/1000)/86400) >= 7){
        document.querySelector(".ALE").style.display = "none"
    } else {
        document.querySelector(".ALE").style.display = "block"
    }

    if (theStart.getTime() - Date.now() > 0){
        if (Math.floor(((theStart.getTime() - Date.now())/1000)/86400) == 0){
            document.querySelector(".timer").innerHTML = renderString(renderTime(((theStart.getTime() - Date.now())/1000)%86400).replaceAll(":", "."), "wobble", "default4x")
        } else if (Math.floor(((theStart.getTime() - Date.now())/1000)/86400) == 1){
            document.querySelector(".timer").innerHTML = renderStrings([Math.floor(((theStart.getTime() - Date.now())/1000)/86400) + " day", renderTime(((theStart.getTime() - Date.now())/1000)%86400).replaceAll(":", ".")], "wobble", "default4x")
        } else if (Math.floor(((theStart.getTime() - Date.now())/1000)/86400) >= 1) {
            document.querySelector(".timer").innerHTML = renderStrings([Math.floor(((theStart.getTime() - Date.now())/1000)/86400) + " days", renderTime(((theStart.getTime() - Date.now())/1000)%86400).replaceAll(":", ".")], "wobble", "default4x")
        }
    } else if (theEnd.getTime() - Date.now() > 0){
        if (Math.floor(((theEnd.getTime() - Date.now())/1000)/86400) == 0){
            document.querySelector(".timer").innerHTML = renderString(renderTime(((theEnd.getTime() - Date.now())/1000)%86400).replaceAll(":", "."), "wobble", "default4x")
        } else if (Math.floor(((theEnd.getTime() - Date.now())/1000)/86400) == 1){
            document.querySelector(".timer").innerHTML = renderStrings([Math.floor(((theEnd.getTime() - Date.now())/1000)/86400) + " day", renderTime(((theEnd.getTime() - Date.now())/1000)%86400).replaceAll(":", ".")], "wobble", "default4x")
        } else {
            document.querySelector(".timer").innerHTML = renderStrings([Math.floor(((theEnd.getTime() - Date.now())/1000)/86400) + " days", renderTime(((theEnd.getTime() - Date.now())/1000)%86400).replaceAll(":", ".")], "wobble", "default4x")
        }
    } else {
        document.querySelector(".ALE").innerHTML = "<br>" + renderStrings(["it is over", "", "thank you", "for participating"], "wobble", "default4x") + "<br>"
    }

    let effect = document.querySelectorAll(".wobble")
    for (let x = 0; x < effect.length; x++){
        effect[x].style.marginTop = Math.sin((Date.now()/500)+(x/2))*4 + "px"
    }

    let scrollTop = document.querySelector(".peaks87container").getBoundingClientRect().bottom

    document.querySelector(".peaks87towerRender").style.bottom = Math.round(((scrollTop/8) - 256)%1024)-1024 + "px"
    document.querySelector(".peaks87logo").style.bottom = Math.round((scrollTop/4)) + "px"
    for (let x = 0; x < 14; x++){
        document.querySelector(".peaks87paralax"+x).style.bottom = Math.round(((scrollTop-512)/(32/(x+1)))-256)+192+[0, 30][(x==13)+0] + "px"
    }
}, 1000/60)