const nsmbPokerCards = [
    "star",
    "mario",
    "luigi",
    "flower",
    "mushroom",
    "cloud"
]

function nsmbStartPicturePoker(){
    player.machines.nsmbPoker.played = true
    document.querySelector(".nsmbPlayerCards").innerHTML = ""
    document.querySelector(".nsmbDealerCards").innerHTML = ""
    if (player.machines.nsmbPoker.hand.length == 0){
        if (player.machines.nsmbPoker.bet <= 0 || player.machines.nsmbPoker.bet == null || isNaN(player.machines.nsmbPoker.bet) || player.money < player.machines.nsmbPoker.bet*100){
            playSound("sfx/nsmb/NCS_SE_MGM_C_DOWN.wav")
            return
        }
        document.querySelector(".nsmbStartPoker").style.height = "0px"
        player.machines.nsmbPoker.dealerHand = []
        player.money -= player.machines.nsmbPoker.bet*100
        refreshMoneyCount()
        nsmbRenderHierarchy([], [])
        for (let x = 0; x < 5; x++){
            player.machines.nsmbPoker.hand.push(randomListItem(nsmbPokerCards))
            player.machines.nsmbPoker.dealerHand.push(randomListItem(nsmbPokerCards))
        }
    }

    if (player.machines.nsmbPoker.bet == 999){
        unlockMedal(88017)
    }

    for (let x = 0; x < 5; x++){
        document.querySelector(".nsmbPlayerCards").innerHTML += (textIcons.nsmbCard.start + `nsmbCardSelect(${x})" class="nsmbPlayerCard${x}` + textIcons.nsmbCard.mid + "back" + textIcons.nsmbCard.end)
        document.querySelector(".nsmbDealerCards").innerHTML += (textIcons.nsmbCard.start + `" class="nsmbDealerCard${x}` + textIcons.nsmbCard.mid + "back" + textIcons.nsmbCard.end)
        document.querySelector(".nsmbDealerCard" + x).style.marginTop = "-72px"

        setTimeout(()=>{
            document.querySelector(".nsmbDealerCard" + x).style.transition = "all 0.25s linear"
            document.querySelector(".nsmbPlayerCard" + x).style.transition = "all 0.25s linear"
            document.querySelector(".nsmbPlayerCard" + x).style.marginTop = "0px"
            document.querySelector(".nsmbDealerCard" + x).style.marginTop = "0px"

            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.transition = "all 0.05s linear"
                playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ONLY.wav")
                setTimeout(()=>{
                    document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
                }, 50)
                setTimeout(()=>{
                    document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
                }, 100)
                setTimeout(()=>{
                    document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + "Flip.png)"
                }, 150)
                setTimeout(()=>{
                    document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + ".png)"
                    if (x==4){
                        setTimeout(()=>{
                            player.machines.nsmbPoker.played = false
                            playSound("sfx/nsmb/NCS_SE_MGM_L_PROMPT.wav")
                        }, 100)
                    }
                }, 200)
            }, 250)
            playSound("sfx/nsmb/NCS_SE_MGM_C_KUBARU.wav")
        }, (x+1)*350)
    }
    
    player.machines.nsmbPoker.discard = [false, false, false, false, false]
}

function nsmbCardSelect(card){
    if (player.machines.nsmbPoker.played){
        return
    }

    player.machines.nsmbPoker.discard[card] = !player.machines.nsmbPoker.discard[card]

    if (player.machines.nsmbPoker.discard[card]){
        playSound("sfx/nsmb/NCS_SE_MGM_C_UP.wav")
    } else {
        playSound("sfx/nsmb/NCS_SE_MGM_C_DOWN.wav")
    }

    document.querySelector(".nsmbPlayerCard" + card).style.marginTop = -16*player.machines.nsmbPoker.discard[card] + "px"

    if (player.machines.nsmbPoker.discard.reduce((partialSum, a) => partialSum + a, 0) == 0){
        document.querySelector(".nsmbHoldDrawButton").style.backgroundImage = "url(img/nsmb/hold.png)"
    } else {
        document.querySelector(".nsmbHoldDrawButton").style.backgroundImage = "url(img/nsmb/draw.png)"
    }
}

