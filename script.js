'use strict';

// Needs:
//   - Form to select difficulty
//   - Button for new game (creates tiles)
//   - Click handler for tiles to change image
//   - Script for handling reset if no match is found
//   - Script for handling match found (reset, send image to discard pile)

let difficulty, allTiles;

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
    while(tileBoard.firstChild) {
        tileBoard.removeChild(tileBoard.firstChild);
    }
    for(let i in Tile.allTiles) {
        let tileDiv = document.createElement('div');
        tileDiv.id = Tile.allTiles[i].tileId;
        tileDiv.class = `tile${Tile.allTiles[i].tileValue}`;
        tileDiv.textContent = `Tile: ${Tile.allTiles[i].tileId}; Value: ${Tile.allTiles[i].tileValue}`;
        tileBoard.appendChild(tileDiv);        
    }
}

