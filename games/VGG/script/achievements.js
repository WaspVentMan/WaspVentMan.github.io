const achievements = [
    {
        "name": "Never Again",
        "img": "neveragain",
        "description": "Unlock all TBOI autos"
    },
    {
        "name": "I <3 Pills",
        "img": "",
        "description": `<div style="width: max-content; display: flex; margin: auto;">Win the maximum amount (<div style="width: max-content; display: flex; margin: auto;"><div style="width: max-content; margin-top: 5px; margin-left: 1px;">${textIcons.tboiCoin}</div><div style="width: max-content; margin-top: 5px;">${renderString("100", "none", "isaacA")}</div></div>` + ") from</div>the pill in the TBOI claw machine"
    },
    {
        "name": "Rigged in your favour and you still lost",
        "img": "truebadluck",
        "description": `Get 3 Eggman symbols in the Sonic 2 Slots`
    },
    {
        "name": "Worse than one, blame Yuji Naka",
        "img": "badluck",
        "description": `Get 3 Jackpot symbols in the Sonic 2 Slots`
    },
    {
        "name": "High Stakes",
        "img": "highstakes",
        "description": `<div style="width: max-content; display: flex; margin: auto;"><p style="width: max-content; margin: 0px;">Bet</p><div style="width: max-content; margin-top: 2px; margin-left: 6px;">${textIcons.nsmbCoin}</div>${renderString("999", "none", "nsmbPissSmall")}<p style="width: max-content; margin: 0px; margin-left: 4px;">on one round of Picture Poker</p></div>`
    },
    {
        "name": "Keep Gambling",
        "img": "keepgambling",
        "description": `<div style="width: max-content; display: flex; margin: auto;">Win the maximum amount (<div style="width: max-content; margin-top: 3px;">${textIcons.nsmbCoin}</div><div style="width: max-content; margin-top: 3px;">${renderString("15984", "none", "nsmbPissSmall")}</div>)</div>from Picture Poker`
    },
    {
        "name": "King of Junk",
        "img": "kingofjunk",
        "description": "Win a game of Picture Poker with a junk hand"
    }
]

for (let x = 0; x < achievements.length; x++){
    document.querySelector(".achievements").innerHTML += `<h3>${achievements[x].name}</h3><img src="img/ach/${achievements[x].img}.png"/><p>${achievements[x].description}</p><br>`
}