function nsmbPlay(){
    player.machines.nsmbPoker.played = true
    document.querySelector(".nsmbHoldDrawButton").style.width = "0px"
    if (player.machines.nsmbPoker.discard.reduce((partialSum, a) => partialSum + a, 0) > 1){
        playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ALL1.wav")
        setTimeout(()=>{
            playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ALL1.wav")
        }, 750)
    } else if (player.machines.nsmbPoker.discard.reduce((partialSum, a) => partialSum + a, 0) != 0){
        playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ONLY.wav")
        setTimeout(()=>{
            playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ONLY.wav")
        }, 750)
    }

    if (player.machines.nsmbPoker.discard.reduce((partialSum, a) => partialSum + a, 0) != 0){
        setTimeout(()=>{
            playSound("sfx/nsmb/NCS_SE_MGM_C_KUBARU.wav")
        }, 500)
    }
    
    setTimeout(()=>{
        nsmbSort()
    }, 950)

    for (let x = 0; x < 5; x++){
        if (player.machines.nsmbPoker.discard[x]){
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + "Flip.png)"
            }, 50)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
            }, 100)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
            }, 150)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/back.png)"
            }, 200)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.transition = "all 0.25s linear"
                document.querySelector(".nsmbPlayerCard" + x).style.marginTop = "-192px"
            }, 250)
            setTimeout(()=>{
                player.machines.nsmbPoker.hand[x] = randomListItem(nsmbPokerCards)
                document.querySelector(".nsmbPlayerCard" + x).style.marginTop = "0px"
            }, 500)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.transition = "all 0.05s linear"
            }, 750)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
            }, 800)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
            }, 850)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + "Flip.png)"
            }, 900)
            setTimeout(()=>{
                document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + ".png)"
            }, 950)
        }
    }
}

