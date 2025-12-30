setInterval (()=>{
    let scrollTop = document.querySelector(".peaks87container").getBoundingClientRect().bottom

    document.querySelector(".peaks87towerRender").style.bottom = (((scrollTop/8) - 256)%1024)-1024 + "px"
    document.querySelector(".peaks87logo").style.bottom = ((scrollTop/4)) + "px"
    for (let x = 0; x < 14; x++){
        document.querySelector(".peaks87paralax"+x).style.bottom = (((scrollTop-512)/(32/(x+1)))-256)+192+[0, 30][(x==13)+0] + "px"
    }
}, 1000/144)