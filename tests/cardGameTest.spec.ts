import { test, expect } from '@playwright/test';
import axios from 'axios';

test('Blackjack Test', async ({ }) => {
  // Step 1: Get a new deck
  let response = await axios.get('https://deckofcardsapi.com/api/deck/new/');
  expect(response.status).toBe(200);
  const deckId = response.data.deck_id;

  // Step 2: Shuffle it
  response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
  expect(response.status).toBe(200);
  expect(response.data.shuffled).toBe(true);

  // Step 3: Deal three cards to each of two players
  response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
  expect(response.status).toBe(200);
  const playerOneCards = response.data.cards;

  response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
  expect(response.status).toBe(200);
  const playerTwoCards = response.data.cards;

  // Step 4: Check whether either has blackjack
  const checkBlackjack = (cards) => {
    const values = cards.map(card => card.value);
    return values.includes('ACE') && (values.includes('10') || values.includes('JACK') || values.includes('QUEEN') || values.includes('KING'));
  };

  const playerOneHasBlackjack = checkBlackjack(playerOneCards);
  const playerTwoHasBlackjack = checkBlackjack(playerTwoCards);

  // Step 5: If either has, write out which one does
  if (playerOneHasBlackjack) console.log("Player One has blackjack!");
  if (playerTwoHasBlackjack) console.log("Player Two has blackjack!");
});