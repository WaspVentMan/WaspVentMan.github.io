function gametime(){
    const daylight = document.querySelector(".light")
    let time = Date.now()

    let day = 0

    while (time > 3600000){
        time -= 3600000
        day ++
    }

    let hour = 24
    let min = 60
    let quart = 60
    let month = Math.round(day/24)
    let year = 1970

    while (hour*150000 > time){
        hour--
    }

    while ((hour*150000) + (min*2500) > time){
        min--
    }

    while ((hour*150000) + (quart*37500) > time){
        quart--
    }

    while (month > 12){
        year++
        month -= 12
    }

    let colour = [[255, 255, 0, 0.3], [255, 0, 0, 0.3]]

    // 1 Day = 1 Hour

    // 1H IGT = 150000ms
    // 15M IGT = 37500ms

    // all fades start 15 minutes before the transition (game time)
    // 08:00PM - 05:45AM | Night
    // 06:00AM - 06:45AM | Sunset/rise
    // 07:00AM - 06:45PM | Day
    // 07:00PM - 07:45PM | Sunset/rise

    // Sunset/rise
    // linear-gradient(135deg, rgba(255,255,0,0.3) 0%, rgba(255,0,0,0.3) 100%)

    // Night
    // linear-gradient(135deg, rgba(0,0,50,0.5) 0%, rgba(50,0,50,0.5) 100%)

    // Day
    // linear-gradient(135deg, rgba(255,255,0,0) 0%, rgba(255,0,0,0) 100%)

    let mode = "FN"
    let shift = (time - ((hour*150000) + (quart*37500)))/37500

    if (hour < 5 || (quart < 3 && hour == 5)){
        mode = "N"
    } else if (quart >= 3 && hour == 5){
        mode = "FN"
    } else if (hour < 6 || (quart < 3 && hour == 6)){
        mode = "S"
    } else if (quart >= 3 && hour == 6){
        mode = "TD"
    } else if (hour < 18 || (quart < 3 && hour == 18)){
        mode = "D"
    } else if (quart >= 3 && hour == 18){
        mode = "FD"
    } else if (hour < 19 || (quart < 3 && hour == 19)){
        mode = "S"
    } else if (quart >= 3 && hour == 19){
        mode = "TN"
    } else {
        mode = "N"
    }

    if (mode == "FD"){
        colour[0][0] = 255*shift
        colour[0][1] = 255*shift
        colour[0][2] = 0
        colour[0][3] = 0.3*shift

        colour[1][0] = 255*shift
        colour[1][1] = 0
        colour[1][2] = 0
        colour[1][3] = 0.3*shift
    }

    if (mode == "TD"){
        colour[0][0] = 255-(255*shift)
        colour[0][1] = 255-(255*shift)
        colour[0][2] = 0
        colour[0][3] = 0.3-(0.3*shift)

        colour[1][0] = 255-(255*shift)
        colour[1][1] = 0
        colour[1][2] = 0
        colour[1][3] = 0.3-(0.3*shift)
    }

    if (mode == "TN"){
        colour[0][0] = 255-(255*shift)
        colour[0][1] = 255-(255*shift)
        colour[0][2] = 50*shift
        colour[0][3] = 0.3+(0.2*shift)

        colour[1][0] = 255-(205*shift)
        colour[1][1] = 0
        colour[1][2] = 50*shift
        colour[1][3] = 0.3+(0.2*shift)
    }

    if (mode == "FN"){
        colour[0][0] = 255*shift
        colour[0][1] = 255*shift
        colour[0][2] = 50-(50*shift)
        colour[0][3] = 0.5-(0.2*shift)

        colour[1][0] = 50+(205*shift)
        colour[1][1] = 0
        colour[1][2] = 50-(50*shift)
        colour[1][3] = 0.5-(0.2*shift)
    }

    if (mode == "D"){
        colour[0][0] = 0
        colour[0][1] = 0
        colour[0][2] = 0
        colour[0][3] = 0

        colour[1][0] = 0
        colour[1][1] = 0
        colour[1][2] = 0
        colour[1][3] = 0
    }

    if (mode == "S"){
        colour[0][0] = 255
        colour[0][1] = 255
        colour[0][2] = 0
        colour[0][3] = 0.3

        colour[1][0] = 255
        colour[1][1] = 0
        colour[1][2] = 0
        colour[1][3] = 0.3
    }

    if (mode == "N"){
        colour[0][0] = 0
        colour[0][1] = 0
        colour[0][2] = 50
        colour[0][3] = 0.5

        colour[1][0] = 50
        colour[1][1] = 0
        colour[1][2] = 50
        colour[1][3] = 0.5
    }

    daylight.style.background = `linear-gradient(135deg, rgba(${colour[0][0]},${colour[0][1]},${colour[0][2]},${colour[0][3]}) 0%, rgba(${colour[1][0]},${colour[1][1]},${colour[1][2]},${colour[1][3]}) 100%)`
    
    return [hour, min, day, month, year]
}