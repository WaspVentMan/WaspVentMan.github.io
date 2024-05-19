let player = {
    "time": 0,
    "tick": Date.now(),
    "speed": 1,
    "bigFreeze": 0,
    "freezeStart": 0,
    "fastestFreeze": 1e100,
    "cogs": [
        {"cost": 60, "mult": 1, "count": 0},
        {"cost": 3600, "mult": 1, "count": 0},
        {"cost": 86400, "mult": 1, "count": 0},
        {"cost": 604800, "mult": 1, "count": 0},
        {"cost": 2629800, "mult": 1, "count": 0},
        {"cost": 31557600, "mult": 1, "count": 0},
        {"cost": 315576000, "mult": 1, "count": 0},
        {"cost": 3155760000, "mult": 1, "count": 0}
    ],
    "auto": [
        {"cost": 1, "unlocked": false},
        {"cost": 2, "unlocked": false},
        {"cost": 4, "unlocked": false},
        {"cost": 8, "unlocked": false},
        {"cost": 16, "unlocked": false},
        {"cost": 32, "unlocked": false},
        {"cost": 64, "unlocked": false},
        {"cost": 128, "unlocked": false}
    ],
    "upgrade": [
        {"cost": 1, "unlocked": false},
        {"cost": 2, "unlocked": false},
        {"cost": 4, "unlocked": false},
        {"cost": 8, "unlocked": false},
        {"cost": 16, "unlocked": false},
        {"cost": 32, "unlocked": false},
        {"cost": 64, "unlocked": false},
        {"cost": 128, "unlocked": false}
    ],
    "settings": {
        "autoEon": false,
        "performance": false,
        "renderer": false,
        "format": false
    }
}

let saveData = JSON.parse(localStorage.getItem("gloretime").replaceAll("null", "0"))

console.log(saveData)
console.log(player)

if (saveData != null && saveData.time != null){
    console.log(Object.keys(saveData))
    for (let x = 0; x < Object.keys(saveData).length; x++){
        player[Object.keys(saveData)[x]] = saveData[Object.keys(saveData)[x]]
    }
}

if (player.bigFreeze != 0){
    document.querySelector(".eonUp").style.display = "block"
    document.querySelector(".automation").style.display = "block"
}

if (player.freezeStart == 0){
    player.freezeStart = Date.now()
}

if (player.fastestFreeze == 1e100){
    document.querySelector(".freezeFast").style.display = "none"
} else if (player.fastestFreeze >= 60000) {
    document.querySelector(".fastFreeze").innerHTML = timeify(player.fastestFreeze/1000).toLowerCase()
} else if (player.fastestFreeze >= 10000) {
    document.querySelector(".fastFreeze").innerHTML = player.fastestFreeze/1000 + "s"
} else {
    document.querySelector(".fastFreeze").innerHTML = player.fastestFreeze + "ms"
}

if (player.time == 0){
    for (let x = 0; x < player.upgrade.length; x++){
        if (player.upgrade[x].unlocked){
            player.time = [60, 3600, 86400, 604800, 2629800, 31557600, 315576000, 3155760000][x]
        }
    }
}

function purchase(cog){
    if (player.time > player.cogs[cog].cost){
        player.time -= player.cogs[cog].cost

        player.cogs[cog].mult *= 1.1
        player.cogs[cog].cost *= (2.5 + cog)
        player.cogs[cog].count += 1

        if (player.cogs[cog].cost > 31557600000000000){
            player.cogs[cog].cost = 1e100
        }
    }
}

function purchaseAuto(cog){
    if (player.bigFreeze > player.auto[cog].cost){
        player.bigFreeze -= player.auto[cog].cost

        player.auto[cog].cost = 0
        player.auto[cog].unlocked = !player.auto[cog].unlocked
    }
}

function purchaseUpgrade(cog){
    if (player.bigFreeze > player.upgrade[cog].cost){
        player.bigFreeze -= player.upgrade[cog].cost

        player.upgrade[cog].cost = 0
        player.upgrade[cog].unlocked = true
    }
}

/**
 * Converts time (s) into words of time
 * @param {*} time time to be converted
 * @returns string, 60 becomes 60S, 120 becomes 2M, etc
 */