function nsmbSort(){
    let pokerCards = {}
    for (let x = 0; x < 6; x++){
        let value = player.machines.nsmbPoker.hand.filter(y => y==nsmbPokerCards[x]).length
        if (value != 0){
            pokerCards[nsmbPokerCards[x]] = value
        }
    }

    var items = Object.keys(pokerCards).map(function(key) {
        return [key, pokerCards[key]];
    })

    items.sort(function(first, second) {
        return second[1] - first[1];
    })

    let playerScore = {
        "teir": 1,
        "score": 0,
        "tiebreaker": 0
    }

    if (items[0][1] == 5){
        playerScore.teir = 16
    } else if (items[0][1] == 4){
        playerScore.teir = 8
    } else if (items[0][1] == 3){
        if (items[1][1] == 2){
            playerScore.teir = 6
        } else {
            playerScore.teir = 4
        }
    } else if (items[0][1] == 2){
        if (items[1][1] == 2){
            playerScore.teir = 3
        } else {
            playerScore.teir = 2
        }
    }

    playerScore.score = 6-nsmbPokerCards.indexOf(items[0][0])
    if (items[1] != undefined){
        playerScore.tiebreaker = 6-nsmbPokerCards.indexOf(items[1][0])
    }

    let sortedHand = []
    for (let x = 0; x < items.length; x++){
        for (let y = 0; y < items[x][1]; y++){
            sortedHand.push(items[x][0])
        }
    }

    for (let x = 0; x < 5; x++){
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + "Flip.png)"
        }, 50)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
        }, 100)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
        }, 150)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/back.png)"
            player.machines.nsmbPoker.hand[x] = sortedHand[x]
        }, 200)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
        }, 350)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
        }, 400)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + "Flip.png)"
        }, 450)
        setTimeout(()=>{
            document.querySelector(".nsmbPlayerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.hand[x] + ".png)"
        }, 500)
    }

    pokerCards = {}
    for (let x = 0; x < 6; x++){
        let value = player.machines.nsmbPoker.dealerHand.filter(y => y==nsmbPokerCards[x]).length
        if (value != 0){
            pokerCards[nsmbPokerCards[x]] = value
        }
    }

    var items = Object.keys(pokerCards).map(function(key) {
        return [key, pokerCards[key]];
    })

    items.sort(function(first, second) {
        return second[1] - first[1];
    })

    let dealerScore = {
        "teir": 1,
        "score": 0,
        "tiebreaker": 0
    }

    if (items[0][1] == 5){
        dealerScore.teir = 16
    } else if (items[0][1] == 4){
        dealerScore.teir = 8
    } else if (items[0][1] == 3){
        if (items[1][1] == 2){
            dealerScore.teir = 6
        } else {
            dealerScore.teir = 4
        }
    } else if (items[0][1] == 2){
        if (items[1][1] == 2){
            dealerScore.teir = 3
        } else {
            dealerScore.teir = 2
        }
    }

    dealerScore.score = 6-nsmbPokerCards.indexOf(items[0][0])
    if (items[1] != undefined){
        dealerScore.tiebreaker = 6-nsmbPokerCards.indexOf(items[1][0])
    }

    let sortedDealerHand = []
    for (let x = 0; x < items.length; x++){
        for (let y = 0; y < items[x][1]; y++){
            sortedDealerHand.push(items[x][0])
        }
    }

    playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ALL1.wav")
    setTimeout(()=>{
        playSound("sfx/nsmb/NCS_SE_MGM_C_TURN_ALL2.wav")
    }, 300)

    for (let x = 0; x < 5; x++){
        setTimeout(()=>{
            player.machines.nsmbPoker.dealerHand[x] = sortedDealerHand[x]
            document.querySelector(".nsmbDealerCard" + x).style.backgroundImage = "url(img/nsmb/card/backFlip.png)"
        }, 350)
        setTimeout(()=>{
            document.querySelector(".nsmbDealerCard" + x).style.backgroundImage = "url(img/nsmb/card/side.png)"
        }, 400)
        setTimeout(()=>{
            document.querySelector(".nsmbDealerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.dealerHand[x] + "Flip.png)"
        }, 450)
        setTimeout(()=>{
            document.querySelector(".nsmbDealerCard" + x).style.backgroundImage = "url(img/nsmb/card/" + player.machines.nsmbPoker.dealerHand[x] + ".png)"
        }, 500)
    }

    setTimeout(()=>{
        let win = 0
        if (playerScore.teir > dealerScore.teir){
            win = 1
        } else if (playerScore.teir == dealerScore.teir){
            if (playerScore.score > dealerScore.score){
                win = 1
            } else if (playerScore.score == dealerScore.score){
                if (playerScore.tiebreaker > dealerScore.tiebreaker && (playerScore.teir == 3 || playerScore.teir == 6)){
                    win = 1
                } else if (playerScore.tiebreaker < dealerScore.tiebreaker && (playerScore.teir == 3 || playerScore.teir == 6)){
                    win = -1
                }
            } else {
                win = -1
            }
        } else {
            win = -1
        }

        if ((playerScore.teir == 3 || playerScore.teir == 6) && (dealerScore.teir == 3 || dealerScore.teir == 6)){
            nsmbRenderHierarchy([playerScore.score, playerScore.tiebreaker], [dealerScore.score, dealerScore.tiebreaker])
        } else {
            nsmbRenderHierarchy([playerScore.score], [dealerScore.score])
        }

        document.querySelector(".nsmbPlayerScore").style.width = "110px"
        document.querySelector(".nsmbDealerScore").style.width = "110px"
        document.querySelector(".nsmbPlayerScore").style.backgroundImage = `url(img/nsmb/scores/${playerScore.teir}.png)`
        document.querySelector(".nsmbDealerScore").style.backgroundImage = `url(img/nsmb/scores/${dealerScore.teir}.png)`

        if (win == 1){
            switch (playerScore.teir){
                case 1:
                    unlockMedal(87801)
                    NGIO.postScore(15517, 1, function(){})
                    break

                case 2:
                    NGIO.postScore(15523, 1, function(){}); break
                
                case 3:
                    NGIO.postScore(15524, 1, function(){}); break

                case 4:
                    NGIO.postScore(15522, 1, function(){}); break

                case 6:
                    NGIO.postScore(15521, 1, function(){}); break

                case 8:
                    NGIO.postScore(15520, 1, function(){}); break

                case 16:
                    NGIO.postScore(15519, 1, function(){}); break
            }

            if (player.machines.nsmbPoker.bet*playerScore.teir == 15984){
                unlockMedal(87803)
            }
            
            player.money += player.machines.nsmbPoker.bet*playerScore.teir*100
            refreshMoneyCount()
            document.querySelector(".nsmbWinnings").innerHTML = textIcons.nsmbCoin + renderString(player.machines.nsmbPoker.bet*playerScore.teir+"", "none", "nsmbPissSmall")
            playSound("sfx/nsmb/NCS_SE_MGM_CASINO_WIN.wav")
            playSound("sfx/nsmb/NCS_SE_MGM_L_CLAP.wav")
        } else if (win == 0){
            player.money += player.machines.nsmbPoker.bet*100
            refreshMoneyCount()
            document.querySelector(".nsmbWinnings").innerHTML = textIcons.nsmbCoin + renderString(player.machines.nsmbPoker.bet+"", "none", "nsmbPissSmall")
            playSound("sfx/nsmb/NCS_SE_MGM_CASINO_DRAW.wav")
            playSound("sfx/nsmb/NCS_SE_MGM_L_DRAW.wav")
        } else if (win == -1){
            document.querySelector(".nsmbWinnings").innerHTML = textIcons.nsmbCoin + renderString("0", "none", "nsmbPissSmall")
            playSound("sfx/nsmb/NCS_SE_MGM_CASINO_BAD.wav")
            playSound("sfx/nsmb/NCS_SE_MGM_L_LOSE.wav")
        }
    }, 1000)

    setTimeout(()=>{
        document.querySelector(".nsmbHoldDrawButton").style.width = "144px"
        document.querySelector(".nsmbStartPoker").style.height = "192px"
        player.machines.nsmbPoker.hand = []
        player.machines.nsmbPoker.dealerHand = []
        nsmbRenderHierarchy([], [])
        document.querySelector(".nsmbPlayerScore").style.width = "0px"
        document.querySelector(".nsmbDealerScore").style.width = "0px"
        document.querySelector(".nsmbWinnings").innerHTML = ""
        document.querySelector(".nsmbHoldDrawButton").style.backgroundImage = "url(img/nsmb/hold.png)"
    }, 4000)
}

