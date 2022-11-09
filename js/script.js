'use strict';

// Needs:
//   - Form to select difficulty
//   - Button for new game (creates tiles)
//   - Click handler for tiles to change image
//   - Script for handling reset if no match is found
//   - Script for handling match found (reset, send image to discard pile)

let difficulty, allTiles, tilesClicked = 0, currentValue = 0, firstTileId, firstTileValue, secondTileId, secondTileValue;

function selectDifficulty(event) {
    event.preventDefault();
}

const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click',startNewGame)

function startNewGame(event) {
    event.preventDefault();
    // TODO: this should pull difficulty from the form
    generateTiles(16);
    generateBoard();
}

const tileBoard = document.getElementById('tileBoard');

class Tile {
    constructor(tileId, tileValue) {
        this.tileId = tileId;
        this.tileValue = tileValue;
        Tile.allTiles.push(this);
    }
}
Tile.allTiles = [];

function generateTiles(difficulty) {
    difficulty = 16;
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

    for(let i = 0; i < tilesArray.length; i++) {
        new Tile(i, tilesArray[i]);
    }
}

function generateBoard() {
    // Consider: creating all 32 possible divs first, leave empty but with ID, then just change value/img when new game starts. Counterpoint: will divs havae a size, or will it be determined by the image?
    while(tileBoard.firstChild) {
        tileBoard.removeChild(tileBoard.firstChild);
    }
    for(let i in Tile.allTiles) {
        let tileDiv = document.createElement('div');
        tileDiv.id = `tile${Tile.allTiles[i].tileId}`;
        // keep an eye on this, since there will be overlap between ids and classes
        tileDiv.className = `tile${Tile.allTiles[i].tileValue}`;
        tileDiv.textContent = `Tile: ${Tile.allTiles[i].tileId}; Value: ${Tile.allTiles[i].tileValue}`;
        tileDiv.addEventListener('click', function(){ tileClick(Tile.allTiles[i].tileId, Tile.allTiles[i].tileValue); });

        let tileImg = document.createElement('img');
        tileImg.src = `./img/tileback.png`;
        tileImg.alt = `Tile ${Tile.allTiles[i].tileId} Back`;

        tileDiv.appendChild(tileImg);
        tileBoard.appendChild(tileDiv);        
    }
}

function tileClick(tileId, tileValue) {
    // sets the image of the current tile to the front image
    if(!firstTileId) {
        firstTileId = tileId;
        firstTileValue = tileValue;
    } else if(!secondTileId) {
        secondTileId = tileId;
        secondTileValue = tileValue;
    }
    // maybe make this a separate (toggle?) function that gets called depending on the status of firstTileId/secondTileId - don't want to be able to flip over more than two tiles at a time
    let clickedTile = document.getElementById(tileId);
    clickedTile.removeChild(clickedTile.firstChild);
    let frontImg = document.createElement('img');
    frontImg.src = `./img/tileFaces/${tileValue}.png`;
    frontImg.alt = `${tileValue}`;
    clickedTile.appendChild(frontImg);
}

function matchFound() {
    let firstTile = document.getElementById(firstTileId);
    firstTile.removeChild(firstTile.firstChild);
    let secondTile = document.getElementById(secondTileId);
    secondTile.removeChild(secondTile.firstChild);
}

function matchNotFound() {
  // when a match is not found, 
}

function reset() {
    firstTileId = null;
    firstTileValue = null;
    secondTileId = null;
    secondTileValue = null;
}
