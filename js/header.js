const headerTilesDiv = document.getElementById('headerTilesDiv');
const gameTitleArr = ["T", "i", "l", "e", " ", "F", "l", "i", "p"];

class HeaderTile {
    constructor(tileValue) {
        this.tileValue = tileValue;
        HeaderTile.allHeaderTiles.push(this);
    }
}
HeaderTile.allHeaderTiles = [];

function generateHeaderTiles() {
    HeaderTile.allHeaderTiles = [];
    for(let i = 0; i < gameTitleArr.length; i++) {
        new HeaderTile(gameTitleArr[i]);
    }
}

function generateHeader() {
    while(headerTilesDiv.firstChild) {
        headerTilesDiv.removeChild(headerTilesDiv.firstChild);
    }

    for(let i = 0; i < HeaderTile.allHeaderTiles.length; i++) {
        let headerTileDiv = document.createElement('div');
        headerTileDiv.classList.add('tile', 'headerTile');
        
        let headerTileP = document.createElement('p');
        headerTileP.className = 'headerTileText';
        headerTileP.textContent = HeaderTile.allHeaderTiles[i].tileValue;

        let tileFlipper = document.createElement('div');
        tileFlipper.className = 'flipper';

        let headerTileFront = document.createElement('div');
        headerTileFront.classList.add('front', 'headerFront');

        let headerTileBack = document.createElement('div');
        headerTileBack.className = 'back';

        let headerTileBackImg = document.createElement('img');
        headerTileBackImg.src = `./img/tileback.png`;
        headerTileBackImg.alt = `${HeaderTile.tileValue}`;
        headerTileBackImg.className = 'tileImg';

        headerTileFront.appendChild(headerTileP);
        headerTileBack.appendChild(headerTileBackImg);
        tileFlipper.appendChild(headerTileFront);
        tileFlipper.appendChild(headerTileBack);
        headerTileDiv.appendChild(tileFlipper);
        headerTilesDiv.appendChild(headerTileDiv);
    }
}

generateHeaderTiles();
generateHeader();
