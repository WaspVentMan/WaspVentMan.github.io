let time = 0
let tick = Date.now()
let speed = 1

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
    }
}
catch{console.log(":(")}

function purchase(cog){
    if (time > cogs[cog].cost){
        time -= cogs[cog].cost

        cogs[cog].mult *= 1.05
        cogs[cog].cost *= 2.5
        cogs[cog].count += 1
    }
}

function timeify(time){
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

let gameloop = setInterval(function(){
    time += (1+(speed-1))*((Date.now()-tick)/1000)
    cogs[6].count += (cogs[7].count*cogs[7].mult)*((Date.now()-tick)/1000)
    cogs[5].count += (cogs[6].count*cogs[6].mult)*((Date.now()-tick)/1000)
    cogs[4].count += (cogs[5].count*cogs[5].mult)*((Date.now()-tick)/1000)
    cogs[3].count += (cogs[4].count*cogs[4].mult)*((Date.now()-tick)/1000)
    cogs[2].count += (cogs[3].count*cogs[3].mult)*((Date.now()-tick)/1000)
    cogs[1].count += (cogs[2].count*cogs[2].mult)*((Date.now()-tick)/1000)
    cogs[0].count += (cogs[1].count*cogs[1].mult)*((Date.now()-tick)/1000)
    speed += (cogs[0].count*cogs[0].mult)*((Date.now()-tick)/1000)
    tick = Date.now()

    for (let x = 0; x < cogs.length; x++){
        document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(cogs[x].count)
        document.querySelector(".cog" + (x+1) + "mult").textContent = "x" + Math.floor(cogs[x].mult*100)/100
        document.querySelector(".cog" + (x+1) + "cost").textContent = timeify(cogs[x].cost)
    }

    document.querySelector(".second").style.transform =    "rotate(" + ((time/1*(360/60))                + 180)%360 + "deg)"
    document.querySelector(".minute").style.transform =    "rotate(" + ((time/60*(360/60))               + 180)%360 + "deg)"
    document.querySelector(".hour").style.transform =      "rotate(" + ((time/3600*(360/12))             + 180)%360 + "deg)"
    document.querySelector(".day").style.transform =       "rotate(" + ((time/86400*(360/7))             + 180)%360 + "deg)"
    document.querySelector(".week").style.transform =      "rotate(" + ((time/604800*(360/4.35))         + 180)%360 + "deg)"
    document.querySelector(".month").style.transform =     "rotate(" + ((time/2629800*(360/12))          + 180)%360 + "deg)"
    document.querySelector(".year").style.transform =      "rotate(" + ((time/31557600*(360/10))         + 180)%360 + "deg)"
    document.querySelector(".decade").style.transform =    "rotate(" + ((time/315576000*(360/10))        + 180)%360 + "deg)"
    document.querySelector(".century").style.transform =   "rotate(" + ((time/3155760000*(360/10))       + 180)%360 + "deg)"
    document.querySelector(".millennia").style.transform = "rotate(" + ((time/31557600000*(360/1000000)) + 180)%360 + "deg)"

    document.querySelector(".second").style.filter =    "blur(" + ((speed/60)         ) + "px)"
    document.querySelector(".minute").style.filter =    "blur(" + ((speed/3600)       ) + "px)"
    document.querySelector(".hour").style.filter =      "blur(" + ((speed/86400)      ) + "px)"
    document.querySelector(".day").style.filter =       "blur(" + ((speed/604800)     ) + "px)"
    document.querySelector(".week").style.filter =      "blur(" + ((speed/2629800)    ) + "px)"
    document.querySelector(".month").style.filter =     "blur(" + ((speed/31557600)   ) + "px)"
    document.querySelector(".year").style.filter =      "blur(" + ((speed/315576000)  ) + "px)"
    document.querySelector(".decade").style.filter =    "blur(" + ((speed/3155760000) ) + "px)"
    document.querySelector(".century").style.filter =   "blur(" + ((speed/31557600000)) + "px)"
    
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
    document.querySelector(".eonDisp").textContent = Math.floor(time/31557600000000000)

    document.querySelector(".timeDisp").textContent = Math.floor(speed-1)
    
    if (Math.floor(time/31557600000000000) != "0"){
        document.body.innerHTML = "<br><h1>After an Eon, the universe has burned out, it is cold.</h1><h1>There is nothing else.</h1><h2>Thank you for playing.</h2><br><button onclick=\"clearInterval(gameloop); localStorage.clear(); location.reload()\" style=\"font-family: monospace;\">TURN BACK THE CLOCK</button>"
        clearInterval(gameloop)
    }

    localStorage.setItem("gloretime", JSON.stringify({"time": time, "cogs": cogs, "speed": speed, "tick": tick}))
}, 10)

