let time = 0
let tick = Date.now()
let speed = 1

let bigFreeze = 0

let cogs = [
    {"cost": 60, "mult": 1, "count": 0},
    {"cost": 3600, "mult": 1, "count": 0},
    {"cost": 86400, "mult": 1, "count": 0},
    {"cost": 604800, "mult": 1, "count": 0},
    {"cost": 2629800, "mult": 1, "count": 0},
    {"cost": 31557600, "mult": 1, "count": 0},
    {"cost": 315576000, "mult": 1, "count": 0},
    {"cost": 3155760000, "mult": 1, "count": 0}
]

let performance = false
let renderer = false
let format = false

let saveData = localStorage.getItem("gloretime")

try {
    if (saveData != null){
        saveData = JSON.parse(saveData)
    
        if (saveData.time != undefined){
            time = saveData.time
        }
        if (saveData.cogs != undefined){
            cogs = saveData.cogs
        }
        if (saveData.speed != undefined){
            speed = saveData.speed
        }
        if (saveData.tick != undefined){
            tick = saveData.tick
        }
        if (saveData.tick != undefined){
            tick = saveData.tick
        }
        if (saveData.bigFreeze != undefined){
            bigFreeze = saveData.bigFreeze
        }
    }
}
catch{console.log(":(")}

function purchase(cog){
    if (time > cogs[cog].cost){
        time -= cogs[cog].cost

        cogs[cog].mult *= 1.05
        cogs[cog].cost *= (2.5 + cog)
        cogs[cog].count += 1
    }
}

/**
 * Converts time (s) into words of time
 * @param {*} time time to be converted
 * @returns string, 60 becomes 60S, 120 becomes 2M, etc
 */
function timeify(time){
    const timeBounds = [1, 60, 3600, 86400, 604800, 2629800, 31557600, 315576000, 3155760000, 31557600000, 31557600000000000]
    const timeNames = ["S", "M", "H", "D", "W", "M", "Y", "D", "C", "M", "E"]

    let back = ""

    for (let x = 0; x < timeBounds.length; x++){
        if (time < timeBounds[x+1]){
            for (let y = 0; y < 5; y++){
                if (time != 0 && x-y >= 0){
                    back += " " + Math.floor(time/timeBounds[x-y]) + timeNames[x-y]
                    time -= time-(time%timeBounds[x-y])
                }
            }
            return back
        }
    }
}

/**
 * Converts time (s) into words of time, old version
 * @param {*} time time to be converted
 * @returns string, 60 becomes 60 Second(s), 120 becomes 2 Minute(s), etc
 */
function timeify_old(time){
    const timeBounds = [60, 60, 24, 7, 4.35, 12, 10, 10, 10, 1000000]
    const timeNames = ["Second(s)", "Minute(s)", "Hour(s)", "Day(s)", "Week(s)", "Month(s)", "Year(s)", "Decade(s)", "Centur(y/ies)", "Millenni(um/a)", "Eon(s)"]

    let back = ""
    let timecopy = time -1
    timecopy += 1

    for (let x = 0; x < timeBounds.length; x++){
        if (time >= timeBounds[x]){
            time /= timeBounds[x]
        } else {
            back += Math.floor(time) + " " + timeNames[x]
            time -= Math.floor(time)

            if (time != 0){
                for (let y = x-1; y > x-2; y--){
                    if (y < 0){break}
                    time *= timeBounds[y]
                    if (x-y == 0){
                        back += ", " + Math.floor(time) + " " + timeNames[y]
                    } else {
                        back += " and " + Math.floor(time) + " " + timeNames[y]
                    }
                    time -= Math.floor(time)
                }
            }

            return back
        }
    }
}