function nsmbRenderHierarchy(red, green){
    document.querySelector(".nsmbSymbols").innerHTML = ""
    for (let x = 0; x < 6; x++){
        let colour = ""
        if (red.indexOf(6-x) != -1){
            colour += "R"
        }
        if (green.indexOf(6-x) != -1){
            colour += "G"
        }
        document.querySelector(".nsmbSymbols").innerHTML += (textIcons.nsmbHierarchy["start"+["Even", "Odd"][x%2]] + nsmbPokerCards[x] + colour + textIcons.nsmbHierarchy["end"+["Even", "Odd"][x%2]])
        if (x != 5){
            document.querySelector(".nsmbSymbols").innerHTML += `<div style="margin-top: -9px;"></div>`
        }
    }
}

function nsmbBet(change){
    if (typeof player.machines.nsmbPoker.bet != "number"){
        player.machines.nsmbPoker.bet = 1
    }

    if (change > 0 && player.machines.nsmbPoker.bet < 999){
        playSound("sfx/nsmb/NCS_SE_MGM_COIN_BET.wav")
    } else if (change < 0 && player.machines.nsmbPoker.bet > 1){
        playSound("sfx/nsmb/NCS_SE_MGM_COIN_BET.wav")
    } else if (change > 0 || change < 0){
        playSound("sfx/nsmb/NCS_SE_MGM_C_DOWN.wav")
    }

    player.machines.nsmbPoker.bet = Math.min(Math.max(player.machines.nsmbPoker.bet + change, 1), 999)
    document.querySelector(".nsmbBet").innerHTML = textIcons.nsmbCoin + renderString(player.machines.nsmbPoker.bet+"", "none", "nsmbBig")
}

nsmbBet(0)
// nsmbRenderHierarchy([], [])
// if (player.machines.nsmbPoker.hand != []){
//     player.money += player.machines.nsmbPoker.bet*100
//     player.machines.nsmbPoker.hand = []
// }