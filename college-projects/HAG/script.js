const PHiL = "https://waspventman.co.uk"

const defaultLoc = {"coords": {"latitude": 0, "longitude": 0}}

const bannertext = document.querySelector(".bannertext")
let bannerlist = []

const rainindex = [
    {
        "name": "Hag's Delirium: Phase 1", //, \"Safety Third\"
        "url": "img/HDP1.png"
    },
    {
        "name": "Hag's Delirium: Phase 2", //, \"Squared Twice\"
        "url": "img/HDP2.png"
    },
    {
        "name": "Hag's Delirium: Phase 3", //, \"Infinitely Long Fence\"
        "url": "img/HDP3.png"
    },
    {
        "name": "Hag's Delirium: Phase 4", //, \"Smoke\"
        "url": "img/HDP4.png"
    },
    {
        "name": "Hag's Delirium: Phase 5", //, \"Squared Thrice\"
        "url": "img/HDP5.png"
    },
    {
        "name": "Hag's Delirium: Phase 6", //, \"Quiet Sphere\"
        "url": "img/HDP6.png"
    },
    {
        "name": "Hag's Delirium: Phase 7", //, \"Sheer Danger\"
        "url": "img/HDP7.png"
    }
]

/**
 * Converts Celcius to Farenheit
 * @param {*} C Temp (Celcius)
 * @returns Temp (Farenheit)
 */
function toF(C){
    return rounddp(((C*(9/5)) + 32), 1)
}

/**
 * Rounds numbers (but fancy)
 * @param {*} n Input number
 * @param {*} r How many D.P. to round it to
 * @returns Rounded number
 */
function rounddp(n, r){
    r = 10**r
    return Math.round(n*r)/r
}

/**
 * Converts raw AQI value into DAQI index
 * @param {*} AQI Air Quality Index value
 * @returns [DAQI, BGColour]
 */
function AQIconvert(AQI){
    let convertbounds = [0, 12, 24, 36, 42, 48, 54, 59, 65, 71]
    let backgroundColors = ["#cfc", "#6f6", "#0f0", "#9f0", "#ff0", "#fc0", "#f60", "#f30", "#f00", "#f06"]

    for (let x = 0; x < convertbounds.length; x++){
        if (AQI < convertbounds[x]){
            let aqistr = x + "." + Math.round((AQI-convertbounds[x-1])/(convertbounds[x]-convertbounds[x-1])*100)

            if (aqistr.endsWith(".0")){
                aqistr = aqistr.slice(0, -2)
            }

            return [parseFloat(aqistr), backgroundColors[x]]
        }
    }

    return ["10+", "#f06"]
}

/**
 * This function calls all the APIs and updates all the boxes and health advice
 * @param {*} position {"coords": {"latitude": latitude, "longitude": longitude}}
 */
