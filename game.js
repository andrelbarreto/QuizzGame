const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const TimerText = document.getElementById("timer");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
  )
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch(err => {
    console.error();
  });

//CONSTANTS
const CORRECT_BONUS = 5;
const MAX_QUESTIONS = 10;


//object to start the game
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

// Tried a few different approaches on how to add timer to game
// <script src="https://code.jquery.com/jquery-latest.min.js">

/* let timeleft = 10;
var downloadTimer = setInterval(function(){
  document.getElementById("timer").value = timeleft + " seconds remaining";
  timeleft -= 1;
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("timer").value = "Finished"
  }
}, 1000);  */

// Function to return formattedseconds for display as it counts down seconds

TimerText.value = 75;
var secondsElapsed = 0;

function getFormattedSeconds() {
  var secondsLeft = (TimerText.value - secondsElapsed) % 60;

  var formattedSeconds;

  if (secondsLeft < 10) {
    formattedSeconds = "0" + secondsLeft;
  } else {
    formattedSeconds = secondsLeft;
  }

  return formattedSeconds;
}


getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;
  //checks the answer choice
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
//set timer once question is displayed
setInterval(function () {
  timer = TimerText.value--;
  TimerText.innerText = timer;
  if (timer <= 0) {
    alert('Time out!')
    return;
  }
  timer = getFormattedSeconds();
  // check if answer is correct or incorrect and assign points
  choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;

      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
        const classToApply =

// if classtoapply is correct, points are added, if incorrect 3 secs are discounted from clock;       
     
       selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
  
      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }
  
  
      if(classToApply === "incorrect"){
  
          timer = timer - 3;
          TimerText.innerText = timer;
      }
      selectedChoice.parentElement.classList.add(classToApply);
  
   
      // check for time out   
      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
        if (timer <= 0) {
          clearInterval(timer);
          localStorage.setItem("mostRecentScore", score);
          //go to the end page
          return window.location.assign("end.html");
        }
      }, 1000);
    });
  });

  // Score counter
  incrementScore = num => {
    score += num;
    scoreText.innerText = score;
  };
}, 1000)

/*Timer
var timeleft = 75;
var downloadTimer = setInterval(function(){
  document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
  timeleft -= 1;
  if(timeleft < 0){
    clearInterval(downloadTimer);
    window.location.assign("end.html")
  }
}, 1000);

//startGame();  */