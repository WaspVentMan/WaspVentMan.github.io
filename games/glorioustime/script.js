let player = {
    "time": 0,
    "tick": Date.now(),
    "speed": 1,
    "bigFreeze": 0,
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
        {"cost": 60, "unlocked": false},
        {"cost": 3600, "unlocked": false},
        {"cost": 86400, "unlocked": false},
        {"cost": 604800, "unlocked": false},
        {"cost": 2629800, "unlocked": false},
        {"cost": 31557600, "unlocked": false},
        {"cost": 315576000, "unlocked": false},
    ],
    "upgrade": [
        {"cost": 1, "unlocked": false},
        {"cost": 60, "unlocked": false},
        {"cost": 3600, "unlocked": false},
        {"cost": 86400, "unlocked": false},
        {"cost": 604800, "unlocked": false},
        {"cost": 2629800, "unlocked": false},
        {"cost": 31557600, "unlocked": false},
        {"cost": 315576000, "unlocked": false},
    ],
    "settings": {
        "autoEon": false,
        "performance": false,
        "renderer": false,
        "format": false
    }
}

try {
    let saveData = JSON.parse(localStorage.getItem("gloretime"))
    
    if (saveData != null){
        console.log( Object.keys(saveData))
        for (let x = 0; x < Object.keys(saveData).length; x++){
            player[Object.keys(saveData)[x]] = saveData[Object.keys(saveData)[x]]
        }
    }
}
catch{console.log(":(")}

