import { test, expect } from '@playwright/test';

test('checkers', async ({ page }) => {
  
  await page.goto('https://www.gamesforthebrain.com/game/checkers/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Checkers - Games for the Brain");

  // Create a 2D array to store the element handles.
  const checkerboard: Array<Array<any>> = [];

  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector("//div[@class='line']");

  // Loop through each row
  for (let row = 1; row <= 8; row++) {
    // Initialize this row in the chessboard array.
    checkerboard[row] = [];

    // Select the 'line' div for this row.
    const lineDiv = await page.$(`xpath=//div[contains(@class, 'line')][${row}]`);

    // Check if lineDiv is null
    if (lineDiv === null) {
      throw new Error(`//div[contains(@class, 'line')][${row}] not found.`);
    }

    // Loop through each space in this row.
    for (let col = 1; col <= 8; col++) {
      // Select the 'img' element for this space.
      const space = await lineDiv.$(`xpath=./img[${col}]`);

      // Check if space is null
      if (space === null) {
        throw new Error(`./img[${col}] not found in //div[contains(@class, 'line')][${row}].`);
      }

      // Get the 'name' attribute of the 'img' element
      const name = await space.getAttribute('name');
      const src = await space.getAttribute('src');

      // Store the element handle in the chessboard array.
      checkerboard[row][col] = space;
    }
  }

  // First Move
  await page.waitForSelector("//p[text()='Select an orange piece to move.']");

  await checkerboard[6][2].click();
  await checkerboard[5][3].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Second Move
  await checkerboard[6][4].click();
  await checkerboard[5][5].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Third Move - Take blue piece
  await checkerboard[7][3].click();
  await checkerboard[5][5].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Confirm there's 1 less blue checker
  var blueCheckers = await page.$$('//img[@src="me1.gif"]');
  expect(blueCheckers.length).toBe(11);    

  // Fourth Move
  await checkerboard[7][5].click();
  await checkerboard[6][4].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Fifth Move
  await checkerboard[7][1].click();
  await checkerboard[6][2].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Sixth Move - Take blue piece
  await checkerboard[8][4].click();
  await checkerboard[6][2].click();

  await page.waitForSelector("//p[text()='Make a move.']");

  // Confirm there's 1 less blue checker
  var blueCheckers = await page.$$('//img[@src="me1.gif"]');
  expect(blueCheckers.length).toBe(10);

  // Restart Game
  await page.locator("//a[text()='Restart...']").click();

  await page.waitForLoadState("domcontentloaded");

  // Confirm all 12 checkers are present for both sides
  blueCheckers = await page.$$('//img[@src="me1.gif"]');
  var orangeCheckers = await page.$$('//img[@src="you1.gif"]');
  
  expect(blueCheckers.length).toBe(12); 
  expect(orangeCheckers.length).toBe(12); 

});
