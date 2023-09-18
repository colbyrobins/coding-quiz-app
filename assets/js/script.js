var timerEl = document.querySelector("#time")
var highScoreEl = document.querySelector("#high-score")

// main application element
var quizApp = document.querySelector("#quiz-app");

// start page elements
var quizAppPageTitle = document.createElement("h1")
var quizAppPageDescription = document.createElement("div")
var quizStartBtn = document.createElement("button")

// create question and answer elements
var question = document.createElement("h1")
var answers = document.createElement("div")
var answerStatus = document.createElement("div")

// end of quiz elements to display to the screen
var endOfQuizHeaderEl = document.createElement("h1")
var endOfQuizScoreTextEl = document.createElement("div")
var endOfQuizScoreText2El = document.createElement("div")
var endOfQuizSubmitScoreForm = document.createElement("form")

// variables to track question index, score and time remaining.
var currQuestionIndex = 0;
var score = 0
var timeRemaining = 60;
var timerCountdown;

var questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            {text: "Hyperlink Text Markup Language", correct: false},
            {text: "Hyper Text Makeup Language", correct: false},
            {text: "Hyper Text Markup Language", correct: true},
            {text: "Hyper Transfer Markup Language", correct: false},
        ]
    },
    {
        question: "",
        answers: [
            {text: "", correct: false},
            {text: " ", correct: false},
            {text: "", correct: true},
            {text: "", correct: false},
        ]
    }
]

function removeAllChildren(element) {
    while(element.firstChild) {
        removeAllChildren(element.firstChild);
        element.removeChild(element.firstChild);
    }
}

function countdown() {
    timerEl.textContent = "Time: " + timeRemaining;
    if (timeRemaining === 0) {
        clearInterval(countdown);
        removeAllChildren(quizApp);
        submitScore();
    }else {
        timeRemaining--;
    }
}

function done() {
    // clear the timer and remove the last quiz question.
    clearInterval(timerCountdown);
    removeAllChildren(quizApp);
    submitScore();
}

function getScores() {
    var scores = JSON.parse(localStorage.getItem("scores"));
}

function setScore(userInitials) {

    var scoreData = localStorage.getItem("scoreData")
    console.log(scoreData)

    if (scoreData === null) {
        scoreData = [];
    }else {
        scoreData = JSON.parse(scoreData)
    }

    var found = false;
    for (var i = 0; i < scoreData.length; i++) {
        if (scoreData[i].initials === userInitials) {
            scoreData[i].score = score;
            found = true;
        }
    }
    if (found) {
        localStorage.setItem("scoreData", JSON.stringify(scoreData))    
    } else {
        scoreData.push({ initials: userInitials, score: score})
        localStorage.setItem("scoreData", JSON.stringify(scoreData))
    }
    
}

function submitScore() {

    quizApp.setAttribute("style", "display:flex; flex-direction: column; ")
    endOfQuizSubmitScoreForm.setAttribute("style", "display:flex; flex-direction: row;")
    endOfQuizScoreTextEl.setAttribute("style", "padding: 5px 5px;")
    endOfQuizScoreText2El.setAttribute("style", "padding: 5px 5px;")
    
    // display score and prompt to save score.
    endOfQuizHeaderEl.innerHTML = "All Done!";
    endOfQuizScoreTextEl.innerHTML = "Your final score is " + score;
    endOfQuizScoreText2El.innerHTML = "Enter initials:"

    // create the form to display
    var initialsLabel = document.createElement("label");
    initialsLabel.setAttribute("for", "submit-score");

    var initialsInput = document.createElement("input");
    initialsInput.type = "text";
    initialsInput.id = "submit-score";
    
    var submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    submitBtn.classList.add("start-btn")
    // submitBtn.setAttribute("style", "background-color: rgb(98, 0, 255); color: white; margin:2px;")

    quizApp.appendChild(endOfQuizHeaderEl);
    quizApp.appendChild(endOfQuizScoreTextEl);
    endOfQuizSubmitScoreForm.appendChild(endOfQuizScoreText2El);
    endOfQuizSubmitScoreForm.appendChild(initialsLabel);
    endOfQuizSubmitScoreForm.appendChild(initialsInput);
    endOfQuizSubmitScoreForm.appendChild(submitBtn)
    quizApp.appendChild(endOfQuizSubmitScoreForm);
    
    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        var initials = document.getElementById("submit-score").value;
        setScore(initials)
        displayHighScores();
    });
}

