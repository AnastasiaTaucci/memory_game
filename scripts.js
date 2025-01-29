// Game variables
let symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍑'];
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;
let isProcessing = false; // Flag to disable clicks during processing
let flipSound = new Audio('./sounds/flip.mp3');
let matchSound = new Audio('./sounds/success.mp3');
let congratsSound = new Audio('./sounds/congrats.mp3');

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// Function to create cards
function createCard (symbol) {
  let card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;

  //determine the selected color
  let cIndex = document.getElementById("chosen-color").selectedIndex;
  let cValue =  document.getElementById("chosen-color").options[cIndex].value;

  card.classList.add(cValue);

  return card;
};

// Function to initialize the game
function initializeGame () {
  // Reset game variables
  moves = 0;
  flippedCards = [];
  matchedPairs = 0;
  isProcessing = false;


  // Update score display
  scoreDisplay.textContent = "Moves: " + moves;

  // Shuffle symbols
  let deck = symbols.concat(symbols);

  for (let i = 0; i < deck.length; i++) {
    let randomIndex1 = Math.floor(deck.length * Math.random());
    let randomIndex2 = Math.floor(deck.length * Math.random());

    let temp = deck[randomIndex1];
    deck[randomIndex1] = deck[randomIndex2];
    deck[randomIndex2] = temp;    
  }

  // Clear the board
  gameBoard.innerHTML = ''; 

  //create array of divs and appending them to the gameboard div
  deck.map(createCard).forEach(card => gameBoard.appendChild(card));

};

// Event handling: flipping cards
gameBoard.addEventListener('click', (event) => {
  let clickedCard = event.target;

  if ( isProcessing || 
    !clickedCard.classList.contains('card') || 
    clickedCard.classList.contains('flipped')) {
    return;
  }

  //plays flip sound when a card is flipped
  flipSound.currentTime = 0; // Ensure sound plays fully each time
  flipSound.play();

  clickedCard.classList.add('flipped');
  clickedCard.textContent = clickedCard.dataset.symbol;
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    moves++;
    scoreDisplay.textContent = "Moves:" + moves;
    let firstCard = flippedCards[0];
    let secondCard = flippedCards[1];

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      matchedPairs++;
      matchSound.currentTime = 0; // ensures sound plays fully each time
      matchSound.play();
      flippedCards = [];
      if (matchedPairs === symbols.length) {
        congratsSound.play();
        setTimeout(() => {
          alert("🎉 Good Job! You completed the game in " + moves + " moves.");
        },250)
      }
    } else {
      isProcessing = true;
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.classList.remove('flipped');
        secondCard.textContent = '';
        flippedCards = [];
        isProcessing = false;
      }, 700);
    }
  }
});



function changeColor() {

  //determine the selected color
  let cIndex = document.getElementById("chosen-color").selectedIndex;
  let cValue =  document.getElementById("chosen-color").options[cIndex].value;
  
  //get all cards and update their color
  document.querySelectorAll(".card").forEach(card => {
    // removing all previous color classes
    card.classList.remove("green", "blue", "pink");

    card.classList.add(cValue);
  })


  card.classList.add(cValue);
}

//choose color event listener
document.getElementById("chosen-color").addEventListener('change', changeColor);


// Restart button event listener
restartBtn.addEventListener('click', () => {
  initializeGame();
});


// Initialize the game on page load
window.addEventListener('load', initializeGame());