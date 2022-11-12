'use strict';

const info = document.getElementById('clickTracker');
const difficultySelect = document.getElementById('selectDifficultyDropdown');
const newGameBtn = document.getElementById('newGameBtn');
const tileBoard = document.getElementById('tileBoard');
const scoreboard = document.getElementById('scoreboard');
const scorep = document.getElementById('scorep');
const discardPile = document.getElementById('discardPile');
const settingsDiv = document.getElementById('gameSettings');
const easyRadio = document.getElementById('easyRadio');
const mediumRadio = document.getElementById('mediumRadio');
const hardRadio = document.getElementById('hardRadio');

let difficulty, allTiles, firstTileId = 0, firstTileValue = 0, secondTileId = 0, secondTileValue = 0, attempts, matchesLeft, score = 0;
let easyMatchPoint = 50;
let medMatchPoint = 75;
let hardMatchPoint = 100;
let noMatchPenalty = -10;

easyRadio.addEventListener('change',function(event) { difficulty = event.target.value });
mediumRadio.addEventListener('change',function(event) { difficulty = event.target.value });
hardRadio.addEventListener('change',function(event) { difficulty = event.target.value });

newGameBtn.addEventListener('click',startNewGame);

function calculateScore() {
    let points;
    switch(difficulty) {
        case "16":{
            points = easyMatchPoint;
            break;
        }
        case "24":{
            points = medMatchPoint;
            break;
        }
        case "36":{
            points = hardMatchPoint
            break;
        }
        default:{
            points = medMatchPoint;
        }
    }
    score = (((difficulty / 2) - matchesLeft) * points) + (attempts * noMatchPenalty);
    scorep.textContent = `${score}`;
}

function startNewGame(event) {
    event.preventDefault();
    tileBoard.classList.remove('d16','d24','d36');
    if(discardPile.firstChild) {
        discardPile.removeChild(discardPile.firstChild);
    }
    generateTiles();
    generateBoard();
    attempts = 0;
    calculateScore();
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
    if(!difficulty) { difficulty = 24; }
    matchesLeft = difficulty / 2;
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

        // TODO: try getting rid of this last leve of divs and putting the 'front' and 'back' classes on the images
        // note that the element with the 'front' class will display by default and the element with the 'back' class will display on click, so for this use, the back of the tile should have the 'front' class and vice versa
        let tileFront = document.createElement('div');
        tileFront.className = 'back';
        
        let tileImg = document.createElement('img');
        tileImg.src = `./img/tileFaces/tile${Tile.allTiles[i].tileValue}.png`;
        tileImg.alt = `Tile value: ${Tile.allTiles[i].tileValue}`;
        tileImg.className = 'tileImg';

        let tileBack = document.createElement('div');
        tileBack.className = 'front';

        let tileBackImg = document.createElement('img');
        tileBackImg.src = `./img/tileback.png`;
        tileBackImg.alt = `Tile ${Tile.allTiles[i].tileId} Back`;
        tileBackImg.className = 'tileImg';

        tileFront.appendChild(tileImg);
        tileBack.appendChild(tileBackImg);
        tileFlipper.appendChild(tileFront);
        tileFlipper.appendChild(tileBack);
        tileDiv.appendChild(tileFlipper);
        tileBoard.appendChild(tileDiv);        
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
            // TODO: make ternary
            if(firstTileValue == secondTileValue) { 
                setTimeout(matchFound,500); 
            } else { 
                setTimeout(matchNotFound,1500);
                attempts++;
            }
        }
    }  
}

function flipTile(tileId) {
    let clickedTile = document.getElementById(`tile${tileId}`);
    clickedTile.classList.add('flipped');
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

    let discardImg;
    if(!discardPile.getElementsByTagName('img')[0]) {
        discardImg = document.createElement('img');
        discardPile.appendChild(discardImg);
    } else {
        discardImg = discardPile.getElementsByTagName('img')[0];
    }
    discardImg.src = `./img/tileFaces/tile${firstTileValue}.png`;
    discardImg.alt = 'Discard Pile';

    matchesLeft--;
    if(matchesLeft == 0) {
        alert(`All matches found in ${attempts} tries!`);
    }

    reset();
}

function matchNotFound() {
    let firstTile = document.getElementById(`tile${firstTileId}`);
    firstTile.classList.remove('flipped');
    
    let secondTile = document.getElementById(`tile${secondTileId}`);
    secondTile.classList.remove('flipped');

    reset();
}

function reset() {
    firstTileId = 0;
    firstTileValue = 0;
    secondTileId = 0;
    secondTileValue = 0;
    calculateScore();
}
