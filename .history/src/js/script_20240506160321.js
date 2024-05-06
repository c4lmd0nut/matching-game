"use strict";
import * as config from "./config.js";
import { shuffleCards } from "./helper.js";
import "core-js/stable";
import "regenerator-runtime";
import imageCards from "../img/*.png";

//////// DOM variables
const containerWelcome = document.querySelector(".container-welcome");
const containerCards = document.querySelector(".container-cards");
const instructionsMessage = document.querySelector(".instructions");
const winMessage = document.querySelector(".win-message");
const loseMessage = document.querySelector(".lose-message");
const startButton = document.querySelector(".btn-start");
const btnContinue = document.querySelector(".btn-cont");
const btnReset = document.querySelectorAll(".btn-reset");
const labelTimer = document.querySelector(".counter-timer");
const labelTurn = document.querySelector(".counter-turn");
const labelScore = document.querySelector(".counter-score");
const currentScore = document.querySelector(".current-score");
//////// global variables
const images = [];
const clickedCardArray = [];
let matchedCards = 0;
let totalTurns = 0;
let timeCompleted = 0;
let scoring = [];
let cardsEl;
let currentLevel = 0;
let totalCards;
let totalMatches;
let totalGameTime;
let totalScore;

const gameVariables = function () {
  if (currentLevel === 0) {
    totalCards = config.totalCardsLevelOne;
    totalMatches = config.matchesLevelOne;
    totalGameTime = config.timerLevelOne;
  }
  if (currentLevel === 1) {
    totalCards = config.totalCardsLevelTwo;
    totalMatches = config.matchesLevelTwo;
    totalGameTime = config.timerLevelTwo;
  }
  if (currentLevel === 2) {
    totalCards = config.totalCardsLevelThree;
    totalMatches = config.matchesLevelThree;
    totalGameTime = config.timerLevelThree;
  }
};

//////// functions
const imageAssignment = function () {
  for (let i = 0; i < totalMatches; i++)
    for (let j = 0; j < config.n; j++) {
      // images.push(`../img/${i + 1}.png`);
      images.push(imageCards[i + 1]);
    }
};
//create the card and its cover
const createCard = function (imgUrl) {
  for (let i = 0; i < totalCards; i++) {
    const htmlCard = `
  <div class="card">
    <img src="${imgUrl}" class="cards hidden" data-src="${i}"/>
</div>`;

    containerCards.insertAdjacentHTML("afterbegin", htmlCard);
  }
};

//matching function
const checkMatch = function (cardArray) {
  if (cardArray.length === 2) {
    if (cardArray[0].cardUrl === cardArray[1].cardUrl) {
      matchedCards++;
      setTimeout(() => {
        cardArray.forEach((cc) => cc.cardHTML.classList.add("hidden"));
        cardArray.length = 0;
        //what happens if you win
        checkWin();
      }, 500);
    } else {
      cardArray.forEach((cc) => cc.cardHTML.classList.remove("revealed"));
      cardArray.length = 0;
    }
  }
  countTurns();
};

//tracking number of  turns
const countTurns = function () {
  totalTurns++;
  labelTurn.textContent = `${totalTurns} turns`;
  return totalTurns;
};

// timer
const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //label
    labelTimer.textContent = `${min}:${sec}`;

    //if time === 0
    if (time === 0) {
      clearInterval(timer);
      cardsEl.forEach((card) => card.classList.add("hidden"));
      loseMessage.classList.remove("hidden");
    }

    // if we found all matched cards
    if (matchedCards === totalMatches) {
      timeCompleted = time;
      clearInterval(timer);
    }

    // time decrease every second
    time--;
  };
  //   let time = config.timerLevelOne;
  let time = totalGameTime;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//selectCardEl - reselect card elements whenever we initialize
const selectCardEl = function () {
  cardsEl = document.querySelectorAll(".cards");
};

//listen to event when the card is clicked
const cardEventListener = () => {
  cardsEl.forEach((card) =>
    card.addEventListener("click", function (e) {
      handleCardClick(card);
    })
  );
};

