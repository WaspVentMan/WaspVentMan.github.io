// all settings for the site will be saved in this dict

let settings = JSON.parse(localStorage.getItem("settings"))
let user = JSON.parse(localStorage.getItem("user"))

// default user details
const trueuser = {
    "username": null,
    "password": null
}

// default settings
const truesettings = {
    "dark": false,
    "dyslexic": false,
    "marquee": {
        "active": true,
        "tick": 50,
        "chance": 0.9,
        "length": 40,
        "lengthOffset": 20,
        "bob": 0.5,
        "bobOffset": 1
    },
    "whimsy": false
}

// used to cache data recieved from login
let logincache = null

// sets settings to default if saved settings are null
if (settings == null) {
    settings = truesettings
} 

// sets user settings to default if saved settings are null, else tries to login
if (user == null){
    user = trueuser
} else if (user.username != null && user.password != null){
    login()
}

/**
 * sends a request to the server to log user in
 * @returns account data
 */
async function login(){
    if (user.username == null || user.password == null){
        return false
    }

    await fetch(window.location.href + "/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (value) => {
        value = await value.json()
        if (!value){
            user = {'username': null, 'password': null}; localStorage.setItem('user', JSON.stringify(user))
            window.alert("Your login credentials were invalid and you were unable to be logged in, please log in again.")
        } else {
            if (value[0] == false){
                user = {'username': null, 'password': null}; localStorage.setItem('user', JSON.stringify(user))
                window.alert("Your password was incorrect!")
                return
            }
            
            logincache = value
            document.querySelector(".points").textContent = (logincache.points + "pts").replace("+", "")
        }
    })
}

/**
 * sends a request to the server to log user in
 * @returns account data
 */