function rendertime(){
    if (!renderer){
        document.querySelector(".second") .style.opacity = 1-(speed/600)
        document.querySelector(".minute") .style.opacity = 1-(speed/36000)
        document.querySelector(".hour")   .style.opacity = 1-(speed/864000)
        document.querySelector(".day")    .style.opacity = 1-(speed/6048000)
        document.querySelector(".week")   .style.opacity = 1-(speed/26298000)
        document.querySelector(".month")  .style.opacity = 1-(speed/315576000)
        document.querySelector(".year")   .style.opacity = 1-(speed/3155760000)
        document.querySelector(".decade") .style.opacity = 1-(speed/31557600000)
        document.querySelector(".century").style.opacity = 1-(speed/315576000000)

        document.querySelector(".second").style.filter =    "blur(0px)"
        document.querySelector(".minute").style.filter =    "blur(0px)"
        document.querySelector(".hour").style.filter =      "blur(0px)"
        document.querySelector(".day").style.filter =       "blur(0px)"
        document.querySelector(".week").style.filter =      "blur(0px)"
        document.querySelector(".month").style.filter =     "blur(0px)"
        document.querySelector(".year").style.filter =      "blur(0px)"
        document.querySelector(".decade").style.filter =    "blur(0px)"
        document.querySelector(".century").style.filter =   "blur(0px)"
    } else {
        document.querySelector(".second") .style.opacity = 1
        document.querySelector(".minute") .style.opacity = 1
        document.querySelector(".hour")   .style.opacity = 1
        document.querySelector(".day")    .style.opacity = 1
        document.querySelector(".week")   .style.opacity = 1
        document.querySelector(".month")  .style.opacity = 1
        document.querySelector(".year")   .style.opacity = 1
        document.querySelector(".decade") .style.opacity = 1
        document.querySelector(".century").style.opacity = 1

        document.querySelector(".second").style.filter =    "blur(" + ((speed/60)         ) + "px)"
        document.querySelector(".minute").style.filter =    "blur(" + ((speed/3600)       ) + "px)"
        document.querySelector(".hour").style.filter =      "blur(" + ((speed/86400)      ) + "px)"
        document.querySelector(".day").style.filter =       "blur(" + ((speed/604800)     ) + "px)"
        document.querySelector(".week").style.filter =      "blur(" + ((speed/2629800)    ) + "px)"
        document.querySelector(".month").style.filter =     "blur(" + ((speed/31557600)   ) + "px)"
        document.querySelector(".year").style.filter =      "blur(" + ((speed/315576000)  ) + "px)"
        document.querySelector(".decade").style.filter =    "blur(" + ((speed/3155760000) ) + "px)"
        document.querySelector(".century").style.filter =   "blur(" + ((speed/31557600000)) + "px)"
    }

    if (1-(speed/6000)          > 0){document.querySelector(".second") .style.transform = "rotate(" + ((time/1*(360/60))          + 180)%360 + "deg)"}
    if (1-(speed/360000)        > 0){document.querySelector(".minute") .style.transform = "rotate(" + ((time/60*(360/60))         + 180)%360 + "deg)"}
    if (1-(speed/8640000)       > 0){document.querySelector(".hour")   .style.transform = "rotate(" + ((time/3600*(360/12))       + 180)%360 + "deg)"}
    if (1-(speed/60480000)      > 0){document.querySelector(".day")    .style.transform = "rotate(" + ((time/86400*(360/7))       + 180)%360 + "deg)"}
    if (1-(speed/262980000)     > 0){document.querySelector(".week")   .style.transform = "rotate(" + ((time/604800*(360/4.35))   + 180)%360 + "deg)"}
    if (1-(speed/3155760000)    > 0){document.querySelector(".month")  .style.transform = "rotate(" + ((time/2629800*(360/12))    + 180)%360 + "deg)"}
    if (1-(speed/31557600000)   > 0){document.querySelector(".year")   .style.transform = "rotate(" + ((time/31557600*(360/10))   + 180)%360 + "deg)"}
    if (1-(speed/315576000000)  > 0){document.querySelector(".decade") .style.transform = "rotate(" + ((time/315576000*(360/10))  + 180)%360 + "deg)"}
    if (1-(speed/3155760000000) > 0){document.querySelector(".century").style.transform = "rotate(" + ((time/3155760000*(360/10)) + 180)%360 + "deg)"}
    document.querySelector(".millennia").style.transform = "rotate(" + ((time/31557600000*(360/1000000)) + 180)%360 + "deg)"

    document.querySelector(".secDisp").textContent = Math.floor(time)
    document.querySelector(".minDisp").textContent = Math.floor(time/60)
    document.querySelector(".houDisp").textContent = Math.floor(time/3600)
    document.querySelector(".dayDisp").textContent = Math.floor(time/86400)
    document.querySelector(".weeDisp").textContent = Math.floor(time/604800)
    document.querySelector(".monDisp").textContent = Math.floor(time/2629800)
    document.querySelector(".yeaDisp").textContent = Math.floor(time/31557600)
    document.querySelector(".decDisp").textContent = Math.floor(time/315576000)
    document.querySelector(".cenDisp").textContent = Math.floor(time/3155760000)
    document.querySelector(".milDisp").textContent = Math.floor(time/31557600000)
    document.querySelector(".eonDisp").textContent = bigFreeze

    document.querySelector(".timeDisp").textContent = Math.floor((speed-1)*10)/10
}