function displayHighScores() {
    removeAllChildren(quizApp);
    var highScoreTitleEl = document.createElement("h1");
    highScoreTitleEl.innerHTML = "High scores"
    quizApp.appendChild(highScoreTitleEl);

    var scoreContainer = document.createElement("div");
    // add logic to iterate scores from memory.
    var scoreData = JSON.parse(localStorage.getItem("scoreData"));
    console.log(scoreData)
    for (var i = 0; i < scoreData.length; i++) {
        var scoreEntryEl = document.createElement("div");
        j = i + 1
        scoreEntryEl.textContent = j + ". " + scoreData[i].initials + " - " + scoreData[i].score;
        scoreContainer.appendChild(scoreEntryEl)
    }

    quizApp.appendChild(scoreContainer)
}

function checkAnswer(option) {
    
    // check if we selected the correct answer.
    if (option.correct) {
        score++ 
        answerStatus.innerHTML = "Correct!"
    }else {
        timeRemaining -= 5 
        answerStatus.innerHTML = "Wrong!"
    }

    quizApp.append(answerStatus)
    currQuestionIndex++;

    if (currQuestionIndex < questions.length) {
        removeAllChildren(quizApp)
        displayQuestion();
    }else {
        done()
    }
}

function displayQuestion() {
    quizApp.setAttribute("style", "display:flex; flex-direction: column; ");
    // answers.setAttribute("style", "display:flex; flex-direction: column;align-items: baseline; flex: 1;")
    answers.setAttribute("style", "display:flex; flex-direction: column; ")

    // get the question to display.
    var currQuestion = questions[currQuestionIndex];
    question.innerHTML = currQuestion.question;

    // iterate the options and create a button to select for 
    // each option.
    currQuestion.answers.forEach(function (option, index) {
        var optionBtn = document.createElement("button");
        optionBtn.textContent = option.text;
        answers.appendChild(optionBtn);
        optionBtn.setAttribute("style", "flex-grow: 1; max-width: 200px; background-color: rgb(98, 0, 255); color: white; margin: 1px 1px; border-radius: 5px; ")
        
        // add an event listener to each button to check if the answer
        // was correct or not.
        optionBtn.addEventListener("click", function() {
            checkAnswer(option);
        });
        
        // add question and buttons to the quiz page.
        quizApp.appendChild(question);
        quizApp.appendChild(answers);

    });
}

function startQuiz() {

    // before we start the quiz, remove the welcome page info.
    removeAllChildren(quizApp)
    timerCountdown = setInterval(countdown, 1000);
    displayQuestion();
}

function init () {
    quizApp.setAttribute("style", "flex-direction: column; justify-content: center; align-items: center;width: 90%; max-width: 600px; margin: 100px auto 0; border-radius: 10px; padding: 30px;")
    // Add event listener to view the high scores.
    highScoreEl.addEventListener("click", function (){
        displayHighScores();
    });
    // Fill in the text.
    quizAppPageTitle.innerHTML = "Coding Quiz Challenge";
    quizAppPageDescription.innerHTML = "\
        Try to answer the following code-realted \
        questions within the time limit. Keep in mind that incorrect answers will penalize your \
        score/time by ten seconds.";
    quizStartBtn.innerHTML = "Start Quiz";

    // add style to each element.
    quizAppPageTitle.classList.add("quiz-title");
    quizAppPageDescription.classList.add("quiz-description");
    quizStartBtn.classList.add("start-btn");
    
    // append to the app quiz div to display.
    quizApp.appendChild(quizAppPageTitle)
    quizApp.appendChild(quizAppPageDescription)
    quizApp.appendChild(quizStartBtn)

    quizStartBtn.addEventListener("click", startQuiz);
}

init()