async function signup(){
    let response = await fetch(window.location.href + "/signup", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}

/**
 * purchases tickets
 */
async function purchase(count, date, hotel){
    for (let x = 0; x < 2; x++){
        count[x] = parseInt(count[x])
    }

    date = date.split("-", 3)
    for (let x = 0; x < 3; x++){
        date[x] = parseInt(date[x])
    }

    if (count[0] < 1 || date.length != 3 || typeof hotel != "boolean"){
        return
    }

    let purchase = {
        "count": count,
        "date": date,
        "hotel": hotel,
        "paid": false
    }

    let response = await fetch(window.location.href + "/purchase", {
        method: "POST",
        body: JSON.stringify([user, purchase]),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    response = await response.json()

    if (response[0]){
        document.querySelector(".purchaseError").style.color = "inherit"
    } else {
        document.querySelector(".purchaseError").style.color = "red"
    }
    document.querySelector(".purchaseError").textContent = response[1]
}

/**
 * Toggles the dark setting and changes the background and font colour accordingly
 */
function darkToggle(){
    settings.dark = !settings.dark

    if (settings.dark){
        document.querySelector(".lghtdark-icon").src = "static/img/dark.png"
        document.body.style.backgroundColor = 'black'
        document.body.style.color = 'white'
        try {
            document.querySelector(".footer-bar").style.outlineColor = "white"
            document.querySelector(".settings-miniwindow").style.outlineColor = "white"
            document.querySelector(".settings-miniwindow").style.backgroundColor = "black"
        } catch {}
    } else {
        document.querySelector(".lghtdark-icon").src = "static/img/light.png"
        document.body.style.backgroundColor = 'white'
        document.body.style.color = 'black'
        try {
            document.querySelector(".footer-bar").style.outlineColor = "black"
            document.querySelector(".settings-miniwindow").style.outlineColor = "black"
            document.querySelector(".settings-miniwindow").style.backgroundColor = "white"
        } catch {}
    }
}

/**
 * Toggles the dyslexic setting and changes the icon and font accordingly
 */
function dyslexicToggle(){
    settings.dyslexic = !settings.dyslexic

    if (settings.dyslexic){
        document.querySelector(".dyslexic-icon").src = "static/img/dyslexia1.png"
        document.body.style.fontFamily = 'cursive'
    } else {
        document.querySelector(".dyslexic-icon").src = "static/img/dyslexia0.png"
        document.body.style.fontFamily = ''
    }
}

/**
 * Toggles the marquee setting
 */
function animalToggle(){
    settings.marquee.active = !settings.marquee.active
}

/**
 * Minisettings toggle
 */
function minisettingsToggle(){
    let settmini = document.querySelector(".settings-miniwindow")

    if (settmini.style.height == "400px"){
        settmini.style.height = "0px"
        settmini.style.width = "0px"
        settmini.style.marginLeft = "0px"
        settmini.style.borderRadius = "0px"
    } else {
        settmini.style.height = "400px"
        settmini.style.width = "400px"
        settmini.style.marginLeft = "-400px"
        settmini.style.borderRadius = "0% 0% 0% 100px"
    }
}

/**
 * Updates the total cost in the tickets page
 */
function updateCost(){
    let cost = 0
    cost += document.querySelector('.ticketPurchaseA').value*5.99

    if (document.querySelector('.ticketPurchaseC').value >= 15){
        // bulk discount
        cost += document.querySelector('.ticketPurchaseC').value*1.99
    } else {
        cost += document.querySelector('.ticketPurchaseC').value*2.99
    }

    cost += (document.querySelector('.ticketPurchaseH').checked*99.99)*Math.ceil((parseInt(document.querySelector('.ticketPurchaseA').value)+parseInt(document.querySelector('.ticketPurchaseC').value))/4)

    document.querySelector(".cost").textContent = "£" + Math.round(cost*100)/100
}

/**
 * Spawns and destroys animals in the marquee
 */
function animalLoop(){
    // Stops spawn if setting is disabled
    if (!settings.marquee.active){}
    
    else if (Math.random() >= settings.marquee.chance){
        // seed controls all animation properties of an animal, with the exception of the type
        // could change to make animal depend on seed, but that's a feature to implement if I get time
        let seed = Math.random()
        let newAnimalContainer = document.createElement("div")
        let newAnimal = document.createElement("div")

        // Applies all style, class and animation settings to animals
        newAnimal.textContent = ["🐒", "🦍", "🐅", "🐆", "🐎", "🦌", "🦏", "🦛", "🐂", "🐃", "🐄", "🐖", "🐏", "🐑",
        "🐐", "🐪", "🐫", "🦙", "🦘", "🦨", "🦡", "🐘", "🐢", "🦩", "🦚", "🐦", "🐧", "🐤", "🐛", "🦗", "🐜"][Math.round(Math.random()*32)]
        newAnimalContainer.className = "animal aminal" + (Date.now() + "" + Math.round(seed*1e10))

        let animationlength = settings.marquee.length + (seed*settings.marquee.lengthOffset)
        
        newAnimalContainer.style.animationName = "animal-scroll"
        newAnimalContainer.style.animationDuration = animationlength + "s"
        newAnimalContainer.style.animationTimingFunction = "linear"
        newAnimalContainer.style.position = "absolute"
        newAnimalContainer.style.width = "fit-content"
        newAnimalContainer.style.userSelect = "none"
        newAnimalContainer.style.pointerEvents = "none"

        newAnimalContainer.style.zIndex = "-1"
        
        newAnimal.style.animationName = "animal-bob"
        newAnimal.style.animationDuration = settings.marquee.bob + (seed*settings.marquee.bobOffset) + "s"
        newAnimal.style.animationTimingFunction = "linear"
        newAnimal.style.animationIterationCount = "infinite"
        newAnimal.style.width = "fit-content"
        
        if (Math.random() >= 0.5){
            newAnimalContainer.style.animationName = "animal-scroll-reverse"
            newAnimal.style.transform = "scale(-1, 1)"
        }

        // Puts animal into action
        newAnimalContainer.appendChild(newAnimal)
        document.querySelector(".animal-marquee").appendChild(newAnimalContainer)

        // Animals are "put down" after their animation is over
        setTimeout(function(){
            try {
                document.querySelector("." + newAnimalContainer.className.split(" ")[1]).remove()
            } catch {
                console.log("Oops, already gone 😅")
            }
        }, animationlength*1e3)
    }
}

// Loop that spawns animal marquee entities
// tweak values if not very performant
// TODO: add off button in settings (DONE)
// TODO: allow user to tweak spawn rates (DONE)
// pls just work :(
var aminalMarquee = setInterval(animalLoop, settings.marquee.tick)

if (location.pathname == "/settings/"){
    document.querySelector(".settings-miniwindow").remove()
    document.querySelector(".settings-icon").remove()
}

if (location.pathname == "/"){
    document.querySelector(".home-icon").remove()
}

if (location.pathname == "/tickets/"){
    document.querySelector(".ticket-icon").remove()
}

document.querySelector(".dtc").checked = settings.dark
document.querySelector(".dfc").checked = settings.dyslexic
document.querySelector(".amc").checked = settings.marquee.active
document.querySelector(".stsr").value = settings.marquee.tick
document.querySelector(".scr").value = settings.marquee.chance*100
//document.querySelector(".powerslider1").value = settings.marquee.length
//document.querySelector(".powerslider2").value = settings.marquee.lengthOffset
document.querySelector(".powerslider3").value = settings.marquee.bob*10
document.querySelector(".powerslider4").value = settings.marquee.bobOffset*10
document.querySelector(".wc").checked = settings.whimsy

setInterval(function(){
    document.querySelector(".scDisp").textContent = 100-Math.round(settings.marquee.chance*100) + "%"
    document.querySelector(".stsDisp").textContent = settings.marquee.tick + "ms"

    //document.querySelector(".dDisp").textContent = settings.marquee.length + "s"
    //document.querySelector(".dvDisp").textContent = settings.marquee.lengthOffset + "s"
    document.querySelector(".bDisp").textContent = settings.marquee.bob + "s"
    document.querySelector(".bvDisp").textContent = settings.marquee.bobOffset + "s"

    localStorage.setItem("settings", JSON.stringify(settings))
}, 50)