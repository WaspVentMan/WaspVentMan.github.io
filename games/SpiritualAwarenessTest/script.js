const yesbutton = document.querySelector(".yesButton")
const nobutton = document.querySelector(".noButton")
const skipbutton = document.querySelector(".skipButton")
const endbutton = document.querySelector(".endButton")

const quizbox = document.querySelector(".quizbox")
const endbox = document.querySelector(".endbox")
const creditbox = document.querySelector(".creditbox")

const amount = document.querySelector(".amount")
const average = document.querySelector(".average")
const longest = document.querySelector(".longest")

const countdown = document.querySelector(".countdown")

const questionText = document.querySelector(".questionText")

let startTime = Date.now()
let questionTime = []
let recentquestions = []

function nextQuestion(plusone = 0){
    let rando = Math.floor(Math.random() * questions.length)
    questionText.textContent = questions[rando]

    recentquestions.push(questions[rando])
    questions.splice(rando, 1)

    let tempTime = Date.now()
    questionTime.push(tempTime - startTime)
    startTime = tempTime

    if (questionTime.length >= 5){
        countdown.textContent = "Warning, if you get your results before finishing the test, it will be less accurate"
        endbutton.removeAttribute("disabled")
    } else {
        countdown.textContent = "Option will unlock in " + (5-questionTime.length+plusone) + " questions."
    }

    if (recentquestions.length > questions.length){
        questions.push(recentquestions.shift())
    }
}

function endQuiz(){
    yesbutton.setAttribute("disabled", true)
    nobutton.setAttribute("disabled", true)
    skipbutton.setAttribute("disabled", true)
    endbutton.setAttribute("disabled", true)

    let totaltime = 0

    questionTime.sort()

    for (let x = 0; x < questionTime.length; x++){
        totaltime += questionTime[x]
    }

    console.log(totaltime)
    let averagetime = Math.round(totaltime/questionTime.length)

    amount.textContent = "YOU WERE A GULLIBLE DUMBASS FOR " + questionTime.length + " QUESTIONS, WASTING " + totaltime/1000 + " SECONDS OF YOUR LIFE"
    average.textContent = "YOU WASTED AN AVERAGE OF " + averagetime/1000 + " SECONDS PER QUESTION, WOW"
    longest.textContent = "THE LONGEST AMOUNT OF TIME YOU WASTED ON A QUESTION WAS " + questionTime[questionTime.length-1]/1000 + " SECONDS"

    quizbox.style.visibility = "hidden"
    endbox.style.visibility = "visible"
    //questionTime.re
}

nextQuestion(1)
questionTime.pop()

// https://twitter.com/home?text=this%20is%20a%20test