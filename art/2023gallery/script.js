const frame = document.querySelector(".frame")
const title = document.querySelector(".title")
const dbutt = document.querySelector(".deltabutton")
const favicon = document.querySelector(".favicon")

let loomindex = 0
let looming = [
    new Audio('mp3/loom1.mp3'),
    new Audio('mp3/loom2.mp3'),
    new Audio('mp3/loom3.mp3'),
    new Audio('mp3/loom4.mp3'),
    new Audio('mp3/loom5.mp3'),
    new Audio('mp3/loom6.mp3'),
    new Audio('mp3/loom7.mp3'),
    new Audio('mp3/loom8.mp3')
]

let splashes = [
    "MADE WIH HATE, NOT LOVE",
    "PORGAMING :)",
    "IMAGE UNLOADING?",
    "WASPVENTMAN.CO.UK",
    "UNINSTALLING ANTIMATTER DIMENSIONS",
    "404",
    "PIPEBOMB + MAILBOX = ?",
    "OOPS, ALL SPLASHES",
    "WHAT IS THIS 'JS' YOU SPEAK OF?",
    "HELP! I LOST THE SPLASH TEXT!",
    "TEST? TEST?! TEEEEEEEST!",
    "HOLY CRAP IT'S THE GUY FROM FORTNITE!",
    "BEST VALUE!",
    "LSSB IS DEAD?!",
    "O100 IS DEAD?!",
    "WDBM IS DEAD?!",
    "SAT IS DONE?!",
    "ALL THE ART CAN BE FOUND ON MY NEWGROUNDS PAGE!",
    "WASPVENTMAN.NEWGROUNDS.COM"
]

let titles = {
    "0"  : "Celestial Blanket",
    "1"  : "A Window Into A Void",
    "2"  : "Chess Board At The End Of The World",
    "3"  : "Please Do Not Tap On The Glass",
    "4"  : "Quarters Of A Downward Spiral",
    "5"  : "Kaleidoscope Telescope",
    "6"  : "If You Cut Down A Tree And Look At The Rings, You Can See How Old It Is!",
    "7"  : "That Block Game",
    "8"  : "Deeper, Yet Deeper",
    "9"  : "Something Has Gone Very, Very Wrong...",
    "10" : "Some Things Never Change",
    "11" : "The Forgotten Well",
    "12" : "The Land At The End Of Tomorrow",
    "13" : "The First Summoning",
    "14" : "In Memoriam Of Lost Media",
    "15" : "Depth Charge",
    "16" : "Two Sides Of The Same Coin",
    "17" : "Cover Yourself In Oil And Try Smoke A Cigarette",
    "18" : "Fractal Delusions Are Set Upon Thee By Signs Sent From A False Prophet",
    "19" : "Neglecting The Third Dimension For Too Long",
    "21" : "Blooming, Perhaps For The Last Time",
    "22" : "Repetition Gets Annoying After A While",
    "23" : "If Something Travelled Faster Than The Speed Of Light, Would You See It Coming?",
    "24" : "Sleep Deprivation Deluxe",
    "25" : "SCOUTED!",
    "26" : "Budget Static",
    "27" : "Finger Painting",
    "28" : "Sparkling Tiles",
    "29" : "Strange Plane",
    "30" : "Spectating The Extinction Of The Earth",
    "31" : "Watch Planets Collide Amidst An Infinite Void",
    "32" : "Demantoid Draughts",
    "33" : "CPU Overheat",
    "34" : "Digital Vines",
    "35" : "Influenced Delusion",
    "36" : "Pseudoscience",
    "37" : "Oil Slick Cathode-Ray Tube",
    "38" : "Monolith",
    "39a": "Hag's Delerium: Phase 1",
    "39b": "Hag's Delerium: Phase 2",
    "39c": "Hag's Delerium: Phase 3",
    "39d": "Hag's Delerium: Phase 4",
    "39e": "Hag's Delerium: Phase 5",
    "39f": "Hag's Delerium: Phase 6",
    "39g": "Hag's Delerium: Phase 7",
    "40" : "Viewers Like You.",
    "41" : "Terminal Velocity",
    "42" : "Unsaved Changes",
    "43" : "ReCode"
}

let works = 44
let deltaindex = "abcdefg"

let delta = 39

let cursor = 0
let cursordelta = 0

function change(pm, pmdelta = 0){
    if (cursor+pm < 0){
        cursor = 44
    } else if (cursor+pm >= works){
        cursor = -1
    }

    if (cursordelta+pmdelta < 0 || cursordelta+pmdelta >= deltaindex.length){
        return
    }

    if (pm != 0){
        cursordelta = 0
    }

    cursor += pm
    if (cursor == 20){
        cursor += pm
    }

    cursordelta += pmdelta

    let img = cursor

    if (cursor == delta){
        dbutt.style.opacity = "100%"
        img += deltaindex[cursordelta]
    } else {
        dbutt.style.opacity = "0%"
    }

    let blist = document.querySelectorAll("button")

    for (let x = 0; x < blist.length; x++){blist[x].setAttribute("disabled", "true")}

    //splash.textContent = splashes[Math.round(Math.random()*(splashes.length-1))].toUpperCase()

    document.title = "WVM2023: " + titles[img]

    frame.style.animation = "ash 2s ease-out"; title.style.animation = "ash 2s ease-out"

    looming[loomindex].play()
    loomindex += 1

    if (loomindex > looming.length-1){
        loomindex = 0
    }

    frame.src = "img/" + img + ".png"; title.textContent = titles[img]; favicon.href = "img/" + img + ".png"
    setTimeout(function(){frame.style.animation = ""; title.style.animation = ""; for (let x = 0; x < blist.length; x++){blist[x].removeAttribute("disabled")}}, 2000)
}

