'use strict';

// Needs:
//   x Form to select difficulty
//   x Button for new game (creates tiles)
//   x Click handler for tiles to change image
//   x Script for handling reset if no match is found
//   x Script for handling match found
//   x Script for sending found matches to discard pile
//   - Attempt/score counter

let difficulty, allTiles, tilesClicked = 0, firstTileId = 0, firstTileValue = 0, secondTileId = 0, secondTileValue = 0, attempts, tilesLeft;

const info = document.getElementById('clickTracker');
function tracker() {
    info.textContent = `firstTileId: ${firstTileId}; firstTileValue: ${firstTileValue}; secondTileId: ${secondTileId}; secondTileValue: ${secondTileValue}; attempts: ${attempts}`;
}

const difficultySelect = document.getElementById('selectDifficultyDropdown');
difficultySelect.addEventListener('change',function(event) {
    difficulty = event.target.value;
});

const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click',startNewGame)

function startNewGame(event) {
    event.preventDefault();
    generateTiles(difficulty);
    generateBoard();
    attempts = 0;
}

const tileBoard = document.getElementById('tileBoard');
const scoreboard = document.getElementById('scoreboard');
const discardPile = document.getElementById('discardPile');

class Tile {
    constructor(tileId, tileValue) {
        this.tileId = tileId;
        this.tileValue = tileValue;
        Tile.allTiles.push(this);
    }
}
Tile.allTiles = [];

function generateTiles(difficulty) {
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

    for(let i = 0; i < Tile.allTiles.length; i++) {
        let tileDiv = document.createElement('div');
        tileDiv.id = `tile${Tile.allTiles[i].tileId}`;
        // keep an eye on this, since there will be overlap between ids and classes
        // tileDiv.className = `tile${Tile.allTiles[i].tileValue}`;
        tileDiv.className = 'tile';
        // tileDiv.textContent = `Tile: ${Tile.allTiles[i].tileId}; Value: ${Tile.allTiles[i].tileValue}`;
        tileDiv.addEventListener('click', function(){ tileClick(Tile.allTiles[i].tileId, Tile.allTiles[i].tileValue); });

        let tileImg = document.createElement('img');
        tileImg.src = `./img/tileback.png`;
        tileImg.alt = `Tile ${Tile.allTiles[i].tileId} Back`;

        tileDiv.appendChild(tileImg);
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
                matchFound(); 
            } else { 
                setTimeout(matchNotFound,2000);  
            }
        }
    }    
    tracker();
}

function flipTile(tileId, tileValue) {
    let clickedTile = document.getElementById(`tile${tileId}`);
    clickedTile.classList.add('flipped');
    let tileImg = clickedTile.getElementsByTagName('img')[0];
    tileImg.src = `./img/tileFaces/tile${tileValue}.png`;
    tileImg.alt = `Tile ${tileValue}`;
}

function matchFound() {
    // TODO: is there a way to do this more efficiently?
    let firstTile = document.getElementById(`tile${firstTileId}`);
    firstTile.classList.replace('flipped','found');
    let firstTileImg = firstTile.getElementsByTagName('img')[0];
    firstTileImg.src = `./img/matchfound.png`;
    firstTileImg.alt = `Match found!`;
    
    let secondTile = document.getElementById(`tile${secondTileId}`);
    secondTile.classList.replace('flipped','found');
    let secondTileImg = secondTile.getElementsByTagName('img')[0];
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
    let firstTileImg = firstTile.getElementsByTagName('img')[0];
    firstTileImg.src = `./img/tileback.png`;
    firstTileImg.alt = `Tile ${firstTileId} Back`;
    firstTile.classList.remove('flipped');
    
    let secondTile = document.getElementById(`tile${secondTileId}`);
    let secondTileImg = secondTile.getElementsByTagName('img')[0];
    secondTileImg.src = `./img/tileback.png`;
    secondTileImg.alt = `Tile ${secondTileId} Back`;
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