if (player.bigFreeze != 0){
    document.querySelector(".eonUp").style.display = "block"
    document.querySelector(".automation").style.display = "block"
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

        player.cogs[cog].mult *= 1.05
        player.cogs[cog].cost *= (2.5 + cog)
        player.cogs[cog].count += 1
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
    const timeBounds = [1, 60, 3600, 86400, 604800, 2629800, 31557600, 315576000, 3155760000, 31557600000, 31557600000000000]
    const timeNames = ["S", "M", "H", "D", "W", "Mo", "Y", "De", "C", "Mi", "E"]

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
    if (!player.settings.renderer){
        document.querySelector(".second") .style.opacity = 1-(player.speed/600)
        document.querySelector(".minute") .style.opacity = 1-(player.speed/36000)
        document.querySelector(".hour")   .style.opacity = 1-(player.speed/864000)
        document.querySelector(".day")    .style.opacity = 1-(player.speed/6048000)
        document.querySelector(".week")   .style.opacity = 1-(player.speed/26298000)
        document.querySelector(".month")  .style.opacity = 1-(player.speed/315576000)
        document.querySelector(".year")   .style.opacity = 1-(player.speed/3155760000)
        document.querySelector(".decade") .style.opacity = 1-(player.speed/31557600000)
        document.querySelector(".century").style.opacity = 1-(player.speed/315576000000)

        document.querySelector(".second") .style.filter = "blur(0px)"
        document.querySelector(".minute") .style.filter = "blur(0px)"
        document.querySelector(".hour")   .style.filter = "blur(0px)"
        document.querySelector(".day")    .style.filter = "blur(0px)"
        document.querySelector(".week")   .style.filter = "blur(0px)"
        document.querySelector(".month")  .style.filter = "blur(0px)"
        document.querySelector(".year")   .style.filter = "blur(0px)"
        document.querySelector(".decade") .style.filter = "blur(0px)"
        document.querySelector(".century").style.filter = "blur(0px)"
    } else {
        document.querySelector(".second") .style.opacity = 1-(player.speed/6000)
        document.querySelector(".minute") .style.opacity = 1-(player.speed/360000)
        document.querySelector(".hour")   .style.opacity = 1-(player.speed/8640000)
        document.querySelector(".day")    .style.opacity = 1-(player.speed/60480000)
        document.querySelector(".week")   .style.opacity = 1-(player.speed/262980000)
        document.querySelector(".month")  .style.opacity = 1-(player.speed/3155760000)
        document.querySelector(".year")   .style.opacity = 1-(player.speed/31557600000)
        document.querySelector(".decade") .style.opacity = 1-(player.speed/315576000000)
        document.querySelector(".century").style.opacity = 1-(player.speed/3155760000000)

        document.querySelector(".second") .style.filter = "blur(" + ((player.speed/60)         ) + "px)"
        document.querySelector(".minute") .style.filter = "blur(" + ((player.speed/3600)       ) + "px)"
        document.querySelector(".hour")   .style.filter = "blur(" + ((player.speed/86400)      ) + "px)"
        document.querySelector(".day")    .style.filter = "blur(" + ((player.speed/604800)     ) + "px)"
        document.querySelector(".week")   .style.filter = "blur(" + ((player.speed/2629800)    ) + "px)"
        document.querySelector(".month")  .style.filter = "blur(" + ((player.speed/31557600)   ) + "px)"
        document.querySelector(".year")   .style.filter = "blur(" + ((player.speed/315576000)  ) + "px)"
        document.querySelector(".decade") .style.filter = "blur(" + ((player.speed/3155760000) ) + "px)"
        document.querySelector(".century").style.filter = "blur(" + ((player.speed/31557600000)) + "px)"
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
    document.querySelector(".millennia").style.transform = "rotate(" + ((player.time/31557600000*(360/1000000)) + 180)%360 + "deg)"

    if (1-(player.speed/6000)          > 0 || true){document.querySelector(".eonsecond") .style.transform = "rotate(" + ((player.bigFreeze/1*(360/60))          + 180)%360 + "deg)"}
    if (1-(player.speed/360000)        > 0 || true){document.querySelector(".eonminute") .style.transform = "rotate(" + ((player.bigFreeze/60*(360/60))         + 180)%360 + "deg)"}
    if (1-(player.speed/8640000)       > 0 || true){document.querySelector(".eonhour")   .style.transform = "rotate(" + ((player.bigFreeze/3600*(360/12))       + 180)%360 + "deg)"}
    if (1-(player.speed/60480000)      > 0 || true){document.querySelector(".eonday")    .style.transform = "rotate(" + ((player.bigFreeze/86400*(360/7))       + 180)%360 + "deg)"}
    if (1-(player.speed/262980000)     > 0 || true){document.querySelector(".eonweek")   .style.transform = "rotate(" + ((player.bigFreeze/604800*(360/4.35))   + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000)    > 0 || true){document.querySelector(".eonmonth")  .style.transform = "rotate(" + ((player.bigFreeze/2629800*(360/12))    + 180)%360 + "deg)"}
    if (1-(player.speed/31557600000)   > 0 || true){document.querySelector(".eonyear")   .style.transform = "rotate(" + ((player.bigFreeze/31557600*(360/10))   + 180)%360 + "deg)"}
    if (1-(player.speed/315576000000)  > 0 || true){document.querySelector(".eondecade") .style.transform = "rotate(" + ((player.bigFreeze/315576000*(360/10))  + 180)%360 + "deg)"}
    if (1-(player.speed/3155760000000) > 0 || true){document.querySelector(".eoncentury").style.transform = "rotate(" + ((player.bigFreeze/3155760000*(360/10)) + 180)%360 + "deg)"}
    document.querySelector(".eonmillennia").style.transform = "rotate(" + ((player.bigFreeze/31557600000*(360/1000000)) + 180)%360 + "deg)"

    document.querySelector(".secDisp").textContent = Math.floor(player.time%60)
    document.querySelector(".minDisp").textContent = Math.floor(player.time/60%60)
    document.querySelector(".houDisp").textContent = Math.floor(player.time/3600%24)
    document.querySelector(".dayDisp").textContent = Math.floor(player.time/86400%7)
    document.querySelector(".weeDisp").textContent = Math.floor(player.time/604800%5)
    document.querySelector(".monDisp").textContent = Math.floor(player.time/2629800%12)
    document.querySelector(".yeaDisp").textContent = Math.floor(player.time/31557600%10)
    document.querySelector(".decDisp").textContent = Math.floor(player.time/315576000%10)
    document.querySelector(".cenDisp").textContent = Math.floor(player.time/3155760000%10)
    document.querySelector(".milDisp").textContent = Math.floor(player.time/31557600000)
    document.querySelector(".eonDisp").textContent = player.bigFreeze

    document.querySelector(".eonsecDisp").textContent = Math.floor(player.bigFreeze%60)
    document.querySelector(".eonminDisp").textContent = Math.floor(player.bigFreeze/60%60)
    document.querySelector(".eonhouDisp").textContent = Math.floor(player.bigFreeze/3600%24)
    document.querySelector(".eondayDisp").textContent = Math.floor(player.bigFreeze/86400%7)
    document.querySelector(".eonweeDisp").textContent = Math.floor(player.bigFreeze/604800%5)
    document.querySelector(".eonmonDisp").textContent = Math.floor(player.bigFreeze/2629800%12)
    document.querySelector(".eonyeaDisp").textContent = Math.floor(player.bigFreeze/31557600%10)
    document.querySelector(".eondecDisp").textContent = Math.floor(player.bigFreeze/315576000%10)
    document.querySelector(".eoncenDisp").textContent = Math.floor(player.bigFreeze/3155760000%10)
    document.querySelector(".eonmilDisp").textContent = Math.floor(player.bigFreeze/31557600000)
    document.querySelector(".eoneonDisp").textContent = 0//player.bigFreeze
    if (player.speed < 1000){
        document.querySelector(".timeDisp").textContent = Math.floor((player.speed-1)*10)/10
    } else {
        document.querySelector(".timeDisp").textContent = player.speed.toExponential(2).replace("+", "")
    }
}

let gameloop = setInterval(function(){
    player.cogs[6].count += (player.cogs[7].count*player.cogs[7].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[5].count += (player.cogs[6].count*player.cogs[6].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[4].count += (player.cogs[5].count*player.cogs[5].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[3].count += (player.cogs[4].count*player.cogs[4].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[2].count += (player.cogs[3].count*player.cogs[3].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[1].count += (player.cogs[2].count*player.cogs[2].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.cogs[0].count += (player.cogs[1].count*player.cogs[1].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.speed += (player.cogs[0].count*player.cogs[0].mult)*((Date.now()-player.tick)/10000)*(1+Math.sqrt(player.bigFreeze))
    player.time += (1+(player.speed-1))*((Date.now()-player.tick)/1000)
    player.tick = Date.now()

    for (let x = 0; x < player.auto.length; x++){
        if (player.auto[7-x].unlocked){
            purchase(7-x)
        }
    }

    if (!player.settings.performance){
        rendertime()
    }

    if (Math.floor(player.time/(31557600000000000/2)) > 1){
        document.body.innerHTML = "<br><h1>After an Eon, the universe has burned out, it is cold.</h1><h1>There is nothing else.</h1><h2>Thank you for playing.</h2><br><button onclick=\"clearInterval(gameloop); localStorage.setItem('gloretime', JSON.stringify({'bigFreeze': player.bigFreeze, 'auto': player.auto, 'upgrade': player.upgrade, 'settings': player.settings})); location.reload()\" style=\"font-family: monospace;\">TURN BACK THE CLOCK</button>"
        player.bigFreeze++
        clearInterval(gameloop); clearInterval(slowloop)

        if (player.settings.autoEon){
            clearInterval(gameloop)
            setTimeout(function(){
                localStorage.setItem('gloretime', JSON.stringify({'bigFreeze': player.bigFreeze, 'auto': player.auto, 'upgrade': player.upgrade, 'settings': player.settings}))
                location.reload()
            }, 10)
        }
    }

    localStorage.setItem("gloretime", JSON.stringify(player))
}, 10)

let slowloop = setInterval(function(){
    for (let x = 0; x < player.cogs.length; x++){
        document.querySelector(".cog" + (x+1) + "count").textContent = Math.floor(player.cogs[x].count) + "x" + Math.floor((player.cogs[x].mult*(1+Math.sqrt(player.bigFreeze)))*100)/100
        if (!player.settings.format){
            document.querySelector(".cog" + (x+1) + "cost").textContent = timeify(player.cogs[x].cost)
        } else {
            document.querySelector(".cog" + (x+1) + "cost").textContent = timeify_old(player.cogs[x].cost)
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