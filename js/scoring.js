// functions to calculate average number of moves taken to win
// - perfectMemory calculates how many moves if the player has a perfect memory
// - bruteForce calculates how many moves if the player is just going through the tiles in order repeatedly until all matches are found
// - getScores calls both perfectMemory & bruteForce, then processes the scores
// not sure how to calculate *average* score - it's probably not just halfway between the average worst and best scores, but that's what I'm going to use to start

const easyBtn = document.getElementById('easyScoreBtn');
easyBtn.addEventListener('click', function(){ getScores(16); });
const mediumBtn = document.getElementById('mediumScoreBtn');
mediumBtn.addEventListener('click', function(){ getScores(24); });
const hardBtn = document.getElementById('hardScoreBtn');
hardBtn.addEventListener('click', function(){ getScores(36); });
const scoreResult = document.getElementById('scoreResult');

let perfectArr = [], bruteArr = [];
let perfectAverage = 0, bruteAverage = 0

function getScores(difficulty) {
    perfectMemory(difficulty);
    bruteForce(difficulty);
    perfectAverage = getMean(perfectArr);
    bruteAverage = getMean(bruteArr);
    scoreResult.textContent = `${difficulty}: perfectAverage ${perfectAverage}; bruteAverage ${bruteAverage}`;
}

function createTilesArray(difficulty) {
    let tilesArray = [], k = 0;
    for(let i = 1; i <= difficulty / 2; i++) {
        tilesArray.push(i);
        tilesArray.push(i);
    }
    let len = tilesArray.length, j, t;
    while(len) {
        j = Math.floor(Math.random() * len--);
        t = tilesArray[len];
        tilesArray[len] = tilesArray[j];
        tilesArray[j] = t;
    }
    return tilesArray
}

function perfectMemory(difficulty) {
    for(let i = 0; i < 100; i++) {
        let tilesArr = createTilesArray(difficulty), holdingArr = [], matchesLeft = difficulty / 2, attempts = 0;
        while(matchesLeft > 0) {
            if(tilesArr.length > 1 && tilesArr[0] == tilesArr[1]) {
                tilesArr.splice(0, 2);
                matchesLeft--;
            } else {
                if(holdingArr.includes(tilesArr[0])) {
                    tilesArr.splice(0, 1);
                    matchesLeft--;
                } else {
                    holdingArr.push(tilesArr[0]);
                    tilesArr.splice(0, 1);
                    attempts++;
                    if(holdingArr.includes(tilesArr[0])) {
                        tilesArr.splice(0,1);
                        matchesLeft--;
                    } else {
                        holdingArr.push(tilesArr[0]);
                        tilesArr.splice(0,1);
                    }
                }
            }
        }
        perfectArr.push(attempts);
    }
    return perfectArr;
}

function bruteForce(difficulty) {
    for(let i = 0; i < 100; i++) {
        let tilesArr = createTilesArray(difficulty), matchesLeft = difficulty / 2, attempts = 0;
        while(matchesLeft > 0) {
            currentTile = tilesArr[0];
            for(let j = 1; j < tilesArr.length; j++) {
                if(currentTile == tilesArr[j]) {
                    tilesArr.splice(j, 1);
                    tilesArr.splice(0, 1);
                    matchesLeft--;
                    break;
                } else {
                    attempts++;
                }
            }
        }
        bruteArr.push(attempts);
    }
    return bruteArr;
}

function getMean(array) {
    let total = 0;
    for(let i = 0; i < array.length; i++) {
        total += array[i];
    }
    return total / array.length;
}

// getScores(16);
