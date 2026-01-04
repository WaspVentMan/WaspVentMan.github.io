const achievements = [
    {
        "name": "Poker Time",
        "description": `<div style="width: max-content; display: flex; margin: auto;"><p style="width: max-content; margin: 0px;">Get</p><div style="width: max-content; margin-top: 5px; margin-left: 6px;">${textIcons.tboiCoin}</div><div style="width: max-content; margin-top: 5px;">${renderString("100", "none", "isaacA")}</div></div>`
    },
    {
        "name": "Big Bets",
        "description": `<div style="width: max-content; display: flex; margin: auto;"><p style="width: max-content; margin: 0px;">Get</p><div style="width: max-content; margin-top: 2px; margin-left: 6px;">${textIcons.nsmbCoin}</div>${renderString("999999", "none", "nsmbPissSmall")}</div>`
    },
    {
        "name": "Never Again",
        "description": "Unlock all TBOI autos"
    },
    {
        "name": "I <3 Pills",
        "description": `<div style="width: max-content; display: flex; margin: auto;">Win the maximum amount (<div style="width: max-content; display: flex; margin: auto;"><div style="width: max-content; margin-top: 5px; margin-left: 1px;">${textIcons.tboiCoin}</div><div style="width: max-content; margin-top: 5px;">${renderString("100", "none", "isaacA")}</div></div>` + ") from</div>the pill in the TBOI claw machine"
    },
    {
        "name": "King of Junk",
        "description": "Win a game of Picture Poker with a junk hand"
    },
    {
        "name": "Keep Gambling",
        "description": `<div style="width: max-content; display: flex; margin: auto;">Win the maximum amount (<div style="width: max-content; margin-top: 3px;">${textIcons.nsmbCoin}</div><div style="width: max-content; margin-top: 3px;">${renderString("15999984", "none", "nsmbPissSmall")}</div>)</div>from Picture Poker`
    }
]

for (let x = 0; x < achievements.length; x++){
    document.querySelector(".achievements").innerHTML += `<h3>${achievements[x].name}</h3><p>${achievements[x].description}</p><br>`
}