async function weatherTime(position){
    let lat = position.coords.latitude
    let lng = position.coords.longitude

    const weatherR = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_min,rain_sum`)
    const airQualityR = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm10,pm2_5&forecast_days=7`)

    try{
        const locationR = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=df841ae3cebd4c4d91643bf19e972128&q=${lat},${lng}&pretty=1&no_annotations=1`)
        const location = await locationR.json()

        if (location.rate.remaining < 100){
            document.querySelector(".geoError").textContent += `\nWarning: low usage on location API remaining (${location.rate.remaining} left)`
        }

        let locationstr = `Forecast for `

        if (location.results[0].components.city != undefined){
            console.log(location.results[0].components.city)
            locationstr += location.results[0].components.city + ", "
        } else {
            locationstr = "Forecast for somewhere in "
        }

        if (location.results[0].components.city == location.results[0].components.state){
            locationstr = locationstr.slice(0, -2)
        } else if (location.results[0].components.state != undefined){
            locationstr += location.results[0].components.state
        } else if (location.results[0].components.country != undefined){
            locationstr += location.results[0].components.country
        }

        if (location.results[0].components.city == undefined && location.results[0].components.state == undefined && location.results[0].components.country == undefined){
            locationstr = "Forecast for somwhere..."
        }

        // Madness Combat Easter Egg
        if (locationstr == "Forecast for somewhere in Nevada"){
            locationstr = "SOMEWHERE IN NEVADA"
            document.querySelector(".locTitle").style.fontFamily = "Impact"
            document.querySelector(".locTitle").style.textShadow = "-1px -1px 0 #F00, 1px -1px 0 #F00, -1px 1px 0 #F00, 1px 1px 0 #F00"
        }

        document.querySelector(".locTitle").textContent = locationstr
        document.title = locationstr
    } catch {
        document.querySelector(".geoError").textContent += `, Location API dry, location names will not be shown until tomorrow :(`
    }

    const weather = await weatherR.json()
    const airQuality = await airQualityR.json()

    let avgrainimg = 0

    for (let x = 0; x < 7; x++){
        let adviceFlag = false

        let celcius = [weather.daily.temperature_2m_max[x], weather.daily.temperature_2m_min[x]]

        let AQI = airQuality.hourly.pm2_5[x*24]
        let rain = weather.daily.rain_sum[x]
        let rainimg = 0
        let aqiimg = 0
        let hagrep = "none"

        if (rain != null && rain != undefined){
            rainimg = Math.round((rain/100)*(rainindex.length-1))
        }

        if (AQI != null && AQI != undefined){
            aqiimg = Math.floor((parseFloat(AQIconvert(AQI)[0])/10)*(rainindex.length-1))
        }

        console.log(rainimg)
        console.log(aqiimg)
        if (aqiimg > rainimg){ 
            rainimg = aqiimg
            hagrep = "daqi"
        } else if (rainimg != 0){
            hagrep = "rain"
        }

        if (rainimg > rainindex.length-1){
            rainimg = rainindex.length-1
        }

        avgrainimg += rainimg+1

        const newdate = new Date()
        newdate.setDate(newdate.getDate()+x)

        let HA = document.createElement("h2")
        HA.style.backgroundColor = "black"
        HA.style.color = "white"
        HA.style.margin = "0%"
        HA.textContent = newdate.getDate() + "/" + (newdate.getMonth()+1) + "/" + newdate.getFullYear()
        document.querySelector(".healthAdvice").appendChild(HA)
        bannerlist.push("("+HA.textContent+")")

        document.querySelector(".forecast" + x).textContent = newdate.getDate() + "/" + (newdate.getMonth()+1) + "/" + newdate.getFullYear()

        if (x == 0){
            document.querySelector(".forecast0").textContent += " (today)"
        }

        document.querySelector(".artwork" + x).textContent = rainindex[rainimg].name //"Art: \"" + rainindex[rainimg].name + "\""

        document.querySelector(".forecastbg" + x).style.backgroundImage = "url(" + rainindex[rainimg].url + ")"

        if (celcius[0] != null && celcius[0] != undefined && celcius[1] != null && celcius[1] != undefined){
            if (celcius[1] < 0){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(LOW TEMP " + celcius[1] + "°C) The low temperature is below freezing, wrap up warm."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (celcius[0] > 30){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(HIGH TEMP " + celcius[0] + "°C) The high temperature is very high, try to stay cool."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            }

            if (celcius[1] < 10){
                coldgrad = Math.round(255-(255*((-celcius[1]+10)/30))) + ",255,255"
            } else if (celcius[1] > 10){
                coldgrad = "255," + Math.round(255-(255*((celcius[1]-10)/30))) + "," + Math.round(255-(255*((celcius[1]-10)/30)))
            } else {
                coldgrad = "255,255,255"
            }

            if (celcius[0] < 10){
                hotgrad = Math.round(255-(255*((-celcius[0]+10)/30))) + ",255,255"
            } else if (celcius[0] > 10){
                hotgrad = "255," + Math.round(255-(255*((celcius[0]-10)/30))) + "," + Math.round(255-(255*((celcius[0]-10)/30)))
            } else {
                hotgrad = "255,255,255"
            }

            document.querySelector(".forecasttemp" + x).textContent = rounddp(celcius[1], 1) + "°C " + rounddp(celcius[0], 1) +"°C"
            document.querySelector(".forecasttempbg" + x).style.background = "linear-gradient(180deg, rgba(" + coldgrad + ",1) 45%, rgba(" + hotgrad + ",1) 55%)"
        } else {
            document.querySelector(".forecasttempbg" + x).remove()
            adviceFlag = true
            let HA = document.createElement("p")
            HA.textContent = "Temperature for today is unknown, check back when data is available."
            document.querySelector(".healthAdvice").appendChild(HA)
            bannerlist.push(HA.textContent)
        }

        if (AQI != null && AQI != undefined){
            if (hagrep == "daqi"){
                document.querySelector(".forecastAQI" + x).textContent = "*DAQI: " + AQIconvert(AQI)[0]
            } else {
                document.querySelector(".forecastAQI" + x).textContent = "DAQI: " + AQIconvert(AQI)[0]
            }
            document.querySelector(".forecastAQIbg" + x).style.backgroundColor = AQIconvert(AQI)[1]

            if (AQIconvert(AQI)[0] == "10+"){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, adults with heart problems, and older people, should avoid strenuous physical activity. People with asthma may find they need to use their reliever inhaler more often."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (AQIconvert(AQI)[0] >= 7){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, and adults with heart problems, should reduce strenuous physical exertion, particularly outdoors, and particularly if they experience symptoms. People with asthma may find they need to use their reliever inhaler more often. Older people should also reduce physical exertion."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (AQIconvert(AQI)[0] >= 4){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(DAQI " + AQIconvert(AQI)[0] + ") Adults and children with lung problems, and adults with heart problems, who experience symptoms, should consider reducing strenuous physical activity, particularly outdoors."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } 
        } else {
            document.querySelector(".forecastAQIbg" + x).remove()
            adviceFlag = true
            let HA = document.createElement("p")
            HA.textContent = "DAQI for today is unknown, check back when data is available."
            document.querySelector(".healthAdvice").appendChild(HA)
            bannerlist.push(HA.textContent)
        }

        if (rain != null && rain != undefined){
            if (hagrep == "rain"){
                document.querySelector(".forecastrain" + x).textContent = "*RAIN: " + rounddp(rain, 1) + "%"
            } else {
                document.querySelector(".forecastrain" + x).textContent = "RAIN: " + rounddp(rain, 1) + "%"
            }
            document.querySelector(".forecastrainbg" + x).style.backgroundColor = `rgb(${255-((255/100)*rain)}, 255, 255)`

            if (rain > 75){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(RAIN: " + rounddp(rain, 2) + "%) Lots of rain, be careful not to slip."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (rain > 50){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(RAIN: " + rounddp(rain, 2) + "%) Some rain, be careful not to slip."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            } else if (rain > 25){
                adviceFlag = true
                let HA = document.createElement("p")
                HA.textContent = "(RAIN: " + rounddp(rain, 2) + "%) A little bit of rain, be careful not to slip."
                document.querySelector(".healthAdvice").appendChild(HA)
                bannerlist.push(HA.textContent)
            }
        } else {
            document.querySelector(".forecastrainbg" + x).remove()
            adviceFlag = true
            let HA = document.createElement("p")
            HA.textContent = "Rain for today is unknown, check back when data is available."
            document.querySelector(".healthAdvice").appendChild(HA)
            bannerlist.push(HA.textContent)
        }

        if (!adviceFlag){
            let HA = document.createElement("p")
            HA.textContent = "No health advice needed, continue your day as normal."
            bannerlist.push(HA.textContent)
            document.querySelector(".healthAdvice").appendChild(HA)
        }
    }

    document.querySelector(".artavg").innerHTML = "<a href='#hag'>?</a> Average " + rainindex[Math.round(avgrainimg/7)-1].name
    document.querySelector(".titleimg").style.backgroundImage = "url(" + rainindex[Math.round(avgrainimg/7)-1].url + ")"
    document.querySelector("link[rel~='icon']").href = rainindex[Math.round(avgrainimg/7)-1].url

    setBanner()
}

/**
 * If automatic geolocation is disabled, this function is ran.
 * @param {*} error idk what this is lol
 */
function showError(error) {
    let params = new URL(document.location).searchParams
    let lat = params.get("lat")
    let lng = params.get("lng")

    if (lat != null && lng != null && !isNaN(parseInt(lat)) && !isNaN(parseInt(lng))){
        document.querySelector(".geoError").textContent = `Manual Geolocation enabled (${lat}, ${lng})`
        weatherTime({"coords": {"latitude": lat, "longitude": lng}})
        return
    }

    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.querySelector(".geoError").textContent = "⚠ User denied the request for Geolocation. ⚠"
            break;
        case error.POSITION_UNAVAILABLE:
            document.querySelector(".geoError").textContent = "⚠ Location information is unavailable. ⚠"
            break;
        case error.TIMEOUT:
            document.querySelector(".geoError").textContent = "⚠ The request to get user location timed out. ⚠"
            break;
        case error.UNKNOWN_ERROR:
            document.querySelector(".geoError").textContent = "⚠ An unknown error occurred. ⚠"
            break;
    }

    document.querySelector(".wholeweather").innerHTML = ""
}

/**
 * Updates the marquee at the top of the site with the contents of bannerlist
 */
function setBanner(){
    bannertext.textContent = ""
    for (let x = 0; x < bannerlist.length; x++){
        if (x != 0){bannertext.textContent += " --- "}
        bannertext.textContent += bannerlist[x]
    }
}

/**
 * I don't even know why I made this a function :/
 */
async function updatestats(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(weatherTime, showError)
    } else {
        weatherTime(defaultLoc)
    }
}

updatestats()

let rainbow = Math.round(Math.random()*360)

setInterval(function(){
    document.body.style.backgroundColor = "hsl(" + rainbow + "deg 50% 25%)"
    rainbow += 0.1
}, 10)