var questionElement = document.querySelector("#question");
var answerElement = document.querySelector("#answers");
var resultElement = document.querySelector("#result");
var startBtn = document.querySelector("#start");

var currQuestionIndex = 0;
var score = 0

var questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            {text: "Hyperlink Text Markup Language", correct: false},
            {text: "Hyper Text Makeup Language", correct: false},
            {text: "Hyper Text Markup Language", correct: true},
            {text: "Hyper Transfer Markup Language", correct: false},
        ]
    }
]

function clearStartScreen() {
    questionElement.innerHTML = ""
    answerElement.innerHTML = ""
    startBtn.setAttribute("style", "display: none;")
}

function showQuestion() {
    
    // clear away the quiz start page.
    clearStartScreen()

    var currQuestion = questions[currQuestionIndex];
    var questionNumber = currQuestionIndex + 1;
    questionElement.innerHTML = currQuestion.question;

    // iterate the answers and create a button for each one 
    for (var i = 0; i < currQuestion.answers.length; i++) {
        var option = currQuestion.answers[i];
        var answerBtn = document.createElement("button");
        answerBtn.textContent = option.text;
        answerBtn.classList.add("answer-button")
        answerElement.appendChild(answerBtn);
    }

}

function startQuiz() {
    currQuestionIndex = 0;
    score = 0;
    showQuestion();
};

startBtn.addEventListener("click", startQuiz);
