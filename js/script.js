'use strict';

// Needs:
//   x Form to select difficulty
//   x Button for new game (creates tiles)
//   x Click handler for tiles to change image
//   x Script for handling reset if no match is found
//   x Script for handling match found
//   x Script for sending found matches to discard pile
//   x Attempt/score counter

// For the flip animation, need:
// - a container div ('tile')
// - a flipper div ('flipper')
// - a front div ('front')
// - a back div ('back')

const info = document.getElementById('clickTracker');
const difficultySelect = document.getElementById('selectDifficultyDropdown');
const newGameBtn = document.getElementById('newGameBtn');
const tileBoard = document.getElementById('tileBoard');
const scoreboard = document.getElementById('scoreboard');
const discardPile = document.getElementById('discardPile');

let difficulty, allTiles, tilesClicked = 0, firstTileId = 0, firstTileValue = 0, secondTileId = 0, secondTileValue = 0, attempts, tilesLeft;

difficultySelect.addEventListener('change',function(event) {
    difficulty = event.target.value;
});

newGameBtn.addEventListener('click',startNewGame)

function tracker() {
    info.textContent = `firstTileId: ${firstTileId}; firstTileValue: ${firstTileValue}; secondTileId: ${secondTileId}; secondTileValue: ${secondTileValue}; attempts: ${attempts}`;
}

function startNewGame(event) {
    event.preventDefault();
    tileBoard.classList.remove('d8','d16','d36')
    generateTiles();
    generateBoard();
    attempts = 0;
}

class Tile {
    constructor(tileId, tileValue) {
        this.tileId = tileId;
        this.tileValue = tileValue;
        Tile.allTiles.push(this);
    }
}
Tile.allTiles = [];

function generateTiles() {
    // TODO: make ternary
    if(!difficulty) { difficulty = 16; }
    tilesLeft = difficulty / 2;
    let tilesArray = [], k = 0;
    for(let i = 1; i <= difficulty / 2; i++) {
        tilesArray[k] = i;
        k++;
        tilesArray[k] = i;
        k++;
    }

    // https://bost.ocks.org/mike/shuffle/
    let len = tilesArray.length, j, t;
    while(len) {
        j = Math.floor(Math.random() * len--);
        t = tilesArray[len];
        tilesArray[len] = tilesArray[j];
        tilesArray[j] = t;
    }

    Tile.allTiles = [];
    for(let i = 1; i <= tilesArray.length; i++) {
        new Tile(i, tilesArray[i - 1]);
    }
}

function generateBoard() {
    while(tileBoard.firstChild) {
        tileBoard.removeChild(tileBoard.firstChild);
    }

    tileBoard.classList.add(`d${difficulty}`);

    for(let i = 0; i < Tile.allTiles.length; i++) {
        let tileDiv = document.createElement('div');
        tileDiv.id = `tile${Tile.allTiles[i].tileId}`;
        tileDiv.className = 'tile';
        tileDiv.addEventListener('click', function(){ tileClick(Tile.allTiles[i].tileId, Tile.allTiles[i].tileValue); });

        let tileFlipper = document.createElement('div');
        tileFlipper.className = 'flipper';

        let tileFront = document.createElement('div');
        tileFront.className = 'back';
        
        let tileImg = document.createElement('img');
        tileImg.src = `./img/tileFaces/tile${Tile.allTiles[i].tileValue}.png`;
        tileImg.alt = `Tile value: ${Tile.allTiles[i].tileValue}`;

        let tileBack = document.createElement('div');
        tileBack.className = 'front';

        let tileBackImg = document.createElement('img');
        tileBackImg.src = `./img/tileback.png`;
        tileBackImg.alt = `Tile ${Tile.allTiles[i].tileId} Back`;

        tileFront.appendChild(tileImg);
        tileBack.appendChild(tileBackImg);
        tileFlipper.appendChild(tileFront);
        tileFlipper.appendChild(tileBack);
        tileDiv.appendChild(tileFlipper);
        tileBoard.appendChild(tileDiv);        
    }

    if(!discardPile.getElementsByTagName('img')[0]) {
        let discardImg = document.createElement('img');
        discardImg.src = './img/matchFound.png';
        discardImg.alt = 'Empty Discard Pile';
        discardPile.appendChild(discardImg);
    } else {
        let discardImg = discardPile.getElementsByTagName('img')[0];
        discardImg.src = './img/matchFound.png';
        discardImg.alt = 'Empty Discard Pile';
    }
}

function tileClick(tileId, tileValue) {
    let clickedTile = document.getElementById(`tile${tileId}`);
    if(!clickedTile.classList.contains('flipped') && !clickedTile.classList.contains('found')) {
        if(firstTileId == 0) {
            firstTileId = tileId;
            firstTileValue = tileValue;
            flipTile(tileId, tileValue);
        } else if(secondTileId == 0) {
            secondTileId = tileId;
            secondTileValue = tileValue;
            flipTile(tileId, tileValue);
            attempts++;
            // TODO: make ternary
            if(firstTileValue == secondTileValue) { 
                setTimeout(matchFound,500); 
            } else { 
                setTimeout(matchNotFound,1500);  
            }
        }
    }    
    tracker();
}

function flipTile(tileId, tileValue) {
    let clickedTile = document.getElementById(`tile${tileId}`);
    clickedTile.classList.add('flipped');
    // let tileImg = clickedTile.getElementsByTagName('img')[0];
    // tileImg.src = `./img/tileFaces/tile${tileValue}.png`;
    // tileImg.alt = `Tile ${tileValue}`;
}

function matchFound() {
    // TODO: is there a way to do this more efficiently?
    let firstTile = document.getElementById(`tile${firstTileId}`);
    firstTile.classList.replace('flipped','found');
    let firstFlipper = firstTile.getElementsByClassName('flipper')[0];
    let firstBack = firstFlipper.getElementsByClassName('front')[0];
    let firstTileImg = firstBack.getElementsByTagName('img')[0];
    firstTileImg.src = `./img/matchfound.png`;
    firstTileImg.alt = `Match found!`;
    
    let secondTile = document.getElementById(`tile${secondTileId}`);
    secondTile.classList.replace('flipped','found');
    let secondFlipper = secondTile.getElementsByClassName('flipper')[0];
    let secondBack = secondFlipper.getElementsByClassName('front')[0];
    let secondTileImg = secondBack.getElementsByTagName('img')[0];
    secondTileImg.src = `./img/matchfound.png`;
    secondTileImg.alt = `Match found!`;

    let discardImg = discardPile.getElementsByTagName('img')[0];
    discardImg.src = `./img/tileFaces/tile${firstTileValue}.png`;
    discardImg.alt = 'Discard Pile';

    tilesLeft--;
    if(tilesLeft == 0) {
        alert(`All matches found in ${attempts} tries!`);
    }

    reset();
}

function matchNotFound() {
    let firstTile = document.getElementById(`tile${firstTileId}`);
    // let firstTileImg = firstTile.getElementsByTagName('img')[0];
    // firstTileImg.src = `./img/tileback.png`;
    // firstTileImg.alt = `Tile ${firstTileId} Back`;
    firstTile.classList.remove('flipped');
    
    let secondTile = document.getElementById(`tile${secondTileId}`);
    // let secondTileImg = secondTile.getElementsByTagName('img')[0];
    // secondTileImg.src = `./img/tileback.png`;
    // secondTileImg.alt = `Tile ${secondTileId} Back`;
    secondTile.classList.remove('flipped');

    reset();
}

function reset() {
    firstTileId = 0;
    firstTileValue = 0;
    secondTileId = 0;
    secondTileValue = 0;
    tracker();
}
