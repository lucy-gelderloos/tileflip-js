'use strict';

// Needs:
//   - Form to select difficulty
//   - Button for new game (creates tiles)
//   - Click handler for tiles to change image
//   - Script for handling reset if no match is found
//   - Script for handling match found (reset, send image to discard pile)

let difficulty, allTiles, tilesClicked = 0, currentValue = 0, firstTileId = 0, firstTileValue = 0, secondTileId = 0, secondTileValue = 0;

const info = document.getElementById('clickTracker');
function tracker() {
    info.textContent = `firstTileId: ${firstTileId}; firstTileValue: ${firstTileValue}; secondTileId: ${secondTileId}; secondTileValue: ${secondTileValue}`;
}

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

    for(let i = 1; i <= tilesArray.length; i++) {
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
    if(firstTileId == 0) {
        firstTileId = tileId;
        firstTileValue = tileValue;
        flipTile(tileId, tileValue);
    } else if(secondTileId == 0) {
        secondTileId = tileId;
        secondTileValue = tileValue;
        flipTile(tileId, tileValue);
        // make ternary
        if(firstTileValue == secondTileValue) { matchFound(); } else { matchNotFound(); }
    }
    tracker();
    // if both firstTileId and secondTileId have a property, this should do nothing
}

function flipTile(tileId, tileValue) {
    let clickedTile = document.getElementById(`tile${tileId}`);
    clickedTile.classList.add('flipped');
    console.log('flipTile clickedTile',clickedTile);
    let tileImg = clickedTile.getElementsByTagName('img')[0];
    tileImg.src = `./img/tileFaces/tile${tileValue}.png`;
    tileImg.alt = `Tile ${tileValue}`;
}

function matchFound() {
    // put a delay here so the tiles don't instantly disappear
    let firstTile = document.getElementById(`tile${firstTileId}`);
    firstTile.removeChild(firstTile.firstChild);
    let secondTile = document.getElementById(`tile${secondTileId}`);
    secondTile.removeChild(secondTile.firstChild);

    reset();
}

function matchNotFound() {
    console.log('successfully called matchNotFound');
    let tiles = tileBoard.children;
    console.log('matchNotFound tiles',tiles);
    for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        console.log('matchNotFound tile',tile);
        if(tile.classList.contains('flipped')) {
            let tileImg = tile.getElementsByTagName('img')[0];
            console.log('matchNotFound tileImg',tileImg);
            tileImg.src = `./img/tileback.png`;
            tileImg.alt = `Tile ${tile.tileId} Back`;
        }
    }

    reset();
}

function reset() {
    firstTileId = 0;
    firstTileValue = 0;
    secondTileId = 0;
    secondTileValue = 0;
    tracker();
}
