const mscPokerSuits = [
    "BC",
    "RD",
    "RH",
    "BS"
]

const mscPokerValues = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2"
]

function mscStartReetipokka(markka){
    let playerMarkka = Math.floor(player.money*0.0428)/100
    console.log(playerMarkka)
    if (playerMarkka < markka){
        return
    }

    player.machines.mscRettipokka.pelit += markka
    player.money -= Math.floor(markka/0.000428)
    playSound("sfx/msc/slot_insert_coin.wav")

    if (player.machines.mscRettipokka.bet == 0){
        player.machines.mscRettipokka.bet = 1
        playSound(`sfx/msc/Pokeri_Bet1.wav`)
    }

    refreshMoneyCount()
    document.querySelector(".mscScreen").style.backgroundImage = `url(img/msc/Pokeri-Screen-Bet${player.machines.mscRettipokka.bet}-Fin.png)`

    document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
}

function mscJako(){
    player.machines.mscRettipokka.pelit += player.machines.mscRettipokka.voitot
    player.machines.mscRettipokka.voitot = 0

    document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
    document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")

    playSound("sfx/msc/slot_button.wav")

    if (player.machines.mscRettipokka.played){
        return
    }

    if (player.machines.mscRettipokka.bet <= player.machines.mscRettipokka.pelit && player.machines.mscRettipokka.pelit != 0 && player.machines.mscRettipokka.hand.length == 0){
        player.machines.mscRettipokka.hand = []
        player.machines.mscRettipokka.dealerHand = []
        player.machines.mscRettipokka.discard = [true, true, true, true, true]

        player.machines.mscRettipokka.pelit -= player.machines.mscRettipokka.bet

        document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
        document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")

        document.querySelector(".mscHand").innerHTML = ""
        for (let x = 0; x < 5; x++){
            let suit = randomListItem(mscPokerSuits)
            let value = randomListItem(mscPokerValues)+suit[0]

            while (player.machines.mscRettipokka.dealerHand.indexOf(value+suit[1]) != -1){
                suit = randomListItem(mscPokerSuits)
                value = randomListItem(mscPokerValues)+suit[0]
            }


            player.machines.mscRettipokka.hand.push([value, suit])
            player.machines.mscRettipokka.dealerHand.push(value+suit[1])

            setTimeout(()=>{
                playSound("sfx/msc/Pokeri_Card01_LOFI.wav")
                document.querySelector(".mscHand").innerHTML +=
                    `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Card.png);">`+
                        `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/suit/${player.machines.mscRettipokka.hand[x][1][1]}.png);">`+
                            `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/value/${player.machines.mscRettipokka.hand[x][0]}.png);"></div>`+
                        `</div>`+
                    `</div>`
            }, x*300)
        }
    } else if (player.machines.mscRettipokka.hand.length == 5){
        player.machines.mscRettipokka.played = true
        document.querySelector(".mscHand").innerHTML = ""
        let discard = 0
        for (let x = 0; x < 5; x++){
            let suit = randomListItem(mscPokerSuits)
            let value = randomListItem(mscPokerValues)+suit[0]

            if (player.machines.mscRettipokka.discard[x]){
                discard++
                while (player.machines.mscRettipokka.dealerHand.indexOf(value+suit[1]) != -1){
                    suit = randomListItem(mscPokerSuits)
                    value = randomListItem(mscPokerValues)+suit[0]
                }

                player.machines.mscRettipokka.dealerHand = []
                    
                player.machines.mscRettipokka.hand[x] = [value, suit]
                player.machines.mscRettipokka.dealerHand.push(value+suit[1])

                setTimeout(()=>{
                    document.querySelector(".mscHand").innerHTML = ""
                    playSound("sfx/msc/Pokeri_Card01_LOFI.wav")
                    for (let y = 0; y < 5; y++){
                        if (y > x && player.machines.mscRettipokka.discard[y]){
                            document.querySelector(".mscHand").innerHTML +=
                                `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Cardback.png);"></div>`
                        } else {
                            document.querySelector(".mscHand").innerHTML +=
                                `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Card.png);">`+
                                    `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/suit/${player.machines.mscRettipokka.hand[y][1][1]}.png);">`+
                                        `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/value/${player.machines.mscRettipokka.hand[y][0]}.png);"></div>`+
                                    `</div>`+
                                `</div>`
                        }
                    }
                }, discard*250)

                document.querySelector(".mscHand").innerHTML +=
                    `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Cardback.png);"></div>`
            } else {
                document.querySelector(".mscHand").innerHTML +=
                    `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Card.png);">`+
                        `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/suit/${player.machines.mscRettipokka.hand[x][1][1]}.png);">`+
                            `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/value/${player.machines.mscRettipokka.hand[x][0]}.png);"></div>`+
                        `</div>`+
                    `</div>`
            }
        }

        let pokerValues = {}
        let pokerSuits = {}
        for (let x = 0; x < mscPokerValues.length; x++){
            let pokerValue = player.machines.mscRettipokka.hand.filter(y => y[0].slice(0,-1)==mscPokerValues[x]).length
            if (pokerValue != 0){
                pokerValues[mscPokerValues[x]] = pokerValue
            }
        }

        for (let x = 0; x < 4; x++){
            let pokerSuit = player.machines.mscRettipokka.hand.filter(y => y[1]==mscPokerSuits[x]).length
            if (pokerSuit != 0){
                pokerSuits[mscPokerSuits[x]] = pokerSuit
            }
        }

        let items = Object.keys(pokerValues).map(function(key) {
            return [key, pokerValues[key]];
        })

        items.sort(function(first, second) {
            return second[1] - first[1];
        })

        pokerValues = items

        items = Object.keys(pokerSuits).map(function(key) {
            return [key, pokerSuits[key]];
        })

        items.sort(function(first, second) {
            return second[1] - first[1];
        })

        pokerSuits = items

        let score = 0
        let jatkat_assat = ["A","K","Q","J"]

        let straight = false
        let royal = false
        let streak = 0
        for (let x = 0; x < mscPokerValues.length+1; x++){
            let good = false
            for (let y = 0; y < 5; y++){
                if (player.machines.mscRettipokka.hand[y][0].startsWith(mscPokerValues[x%mscPokerValues.length])){
                    streak++
                    good = true

                    if (streak >= 5){
                        straight = true
                        if (x < 5){
                            royal = true
                        }
                    }
                    break
                }
            }

            if (!good){
                streak = 0
            }
        }

        if (royal && pokerSuits[0][1] == 5){
            score = 50
            unlockMedal(88016)
            NGIO.postScore(15518, 1, function(){})
        } else if (straight && pokerSuits[0][1] == 5){
            score = 30
            NGIO.postScore(15525, 1, function(){})
        } else if (pokerValues[0][1] == 4){
            score = 15
            NGIO.postScore(15526, 1, function(){})
        } else if (pokerValues[0][1] == 3 && pokerValues[1][1] == 2){
            score = 10
            NGIO.postScore(15527, 1, function(){})
        } else if (pokerSuits[0][1] == 5){
            score = 7
            NGIO.postScore(15528, 1, function(){})
        } else if (straight){
            score = 5
            NGIO.postScore(15529, 1, function(){})
        } else if (pokerValues[0][1] == 3){
            score = 3
            NGIO.postScore(15530, 1, function(){})
        } else if (pokerValues[0][1] == 2){
            if (pokerValues[1][1] == 2){
                score = 2
                NGIO.postScore(15531, 1, function(){})
            } else if (jatkat_assat.includes(pokerValues[0][0])){
                score = 1
                NGIO.postScore(15532, 1, function(){})
            }
        }

        if (score != 0){
            unlockMedal(88015)
        }

        setTimeout(()=>{
            if (score != 0){
                playSound("sfx/msc/Pokeri_Win_LOFI.wav")
                player.machines.mscRettipokka.voitot = player.machines.mscRettipokka.bet*score
            }

            if (player.machines.mscRettipokka.pelit > 0){
                player.machines.mscRettipokka.bet = 1
            }
            player.machines.mscRettipokka.hand = []
            player.machines.mscRettipokka.dealerHand = []
            player.machines.mscRettipokka.played = false
            player.machines.mscRettipokka.discard = [true, true, true, true, true]

            document.querySelector(".mscScreen").style.backgroundImage = `url(img/msc/Pokeri-Screen-Bet${player.machines.mscRettipokka.bet}-Fin.png)`
            document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
            document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")

            for (let x = 0; x < 5; x++){
                document.querySelector(".mscLukitus"+x).style.backgroundImage = ""
            }
        }, 1500)
    }
}

