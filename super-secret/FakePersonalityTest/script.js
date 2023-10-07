const yesbutton = document.querySelector(".yesButton")
const nobutton = document.querySelector(".noButton")
const skipbutton = document.querySelector(".skipButton")

const countdown = document.querySelector(".countdown")

const questionText = document.querySelector(".questionText")

let startTime = Date.now()
let questionTime = []

function nextQuestion(plusone = 0){
    questionText.textContent = questions[Math.floor(Math.random() * questions.length)]
    let tempTime = Date.now()
    questionTime.push(tempTime - startTime)
    startTime = tempTime

    if (questionTime.length >= 5){
        countdown.textContent = "Warning, if you get your results before finishing the test, it will be less accurate"
    } else {
        countdown.textContent = "Option will unlock in " + (5-questionTime.length+plusone) + " questions."
    }
}

function endQuiz(){
    yesbutton.setAttribute("disabled", true)
    nobutton.setAttribute("disabled", true)
    skipbutton.setAttribute("disabled", true)
    //questionTime.re
}

nextQuestion(1)
questionTime.pop()

// https://twitter.com/home?text=this%20is%20a%20test