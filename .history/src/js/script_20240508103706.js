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
const btnReset = document.querySelector(".btn-reset");
const labelTimer = document.querySelector(".counter-timer");
const labelTurn = document.querySelector(".counter-turn");
const labelScore = document.querySelector(".counter-score");
const currentScore = document.querySelector(".current-score");
const finalMessage = document.querySelector(".final-message");
//////// global variables
//retain through game levels
let currentLevel = 0;
let scoring = [];
let totalScore;

//change whenever level changes
const images = [];
const clickedCardArray = [];
let matchedCards = 0;
let totalTurns = 0;
let timer; //tracking if timer is true/false
let timeCompleted = 0;
let cardsEl;

//based on current level
let totalCards;
let totalMatches;
let totalGameTime;

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
//assigning positions of the cards
const imageAssignment = function () {
  for (let i = 0; i < totalMatches; i++)
    for (let j = 0; j < config.n; j++) {
      images.push(imageCards[i + 1]);
    }
};

//create each card and its cover
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
      }, 300);
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

    //if time's up
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
    card.addEventListener("click", (e) => handleCardClick(card))
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
  if (timer) clearInterval(timer);
  startTimer();
};

// next-level buttons
const btnNextLevel = document.querySelector(".btn-next-level");

const nextLevelFunction = function () {
  btnNextLevel.addEventListener("click", () => {
    if (currentLevel < 2) {
      currentLevel++;
      init();
      startGame();
    }
  });
};

//////// when you matched all === win
const checkWin = function () {
  if (matchedCards === totalMatches) {
    if (currentLevel < 2) {
      scoreCalculate();
      winMessage.classList.remove("hidden");
    }

    if (currentLevel === 2) {
      scoreCalculate();
      finalMessage.textContent = `You completed all the level!\nYour final score is ${totalScore}`;
      btnNextLevel.textContent = "Replay";
      btnNextLevel.addEventListener("click", reset);
      winMessage.classList.remove("hidden");
    }
  }
};

//score formula
const scoreFormula = function (multipler) {
  const score = config.baseScore * multipler - config.penalty * totalTurns;
  return score;
};

//calculate score and store it in scoring variable
const scoreCalculate = function () {
  timeCompleted < totalGameTime * 0.3
    ? scoring.push(scoreFormula(config.multiplerTier1))
    : scoring.push(scoreFormula(config.multiplerTier2));
  updateScoreText();
};

//update the ui/ux
const updateScoreText = () => {
  console.log(scoring);
  console.log(currentLevel);
  const score = scoring[currentLevel].toFixed(0);
  totalScore = scoring.reduce((accum, score) => accum + score, 0).toFixed(0);
  labelScore.textContent = `${score} score`;
  currentScore.textContent = `Your current score: ${score}\nYour total score:${totalScore}`;
};

//////// initialization
//changes everytime level
const init = function () {
  containerCards.innerHTML = "";
  labelScore.textContent = "0 score";
  labelTurn.textContent = "0 turns";
  images.length = 0;
  matchedCards = 0;
  totalTurns = 0;
  gameVariables();
  imageAssignment();
  shuffleCards(images);
  createCard(`${require("../img/cover.png")}`);

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
  scoring.length = 0;
  currentLevel = 0;
  totalScore = 0;
  finalMessage.textContent = "YAY YOU WIN!🥳";
  btnNextLevel.textContent = "Play Next Level";
  nextLevelFunction(); //btn next level revert back to the next level function
  init();
};

//first load
document.addEventListener("DOMContentLoaded", reset);

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

//load image async
const loadImage = function (imgUrl) {
  try {
    return new Promise((resolve, reject) => {
      const revealedCardImage = new Image();
      revealedCardImage.src = imgUrl;
      revealedCardImage.onload = () => resolve(revealedCardImage);
      // revealedCardImage.onerror = reject;
    });
  } catch (error) {
    console.error(reject(error));
  }
};

// how to handle after a card is clicked
const handleCardClick = async function (card) {
  try {
    //pathway to image url that is clicked
    const imgRevealedFaceURL = images[card.dataset.src];

    const img = await loadImage(imgRevealedFaceURL);
    card.src = img.src;

    //flipping back to cover
    setTimeout(() => (card.src = require("../img/cover.png")), 500);

    if (clickedCardArray.length < 2 && !card.classList.contains("revealed"))
      clickedCardArray.push({ cardUrl: `${card.src}`, cardHTML: card });

    //prevent similar property from being added
    card.classList.add("revealed"); //add revealed class

    //checkMatch
    checkMatch(clickedCardArray);
  } catch (error) {
    console.error("error loading image", imgRevealedFaceURL);
  }
};

//reset buttons
btnReset.addEventListener("click", reset);