function mscLukitus(card){
    playSound("sfx/msc/slot_button.wav")

    if (player.machines.mscRettipokka.bet == 0){
        return
    }

    player.machines.mscRettipokka.discard[card] = !player.machines.mscRettipokka.discard[card]

    if (!player.machines.mscRettipokka.discard[card]){
        document.querySelector(".mscLukitus"+card).style.backgroundImage = "url(img/msc/button/lukitusLit.png)"
    } else {
        document.querySelector(".mscLukitus"+card).style.backgroundImage = ""
    }
}

function mscVoitonMaksu(){
    playSound("sfx/msc/slot_button.wav")

    if (player.machines.mscRettipokka.pelit <= player.machines.mscRettipokka.bet){
        return
    }

    player.money += Math.floor((player.machines.mscRettipokka.pelit+player.machines.mscRettipokka.voitot)/0.000428)

    player.machines.mscRettipokka.pelit = 0
    player.machines.mscRettipokka.voitot = 0

    playSound("sfx/msc/slot_cash_out.wav")
    refreshMoneyCount()

    document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
    document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")

    if (player.machines.mscRettipokka.bet == 0){
        document.querySelector(".mscReetipokkaHeld").innerHTML = renderString("", "", "mscReetipokkaBlue", "left")
        document.querySelector(".mscReetipokkaWon").innerHTML = renderString("", "", "mscReetipokkaBlue", "left")
        document.querySelector(".mscScreen").style.backgroundImage = `url(img/msc/Pokeri-TitleScreen-FinB.png)`
        document.querySelector(".mscHand").innerHTML = ""
    }
}