//start the game function
const startGame = function () {
  containerWelcome.classList.add("hidden");
  instructionsMessage.classList.add("hidden");
  labelTimer.classList.remove("hidden");
  labelTurn.classList.remove("hidden");
  labelScore.classList.remove("hidden");
  cardsEl.forEach((card) => {
    card.classList.remove("hidden");
    card.classList.remove("revealed");
  });
  startTimer();
};

// next-level buttons
const btnNextLevel = document.querySelector(".btn-next-level");
btnNextLevel.addEventListener("click", () => {
  if (currentLevel < 2) {
    currentLevel++;
    init();
    startGame();
  }
});

//////// when you matched all === win
const checkWin = function () {
  if (matchedCards === totalMatches) {
    if (currentLevel < 2) {
      scoreCalculate();
      winMessage.classList.remove("hidden");
    }

    if (currentLevel === 2) {
      scoreCalculate();
      document.querySelector(
        ".final-message"
      ).textContent = `You completed all the level!\nYour final score is ${totalScore}`;
      btnNextLevel.textContent = "Replay";
      btnNextLevel.addEventListener("click", () => reset());
      winMessage.classList.remove("hidden");
    }
  }
};

//scoring
const scoreFormula = function (multipler) {
  const score = config.baseScore * multipler - config.penalty * totalTurns;
  //   console.log(score);
  return score;
};

const updateScoreText = () => {
  const score = scoring[currentLevel].toFixed(0);
  totalScore = scoring.reduce((accum, score) => accum + score, 0).toFixed(0);
  labelScore.textContent = `${score} score`;
  currentScore.textContent = `Your current score: ${score}\nYour total score:${totalScore}`;
};

const scoreCalculate = function () {
  timeCompleted < totalGameTime * 0.3
    ? scoring.push(scoreFormula(config.multiplerTier1))
    : scoring.push(scoreFormula(config.multiplerTier2));
  updateScoreText();
};

//////// initialization
const init = function () {
  images.length = 0;
  containerCards.innerHTML = "";
  labelScore.textContent = "0 score";
  labelTurn.textContent = "0 turns";
  matchedCards = 0;
  totalTurns = 0;
  gameVariables();
  imageAssignment();
  shuffleCards(images);
  // createCard(config.imgCoverUrl);
  createCard(`${require("../img/cover.png")}`); ///////////

  containerWelcome.classList.contains("hidden")
    ? containerWelcome.classList.remove("hidden")
    : containerWelcome;
  instructionsMessage.classList.add("hidden");
  containerCards.classList.add("hidden");
  loseMessage.classList.add("hidden");
  winMessage.classList.add("hidden");
  labelTimer.classList.add("hidden");
  labelTurn.classList.add("hidden");
  labelScore.classList.add("hidden");

  selectCardEl();
  cardEventListener();
};

// reset
const reset = function () {
  scoring = [];
  currentLevel = 0;
  totalScore = 0;
  document.querySelector(".final-message").textContent = `YAY YOU WIN!🥳`;
  btnNextLevel.textContent = "Play Next Level";

  init();
};

//first load
reset();

///// Events
//when click start button
startButton.addEventListener("click", function () {
  containerWelcome.classList.add("hidden");
  instructionsMessage.classList.remove("hidden");
});

//when click Got it! button
btnContinue.addEventListener("click", function () {
  startGame();
});

// how to handle after a card is clicked
const handleCardClick = function (card) {
  //TODO:
  const imgRevealedFaceURL = images[card.dataset.src];
  card.src = imgRevealedFaceURL;
  // card.src = require("../img/1.png");

  //flipping back to cover
  setTimeout(() => (card.src = require("../img/cover.png")), 500);

  if (clickedCardArray.length < 2 && !card.classList.contains("revealed"))
    clickedCardArray.push({ cardUrl: `${card.src}`, cardHTML: card });

  //prevent similar property from being added
  card.classList.add("revealed"); //add revealed class

  //checkMatch
  checkMatch(clickedCardArray);
};

//reset buttons
btnReset.forEach((button) =>
  button.addEventListener("click", () => {
    reset();
  })
);

//add highscore, current level
