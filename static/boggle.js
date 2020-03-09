let guess = $("#guess")
let wordList = $(".wordlist")
let msg = ""
let green = $("#green")
let yellow = $("#yellow")
let red = $("#red")
let currentScore = 0
let currentTime = $('#timer')[0]
let myTimer = null

let n = localStorage.getItem('countTotalPlays');
if (n === null) {
    n = 0;
}
n++;
localStorage.setItem("countTotalPlays", n);

let numPlays = $('#num-plays')
numPlays[0].innerText = n

if(localStorage.getItem('recordHighScore') === null){
    $('.high-score')[0].innerText = currentScore
} else {
    $('.high-score')[0].innerText = localStorage.getItem('recordHighScore')
}


async function getGuess() {
    const res = await axios.post(`http://127.0.0.1:5000/guess`, {guess: guess[0].value}) // TODO why does it have to be guess[0] not guess?
    let data = res.data
    flashMessage(data.result, data.user_input)
    console.log(res.data.result)
    console.log(res.data.user_input)
}

async function sendScore(){
    const res = await axios.post(`http://127.0.0.1:5000/score`, {score: currentScore, totalPlays: n}) //
    let data = res.data
    console.log("Score Data", data)
}

function flashMessage(result, userInput) {
    if (result === "ok") {
        currentScore += userInput.length
        $('.current-score')[0].innerText = currentScore
        msg = `Great Job! Added "${userInput}"`
        green[0].innerText = ""
        yellow[0].innerText = ""
        red[0].innerText = ""
        green.append(msg)
        wordList.append(`<li>${userInput}</li>`)
    } else if (result === "not-on-board") {
        msg = `"${userInput}" does not exist in this board.`
        green[0].innerText = ""
        yellow[0].innerText = ""
        red[0].innerText = ""
        yellow.append(msg)
    } else {
        msg = `"${userInput}" is not a valid English word.`
        green[0].innerText = ""
        yellow[0].innerText = ""
        red[0].innerText = ""
        red.append(msg)
    }
    console.log(msg)
}

myTimer = setInterval(function () {
    currentTime.innerHTML--
    if (Number(currentTime.innerHTML) <= 0) {
        clearInterval(myTimer)
        sendScore()
        if(localStorage.getItem('recordHighScore') === null){
            localStorage.setItem('recordHighScore', currentScore)
        } else if (parseInt(localStorage.getItem('recordHighScore')) < currentScore) {
            localStorage.setItem('recordHighScore', currentScore)
            $('.high-score')[0].innerText = localStorage.getItem('recordHighScore')
        } else {
            $('.high-score')[0].innerText = localStorage.getItem('recordHighScore')
        }
        // disable btn
        $('#submit').attr('disabled', true)
    }
}, 1000)


$(document).ready(function () {
    $("#submit").click(function (e) {
        getGuess()
        guess.val("")
        e.preventDefault()
    })
})

