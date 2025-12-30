let sounds = []
function playSound(sound, vol = 100){
    let a = new Audio(sound)
    a.play()
    try {
        a.volume = vol/100
    } catch {
        a.volume = vol
    }
    sounds.push(a)

    if (sounds.length > 32){
        sounds[0].pause()
        sounds.splice(0, 1)
    }
}

let music = []
function playMusic(sound, vol = 100){
    let a = new Audio(sound)
    a.play()
    try {
        a.volume = vol/100
    } catch {
        a.volume = vol
    }
    music.push(a)

    if (music.length > 16){
        music[0].pause()
        music.splice(0, 1)
    }
}

function clearSound(){
    for (let x = 0; x < deathtimeout.length; x++){
        clearTimeout(deathtimeout[x])
    }
    for (let x = 0; x < sounds.length; x++){
        sounds[x].pause()
    }
    deathtimeout = []
    sounds = []
}

function clearMusic(){
    for (let x = 0; x < deathtimeout.length; x++){
        clearTimeout(deathtimeout[x])
    }
    for (let x = 0; x < music.length; x++){
        music[x].pause()
    }
    deathtimeout = []
    music = []
}