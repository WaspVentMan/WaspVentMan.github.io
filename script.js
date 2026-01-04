let spashes = [
                "The website I update once every 4 years!",
                "The home to games of questionable quality!",
                "The home to a game about climbing based off a game about climbing!",
                "The home to a game about a maze with a <s>shitty</s> funny ending!",
                "The home to a confusing game about getting to 100!",
                "The home to a game about pressing a button a few hundred times!",
                "The home to a fishing game that wasn't very good and will never be rereleased on it's own because of how not good it was!",
                "The home to a game that was very good but got so spaghetti inside that I abandoned it!",
                "The home to a digital graveyard!",
                "The home to a gambling game!"
            ]
            document.querySelector(".spashText").innerHTML = spashes[Math.floor(Math.random()*spashes.length)]

            let d = new Date()
            if (d.getMonth() + 1 == 8 && d.getDate() == 9){
                document.querySelector(".spashText").innerHTML = "Happy birthday to me!"
            }

setInterval (()=>{
    let scrollTop = document.querySelector(".peaks87container").getBoundingClientRect().bottom

    document.querySelector(".peaks87towerRender").style.bottom = (((scrollTop/8) - 256)%1024)-1024 + "px"
    document.querySelector(".peaks87logo").style.bottom = ((scrollTop/4)) + "px"
    for (let x = 0; x < 14; x++){
        document.querySelector(".peaks87paralax"+x).style.bottom = (((scrollTop-512)/(32/(x+1)))-256)+192+[0, 30][(x==13)+0] + "px"
    }
}, 1000/60)