function mscPanos(){
    player.machines.mscRettipokka.pelit += player.machines.mscRettipokka.voitot
    player.machines.mscRettipokka.voitot = 0

    document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
    document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")

    playSound("sfx/msc/slot_button.wav")

    if (player.machines.mscRettipokka.bet < 5 && player.machines.mscRettipokka.pelit >= player.machines.mscRettipokka.bet+1 && player.machines.mscRettipokka.hand.length == 0){
        player.machines.mscRettipokka.bet++
        playSound(`sfx/msc/Pokeri_Bet${player.machines.mscRettipokka.bet}.wav`)
        document.querySelector(".mscScreen").style.backgroundImage = `url(img/msc/Pokeri-Screen-Bet${player.machines.mscRettipokka.bet}-Fin.png)`
    }
}

if (player.machines.mscRettipokka.hand.length != 0){
    for (let x = 0; x < 5; x++){
        document.querySelector(".mscHand").innerHTML +=
            `<div style="width: 32px; height: 48px; margin: 2px; background-image: url(img/msc/card/Card.png);">`+
                `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/suit/${player.machines.mscRettipokka.hand[x][1][1]}.png);">`+
                    `<div style="width: 32px; height: 48px; background-image: url(img/msc/card/value/${player.machines.mscRettipokka.hand[x][0]}.png);"></div>`+
                `</div>`+
            `</div>`
    }
    
    document.querySelector(".mscReetipokkaHeld").innerHTML = renderString(player.machines.mscRettipokka.pelit+"", "", "mscReetipokkaBlue", "left")
    document.querySelector(".mscReetipokkaWon").innerHTML = renderString(player.machines.mscRettipokka.voitot+"", "", "mscReetipokkaBlue", "left")
    document.querySelector(".mscScreen").style.backgroundImage = `url(img/msc/Pokeri-Screen-Bet${player.machines.mscRettipokka.bet}-Fin.png)`
}