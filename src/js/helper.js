//abstract away helper functions
import * as config from "./config.js";

export const shuffleCards = function (cardArray) {
  for (let i = cardArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
  }
  return cardArray;
};
