// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations

let questionAmount = 0;
let equationsArray = [];
let playerGuessArray =[];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

let timer;
let timePlayed = 0;
let baseTime = 0;
let penalty = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0'
let correctAnswerNumb = 0;

// Scroll
let valueY = 0;

// refresh splash page best scores 

function bestScoresToDOM() {
    bestScores.forEach((bestScore,index)=> {
      const bestScoreEl = bestScore;
      bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`
    });
}

// check local storage for best scores

function getSavedBestScores() {
  if(localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM()

}
//  update best score array

function updateBestScore() {
  bestScoreArray.forEach((score,index) => {
    // select correct best score to update
    if(questionAmount == score.questions) {
      // return the best score
    const savedBestScore = Number(bestScoreArray[index].bestScore);
    //update only if new score is bette
    if(savedBestScore === 0 || savedBestScore > finalTime) {
      bestScoreArray[index].bestScore = finalTimeDisplay;
    }
  }
  });
  bestScoresToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}

// reset the game

function playAgain() {
  
  gamePage.addEventListener('click',stratTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  penalty = 0;
  valueY = 0;

  
}

// show scores page
function showScorePage() {
  playAgainBtn.hidden = true;
  gamePage.hidden = true;
  scorePage.hidden = false;
  setTimeout(()=>{playAgainBtn.hidden = false}, 1000);
}

// scores to DOM 

function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime =penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `penalty: ${penalty}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  showScorePage();

}

// stop Timer, process results, go to score Page

function checkTime() {
  if(playerGuessArray.length == questionAmount) {
    console.log('player guess array', playerGuessArray)
    clearInterval(timer);
    // check for wrong answers and add penalty time
    for(let i=0; i < playerGuessArray.length; i++) {
      console.log('eq', equationsArray[i].evaluated)
      console.log('pl', playerGuessArray[i] )
      playerGuessArray[i] == equationsArray[i].evaluated ? correctAnswerNumb++ : penalty = penalty + 1.5;
    }
    console.log('penalty', penalty);
    finalTime = penalty + timePlayed;
    console.log("final time", finalTime);
    scoresToDOM();
    }
  }
    

// add tenth of a second to timePlayed

function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// start timer when game page is clicked

function stratTimer() {
  // reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime,100);
  gamePage.removeEventListener('click',stratTimer);
}

// scroll, store user selection in playerGuessArray

function select(guessedTrue) {
  
  // scroll 80 px
  valueY += 80;
  itemContainer.scroll(0,valueY);
  // add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}




// Display game page 
function showGamePage() {
  
  gamePage.hidden = false;
  countdownPage.hidden = true;
  itemContainer.scrollTo(0, 0);
}
// Get radnom number

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  console.log('correct', correctEquations)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong', wrongEquations)

  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to dom
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // equstion text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
  // append
  item.appendChild(equationText);
  itemContainer.appendChild(item);

  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function oneSec() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 1000);
  });
}


async function countdownStart() {
  countdown.textContent = 3;
  while(countdown.textContent> 0) {
    
    const result = await oneSec();
    countdown.textContent--;


  }
  countdown.textContent = 'GO!';

}


// navigate from splash page to acountdown PAge

function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);

}

function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked) {
      radioValue = radioInput.value;
      
    }
  });
  return radioValue;
}

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount: ', questionAmount)
  if(questionAmount) {
    showCountdown();

  } 
  
}


startForm.addEventListener('click', ()=> { 
  radioContainers.forEach((radioEl) => {
    // Remove selected labels tyling
    radioEl.classList.remove('selected-label');
    // add it back if radioinput is checked
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
})
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', stratTimer);

// on Load

getSavedBestScores();