function timeify(time){
    const timeBounds = [1, 60, 3600, 86400, 604800, 2629800, 31557600, 315576000, 3155760000, 31557600000, 1.8e308]
    const timeNames = ["S", "M", "H", "D", "W", "Mo", "Y", "De", "C", "Mi", "INFINITY"]

    let back = ""

    for (let x = 0; x < timeBounds.length; x++){
        if (time < timeBounds[x+1]){
            for (let y = 0; y < 5; y++){
                if (time != 0 && x-y >= 0 && Math.floor(time/timeBounds[x-y]) != 0){
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
    const timeBounds = [60, 60, 24, 7, 4.35, 12, 10, 10, 10, 1000000, 1.8e308]
    const timeNames = ["Second(s)", "Minute(s)", "Hour(s)", "Day(s)", "Week(s)", "Month(s)", "Year(s)", "Decade(s)", "Centur(y/ies)", "Millenni(um/a)", "Infinity"]

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
    if (!player.settings.renderer){
        document.querySelector(".second")   .style.opacity = 1-(player.speed/6000)
        document.querySelector(".minute")   .style.opacity = 1-(player.speed/360000)
        document.querySelector(".hour")     .style.opacity = 1-(player.speed/8640000)
        document.querySelector(".day")      .style.opacity = 1-(player.speed/60480000)
        document.querySelector(".week")     .style.opacity = 1-(player.speed/262980000)
        document.querySelector(".month")    .style.opacity = 1-(player.speed/3155760000)
        document.querySelector(".year")     .style.opacity = 1-(player.speed/31557600000)
        document.querySelector(".decade")   .style.opacity = 1-(player.speed/315576000000)
        document.querySelector(".century")  .style.opacity = 1-(player.speed/3155760000000)

        document.querySelector(".second")   .style.filter = "blur(0px)"
        document.querySelector(".minute")   .style.filter = "blur(0px)"
        document.querySelector(".hour")     .style.filter = "blur(0px)"
        document.querySelector(".day")      .style.filter = "blur(0px)"
        document.querySelector(".week")     .style.filter = "blur(0px)"
        document.querySelector(".month")    .style.filter = "blur(0px)"
        document.querySelector(".year")     .style.filter = "blur(0px)"
        document.querySelector(".decade")   .style.filter = "blur(0px)"
        document.querySelector(".century")  .style.filter = "blur(0px)"
    } else {
        document.querySelector(".second")   .style.opacity = 1-(player.speed/6000)
        document.querySelector(".minute")   .style.opacity = 1-(player.speed/360000)
        document.querySelector(".hour")     .style.opacity = 1-(player.speed/8640000)
        document.querySelector(".day")      .style.opacity = 1-(player.speed/60480000)
        document.querySelector(".week")     .style.opacity = 1-(player.speed/262980000)
        document.querySelector(".month")    .style.opacity = 1-(player.speed/3155760000)
        document.querySelector(".year")     .style.opacity = 1-(player.speed/31557600000)
        document.querySelector(".decade")   .style.opacity = 1-(player.speed/315576000000)
        document.querySelector(".century")  .style.opacity = 1-(player.speed/3155760000000)

        document.querySelector(".second")   .style.filter = "blur(" + ((player.speed/60)         ) + "px)"
        document.querySelector(".minute")   .style.filter = "blur(" + ((player.speed/3600)       ) + "px)"
        document.querySelector(".hour")     .style.filter = "blur(" + ((player.speed/86400)      ) + "px)"
        document.querySelector(".day")      .style.filter = "blur(" + ((player.speed/604800)     ) + "px)"
        document.querySelector(".week")     .style.filter = "blur(" + ((player.speed/2629800)    ) + "px)"
        document.querySelector(".month")    .style.filter = "blur(" + ((player.speed/31557600)   ) + "px)"
        document.querySelector(".year")     .style.filter = "blur(" + ((player.speed/315576000)  ) + "px)"
        document.querySelector(".decade")   .style.filter = "blur(" + ((player.speed/3155760000) ) + "px)"
        document.querySelector(".century")  .style.filter = "blur(" + ((player.speed/31557600000)) + "px)"
    }

    if (1-(player.speed/6000)          > 0){document.querySelector(".second") .style.transform = "rotate(" + ((player.time/1*(360/60))          + 180)%360 + "deg)"}
    if (1-(player.speed/360000)        > 0){document.querySelector(".minute") .style.transform = "rotate(" + ((player.time/60*(360/60))         + 180)%360 + "deg)"}
    if (1-(player.speed/8640000)       > 0){document.querySelector(".hour")   .style.transform = "rotate(" + ((player.time/3600*(360/12))       + 180)%360 + "deg)"}
    if (1-(player.speed/60480000)      > 0){document.querySelector(".day")    .style.transform = "rotate(" + ((player.time/86400*(360/7))       + 180)%360 + "deg)"}
    if (1-(player.speed/262980000)     > 0){document.querySelector(".week")   .style.transform = "rotate(" + ((player.time/604800*(360/4.35))   + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000)    > 0){document.querySelector(".month")  .style.transform = "rotate(" + ((player.time/2629800*(360/12))    + 180)%360 + "deg)"}
    if (1-(player.speed/31557600000)   > 0){document.querySelector(".year")   .style.transform = "rotate(" + ((player.time/31557600*(360/10))   + 180)%360 + "deg)"}
    if (1-(player.speed/315576000000)  > 0){document.querySelector(".decade") .style.transform = "rotate(" + ((player.time/315576000*(360/10))  + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000000) > 0){document.querySelector(".century").style.transform = "rotate(" + ((player.time/3155760000*(360/10)) + 180)%360 + "deg)"}
    document.querySelector(".millennia").style.transform = "rotate(" + ((player.time/31557600000000000*360) + 180)%360 + "deg)"

    if (1-(player.speed/6000)          > 0 || true){document.querySelector(".eonsecond") .style.transform = "rotate(" + ((player.bigFreeze*(360/60))            + 180)%360 + "deg)"}
    if (1-(player.speed/360000)        > 0 || true){document.querySelector(".eonminute") .style.transform = "rotate(" + ((player.bigFreeze/60*(360/60))         + 180)%360 + "deg)"}
    if (1-(player.speed/8640000)       > 0 || true){document.querySelector(".eonhour")   .style.transform = "rotate(" + ((player.bigFreeze/3600*(360/12))       + 180)%360 + "deg)"}
    if (1-(player.speed/60480000)      > 0 || true){document.querySelector(".eonday")    .style.transform = "rotate(" + ((player.bigFreeze/86400*(360/7))       + 180)%360 + "deg)"}
    if (1-(player.speed/262980000)     > 0 || true){document.querySelector(".eonweek")   .style.transform = "rotate(" + ((player.bigFreeze/604800*(360/4.35))   + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000)    > 0 || true){document.querySelector(".eonmonth")  .style.transform = "rotate(" + ((player.bigFreeze/2629800*(360/12))    + 180)%360 + "deg)"}
    if (1-(player.speed/31557600000)   > 0 || true){document.querySelector(".eonyear")   .style.transform = "rotate(" + ((player.bigFreeze/31557600*(360/10))   + 180)%360 + "deg)"}
    if (1-(player.speed/315576000000)  > 0 || true){document.querySelector(".eondecade") .style.transform = "rotate(" + ((player.bigFreeze/315576000*(360/10))  + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000000) > 0 || true){document.querySelector(".eoncentury").style.transform = "rotate(" + ((player.bigFreeze/3155760000*(360/10)) + 180)%360 + "deg)"}
    document.querySelector(".eonmillennia").style.transform = "rotate(" + ((player.bigFreeze/31557600000000000*360) + 180)%360 + "deg)"

    let display = [".secDisp",".minDisp",".houDisp",".dayDisp",".weeDisp",".monDisp",".yeaDisp",".decDisp",".cenDisp",".milDisp"]
    let degredation = [1,60,3600,86400,604800,2629800,31557600,315576000,3155760000,31557600000]
    for (let x = 0; x < display.length; x++){
        if (Math.floor(player.time/degredation[x]) < 1000){
            document.querySelector(display[x]).textContent = Math.floor(player.time/degredation[x])
        } else {
            document.querySelector(display[x]).textContent = Math.floor(player.time/degredation[x]).toExponential(2).replace("+", "")
        }
    }

    display = [".eonDisp",".eonsecDisp",".eonminDisp",".eonhouDisp",".eondayDisp",".eonweeDisp",".eonmonDisp",".eonyeaDisp",".eondecDisp",".eoncenDisp",".eonmilDisp"]
    degredation = [1,1,60,3600,86400,604800,2629800,31557600,315576000,3155760000,31557600000]
    for (let x = 0; x < display.length; x++){
        if (Math.floor(player.bigFreeze/degredation[x]) < 1000){
            document.querySelector(display[x]).textContent = Math.floor(player.bigFreeze/degredation[x])
        } else {
            document.querySelector(display[x]).textContent = Math.floor(player.bigFreeze/degredation[x]).toExponential(2).replace("+", "")
        }
    }

    document.querySelector(".eoneonDisp").textContent = 0//player.bigFreeze
    
    if (player.speed < 1000){
        document.querySelector(".timeDisp").textContent = Math.floor((player.speed-1)*10)/10
    } else if (Math.floor(player.time/(31557600000000000)) < 1) {
        document.querySelector(".timeDisp").textContent = player.speed.toExponential(2).replace("+", "")
    } else {
        document.querySelector(".timeDisp").textContent = (player.speed/(Math.ceil(player.time/(31557600000000000))**2)).toExponential(2).replace("+", "") + " (speed reduced by /" + (Math.ceil(player.time/(31557600000000000))**2) + ")"
    }
}

function prestige(value){
    clearInterval(gameloop)
    clearInterval(slowloop)

    player.bigFreeze += value

    setTimeout(function(){
        localStorage.setItem('gloretime',
            JSON.stringify(
                {
                    'bigFreeze': player.bigFreeze,
                    'auto': player.auto,
                    'upgrade': player.upgrade,
                    'settings': player.settings,
                    'fastestFreeze': player.fastestFreeze
                }
            )
        )
        
        location.reload()
    }, 10)
}

let gameloop = setInterval(function(){
    let d = (Date.now() - player.tick)/1000
    player.tick = Date.now()

    player.cogs[6].count += (player.cogs[7].count*player.cogs[7].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[5].count += (player.cogs[6].count*player.cogs[6].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[4].count += (player.cogs[5].count*player.cogs[5].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[3].count += (player.cogs[4].count*player.cogs[4].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[2].count += (player.cogs[3].count*player.cogs[3].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[1].count += (player.cogs[2].count*player.cogs[2].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.cogs[0].count += (player.cogs[1].count*player.cogs[1].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.speed += (player.cogs[0].count*player.cogs[0].mult)*(d/10)*(1+Math.cbrt(player.bigFreeze))
    player.time += player.speed*d/(Math.ceil(player.time/31557600000000000)*Math.ceil(player.time/31557600000000000))

    for (let x = 0; x < player.auto.length; x++){
        if (player.auto[7-x].unlocked){
            purchase(7-x)
        }
    }

    if (!player.settings.performance){
        rendertime()
    }

    if (Math.floor(player.time/(31557600000000000/2)) > 1 && player.fastestFreeze < 60000){
        document.querySelector(".eonPrestige").style.display = "block"
        document.querySelector(".eonReward").innerHTML = Math.floor(player.time/(31557600000000000))
    } else if (Math.floor(player.time/(31557600000000000/2)) > 1){
        if (Date.now()-player.freezeStart < player.fastestFreeze){
            player.fastestFreeze = Date.now()-player.freezeStart
        }

        document.body.innerHTML = "<div style=\"border-radius: 10px; outline: 2px solid cyan; background-color: lightcyan; padding: 8px; width: max-content; margin: auto; margin-top: 8px;\" class=\"eonPrestige\" onclick=\"prestige(1)\"><h1>BIG FREEZE</h1><h2>Earn <b>1</b> Eon when you reset.</h2></div>"
        player.bigFreeze++
        clearInterval(gameloop); clearInterval(slowloop)

        if (player.settings.autoEon){
            prestige(1)
        }
    }

    localStorage.setItem("gloretime", JSON.stringify(player))
}, 10)

let slowloop = setInterval(function(){
    for (let x = 0; x < player.cogs.length; x++){
        if (player.cogs[x].count < 1000){
            document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(player.cogs[x].count) + "x" + Math.floor((player.cogs[x].mult*(1+Math.cbrt(player.bigFreeze)))*100)/100
        } else {
            document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(player.cogs[x].count).toExponential(2).replace("+", "") + "x" + Math.floor((player.cogs[x].mult*(1+Math.cbrt(player.bigFreeze)))*100)/100
        }
        //document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(player.cogs[x].count) + "x" + Math.floor((player.cogs[x].mult*(1+Math.cbrt(player.bigFreeze)))*100)/100
        if (!player.settings.format){
            if (player.cogs[x].cost == 1e100){
                document.querySelector(".cog" + (x+1) + "cost").textContent = "Max"
            } else {
                document.querySelector(".cog" + (x+1) + "cost").textContent = timeify(player.cogs[x].cost)
            }
        } else {
            if (player.cogs[x].cost == 1e100){
                document.querySelector(".cog" + (x+1) + "cost").textContent = "Max"
            } else {
                document.querySelector(".cog" + (x+1) + "cost").textContent = timeify_old(player.cogs[x].cost)
            }
        }
    }

    if (player.settings.performance){
        rendertime()
    }

    for (let x = 0; x < 8; x++){
        document.querySelector(".auto" + (x+1)).textContent = ["False", "True"][player.auto[x].unlocked+0]
        document.querySelector(".auto" + (x+1) + "unlock").textContent = ["Purchase", "Toggle"][player.auto[x].unlocked+0]

        if (player.auto[x].cost == 0){
            document.querySelector(".auto" + (x+1) + "cost").textContent = "Unlocked"
        }

        document.querySelector(".upgrade" + (x+1)).textContent = ["False", "True"][player.upgrade[x].unlocked+0]
        document.querySelector(".upgrade" + (x+1) + "unlock").textContent = ["Purchase", "Purchased"][player.upgrade[x].unlocked+0]

        if (player.upgrade[x].cost == 0){
            document.querySelector(".upgrade" + (x+1) + "cost").textContent = "Unlocked"
        }
    }

    document.querySelector(".AE").textContent = ["OFF", "ON"][player.settings.autoEon+0]
    document.querySelector(".perf").textContent = ["OFF", "ON"][player.settings.performance+0]
    document.querySelector(".rend").textContent = ["OPACITY", "BLUR"][player.settings.renderer+0]
    document.querySelector(".form").textContent = ["NEW", "OLD"][player.settings.format+0]
}, 100)