let gameloop = setInterval(function(){
    time += (1+(speed-1))*((Date.now()-tick)/1000)
    cogs[6].count += (cogs[7].count*cogs[7].mult)*((Date.now()-tick)/10000)
    cogs[5].count += (cogs[6].count*cogs[6].mult)*((Date.now()-tick)/10000)
    cogs[4].count += (cogs[5].count*cogs[5].mult)*((Date.now()-tick)/10000)
    cogs[3].count += (cogs[4].count*cogs[4].mult)*((Date.now()-tick)/10000)
    cogs[2].count += (cogs[3].count*cogs[3].mult)*((Date.now()-tick)/10000)
    cogs[1].count += (cogs[2].count*cogs[2].mult)*((Date.now()-tick)/10000)
    cogs[0].count += (cogs[1].count*cogs[1].mult)*((Date.now()-tick)/10000)
    speed += (cogs[0].count*cogs[0].mult)*((Date.now()-tick)/10000)
    tick = Date.now()

    if (!performance){
        rendertime()
    }
    
    if (Math.floor(time/31557600000000000) > 1){
        document.body.innerHTML = "<br><h1>After an Eon, the universe has burned out, it is cold.</h1><h1>There is nothing else.</h1><h2>Thank you for playing.</h2><br><button onclick=\"clearInterval(gameloop); localStorage.setItem('gloretime', JSON.stringify({'bigFreeze': bigFreeze})); location.reload()\" style=\"font-family: monospace;\">TURN BACK THE CLOCK</button>"
        bigFreeze++
        clearInterval(gameloop); clearInterval(slowloop)
    }

    localStorage.setItem("gloretime", JSON.stringify({"time": time, "cogs": cogs, "speed": speed, "tick": tick, "bigFreeze": bigFreeze}))
}, 10)

let slowloop = setInterval(function(){
    for (let x = 0; x < cogs.length; x++){
        document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(cogs[x].count)
        document.querySelector(".cog" + (x+1) + "mult").textContent = "x" + Math.floor(cogs[x].mult*100)/100
        if (!format){
            document.querySelector(".cog" + (x+1) + "cost").textContent = timeify(cogs[x].cost)
        } else {
            document.querySelector(".cog" + (x+1) + "cost").textContent = timeify_old(cogs[x].cost)
        }
    }

    if (performance){
        rendertime()
    }

    document.querySelector(".perf").textContent = ["OFF", "ON"][performance+0]
    document.querySelector(".rend").textContent = ["OPACITY", "BLUR"][renderer+0]
    document.querySelector(".form").textContent = ["NEW", "OLD"][format+0]
}, 100)