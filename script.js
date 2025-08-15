const keyboard = document.getElementById('keyboard');
const board = document.getElementById('board');
const keys = keyboard.querySelectorAll('.key');

const correctWord = "ERACS"; // The word to guess, in uppercase
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

keys.forEach(key => {
  key.addEventListener('click', () => {
    if (isGameOver) return;
    handleKeyPress(key.textContent);
  });
});

function handleKeyPress(key) {
  const rows = board.querySelectorAll('.row');
  const tiles = rows[currentRow].querySelectorAll('.tile');

  if (key === '⌫') {
    if (currentTile > 0) {
      currentTile--;
      tiles[currentTile].textContent = '';
      tiles[currentTile].classList.remove('filled');
    }
  } else if (key === 'ENTER') {
    if (currentTile === 5) {
      const guess = Array.from(tiles).map(t => t.textContent).join('');
      checkGuess(guess.toUpperCase(), tiles);
    }
  } else if (/^[A-Z]$/.test(key) && currentTile < 5) {
    tiles[currentTile].textContent = key;
    tiles[currentTile].classList.add('filled');
    currentTile++;
  }
}

function checkGuess(guess, tiles) {
  const answer = correctWord.split('');
  const guessLetters = guess.split('');

  guessLetters.forEach((letter, i) => {
    if (letter === answer[i]) {
      tiles[i].style.backgroundColor = '#538d4e'; // green
      answer[i] = null;
      guessLetters[i] = null;
    }
  });

  guessLetters.forEach((letter, i) => {
    if (letter && answer.includes(letter)) {
      tiles[i].style.backgroundColor = '#b59f3b'; // yellow
      answer[answer.indexOf(letter)] = null;
    } else if (letter) {
      tiles[i].style.backgroundColor = '#3a3a3c'; // gray
    }
  });

  if (guess === correctWord) {
    const code = generateCode();
    showWinMessage(code);
    isGameOver = true;
  } else if (currentRow === 5) {
    showLoseMessage();
    isGameOver = true;
  } else {
    currentRow++;
    currentTile = 0;
  }
}

function generateCode() {
  return "thatsalilbetter";
}

function showWinMessage(code) {
  // Show blast.gif centered on the screen
  const blastImg = document.createElement('img');
  blastImg.src = 'blast.gif';
  blastImg.alt = 'Blast!';
  blastImg.style.position = 'fixed';
  blastImg.style.top = '50%';
  blastImg.style.left = '50%';
  blastImg.style.transform = 'translate(-50%, -50%)';
  blastImg.style.zIndex = '2000';
  blastImg.style.width = '400px'; // Make it bigger!
  blastImg.style.height = '400px'; // Optional: keep aspect ratio if needed
  blastImg.style.pointerEvents = 'none';
  document.body.appendChild(blastImg);

  // After 1 second, remove gif and trigger fall effect
  setTimeout(() => {
    blastImg.remove();
    document.querySelector('.game-board').classList.add('fall');
    document.querySelector('.keyboard').classList.add('fall');
    document.querySelector('header').classList.add('fall');

    // Show win popup after 2 seconds
    setTimeout(() => {
      const overlay = document.createElement('div');
      overlay.innerHTML = `
        <div class="end-screen">
          <div>YOU KINDA WON</div>
          <p>sorry you were too late the 10 prizes have been claimed but...</p>
          <p>we can give you a code for 15% off:</p>
          <div class="code" id="reward-code">${code}</div>
          <button class="retry-button" id="copy-code-btn">Copy Code</button>
          <p style="font-size: 14px; margin-top: 10px;">Copy this code and use it at checkout.</p>
          <a href="https://scaresociety.org/collections/frontpage" class="redeem-button" target="_blank">REDEEM HERE</a>
        </div>`;
      document.body.appendChild(overlay);

      // Add copy functionality
      document.getElementById('copy-code-btn').onclick = function() {
        const codeText = document.getElementById('reward-code').textContent;
        navigator.clipboard.writeText(codeText).then(() => {
          this.textContent = "Copied!";
          setTimeout(() => { this.textContent = "Copy Code"; }, 1200);
        });
      };
    }, 2000);
  }, 1000); // blast.gif duration
}


function showLoseMessage() {
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div class="end-screen">
      <div>Game Over</div>
      <p>You didn't get it this time.</p>
      <button class="retry-button" onclick="location.reload()">Try Again</button>
    </div>`;
  document.body.appendChild(overlay);
}
// Hint & Rules Buttons
document.getElementById('hint-btn').addEventListener('click', showHint);
document.getElementById('rules-btn').addEventListener('click', showRules);

function showHint() {
  const hints = [
    " you thought you would get a hint?.",
    " a hint? no i meant a mint.",
    " fr???????",
    " smh the easy way huh couldnt be me"
  ];
  const randomHint = hints[Math.floor(Math.random() * hints.length)];
  showPopup("Hint", randomHint);
}

function showRules() {
  const rules = `
  <p>This is <strong>SCAREDLE</strong>. Not Wordle. Not affiliated. Not the same.</p>
    <p>Guess the <strong>5-letter</strong> word in 6 tries.<br/>
    After each guess, the tiles will change color to show how close you are:</p>
    <ul style="text-align: left; margin: 10px auto; max-width: 300px;">
      <li><span style="color:#538d4e;">Green</span> = Correct letter, correct spot</li>
      <li><span style="color:#b59f3b;">Yellow</span> = Correct letter, wrong spot</li>
      <li><span style="color:#3a3a3c;">Gray</span> = Letter not in the word</li>
    </ul>Only the first <strong>10 winners</strong> get a code.</p>
    <p>Each code will work for a single redemption of a single Skull Cap or Multi-Scare Socks.(not including shipping)</p>
    <p>You’ll get a unique code to redeem for a free <strong>Scare Skull Cap</strong> or <strong>Multi-Scare Socks</strong>.</p>
    <p>Win to unlock your secret reward code.</p>
  `;
  showPopup("How to Play", rules);
}

function showPopup(title, message) {
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-box">
      <div class="popup-header">${title}</div>
      <div class="popup-content">${message}</div>
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>`;
  document.body.appendChild(popup);
}
window.addEventListener('DOMContentLoaded', () => {
  showPopup("Welcome to SCAREDLE", `
    <p>This is <strong>SCAREDLE</strong>. Not Wordle. Not affiliated. Not the same.</p>
    <p>Tap the <strong>“?”</strong> at the top if you need help on how to play.</p>
    <p><strong>This is a limited giveaway:</strong> Only the first <strong>10 people</strong> to solve the challenge will receive a code to redeem one of the following:</p>
    <ul style="text-align: left; max-width: 300px; margin: 10px auto;">
      <li>🎁 A free <strong>Scare Skull Cap</strong></li>
      <li>🎁 Or a free <strong>Multi-Scare Socks</strong></li>
    </ul><p>Each code will work for a single redemption of a single Skull Cap or Multi-Scare Socks.(not including shipping)</p>
    <p>Every winner gets a unique code. Each code is individually tracked.</p>
    <p>Thanks for playing — and good luck.</p>
  `);
});

