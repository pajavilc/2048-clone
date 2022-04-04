let grid;
let gameInfo;
let highscore;
let turnAnimationTime //= 100;
let scoreAnimationTime //= 700;
let end;
let scoreHolder;
let highscoreHolder;
let scoreAnimHolder;

function loadGame() {
    window.turnAnimationTime = 120;
    window.scoreAnimationTime = 700;
    window.grid = [...document.querySelectorAll('#grid .gridRow')].map(el => el.children);
    window.scoreHolder = document.querySelector('#score .value');
    window.scoreAnimHolder = document.querySelector('#score .score_add');
    window.highscoreHolder = document.querySelector('#best .value')
    window.gameInfo = JSON.parse(localStorage.getItem('gameInfo'));
    window.highscore = localStorage.getItem('highscore') || 0;
    if (localStorage.getItem('end') === 'true') {
        newGame();
    }

    document.querySelector('#endPrompt button').addEventListener('click', newGame);

    if (window.gameInfo === null) {
        newGame();
        window.gameInfo = JSON.parse(localStorage.getItem('gameInfo'));
    }
    else {
        const _gridInfo = window.gameInfo.grid;
        render(_gridInfo);
        renderScore();
    }

    window.scoreHolder.innerText = window.gameInfo.score;
    window.highscoreHolder.innerText = window.highscore;
}

function newGame() {

    let _grid = new Array(4).fill(-1).map(() => new Array(4).fill(-1))
    const firstpos = [randomPos(), randomPos()];
    const secondpos = [randomPos(), randomPos()];
    window.end = false;
    document.getElementById('endPrompt').classList.remove('show')
    if (firstpos === secondpos) {
        secondpos[1] = (secondpos[1] + 1) % 4
    }

    _grid[firstpos[0]][firstpos[1]] = 2;
    _grid[secondpos[0]][secondpos[1]] = 2;

    localStorage.setItem('gameInfo', JSON.stringify({
        score: 0,
        grid: _grid
    }));
    window.gameInfo = {
        score: 0,
        grid: _grid
    }
    window.end = false;
    render(window.gameInfo.grid);
    renderScore();
}

function playedTurn(e) {
    if (window.end === true) {
        return
    }
    const [score, animation, gridChanged, mergedTiles] = proccessKeyPress(e);
    if (!gridChanged) return
    animateScore(score);
    animate(e.key, animation);
    setTimeout(() => {
        render(window.gameInfo.grid);
        const isEnd = createElementAndMerge(mergedTiles)
        render(window.gameInfo.grid);
        if (isEnd === false) {
            endGame();
        }
        saveGame();
    }, window.turnAnimationTime);
}


function proccessKeyPress(e) {
    const key = e.key;

    let animation;
    let score;
    let gridChanged;
    let mergedTiles
    //using rotated pushDown function 
    switch (key) {
        case 'ArrowUp': {
            const _grid = window.gameInfo.grid;
            reverseRows(_grid);
            transpose(_grid);
            transpose(_grid);
            [score, animation, gridChanged, mergedTiles] = pushedDown();
            transpose(_grid);
            transpose(_grid);
            reverseRows(_grid);

            reverseRows(mergedTiles);
            transpose(mergedTiles);
            transpose(mergedTiles);
            break;
        }
        case 'ArrowDown': {
            [score, animation, gridChanged, mergedTiles] = pushedDown();
            break;
        }
        case 'ArrowLeft': {
            const _grid = window.gameInfo.grid;
            transpose(_grid);
            reverseRows(_grid);
            [score, animation, gridChanged, mergedTiles] = pushedDown();
            reverseRows(_grid);
            transpose(_grid);

            reverseRows(mergedTiles);
            transpose(mergedTiles);
            break;
        }
        case 'ArrowRight': {
            const _grid = window.gameInfo.grid;
            reverseRows(_grid);
            transpose(_grid);
            [score, animation, gridChanged, mergedTiles] = pushedDown();
            transpose(_grid);
            reverseRows(_grid);

            transpose(mergedTiles);
            reverseRows(mergedTiles);
            break;
        }
        default: {
            return [-1];
        }
    }
    e.preventDefault()
    return [score, animation, gridChanged, mergedTiles]
}




function pushedDown() {
    let score = 0;
    const gridInfo = window.gameInfo.grid;
    let mergedTiles = [[], [], [], []];
    let anim = [[], [], [], []];
    let gridChanged = false;
    for (let i = 0; i < 4; i++) {

        let row = gridInfo[i];
        let rowAnim = [-1, -1, -1, -1];
        let wasChanged = [false, false, false, false];
        for (let j = 3; j >= 0; j--) {
            if (row[j] === -1) {
                continue;
            }
            const num = row[j];
            //checking row to be pushed
            for (let k = j + 1; k <= 3; k++) {
                if (row[k] === -1) {
                    if (k !== 3) {
                        continue;
                    }
                    //element got to wall
                    row[j] = -1;
                    row[k] = num;
                    rowAnim[j] = k;
                    gridChanged = true;
                    break;
                }

                if (row[k] === num) {
                    if (wasChanged[k] === true) {
                        //element j positioned before elemen k 
                        row[j] = -1;
                        row[k - 1] = num;
                        rowAnim[j] = k - 1;
                        break;
                    }
                    //element j got added to element k
                    row[j] = -1;
                    row[k] = num * 2;
                    score += num * 2;
                    wasChanged[k] = true;
                    rowAnim[j] = k;
                    gridChanged = true;
                    break;
                }
                else {

                    //element j positioned before elemen k
                    row[j] = -1;
                    row[k - 1] = num;
                    rowAnim[j] = k - 1;
                    if (k - 1 !== j) gridChanged = true;
                    break;
                }

            }
        }
        anim[i] = rowAnim;
        mergedTiles[i] = wasChanged;
    }
    return [score, anim, gridChanged, mergedTiles];
}



function animate(key, animation) {
    switch (key) {
        case 'ArrowUp': {
            reverseRows(animation);
            transpose(animation);
            transpose(animation);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (animation[i][j] === -1) continue
                    window.grid[i][j].classList.add(`animate`);
                    const moveAmount = 112 * (3 - animation[i][j] - j);
                    window.grid[i][j].children[0].style.top = `${moveAmount}px`;
                }
            }
            break;
        }
        case 'ArrowDown': {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (animation[i][j] === -1) continue;
                    window.grid[i][j].classList.add(`animate`);
                    const moveAmount = 112 * (animation[i][j] - j);
                    window.grid[i][j].children[0].style.top = `${moveAmount}px`;
                }
            }
            break;
        }
        case 'ArrowLeft': {
            //rotate
            reverseRows(animation);
            transpose(animation);

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (animation[i][j] === -1) continue
                    window.grid[i][j].classList.add(`animate`);
                    const moveAmount = 112 * (3 - animation[i][j] - i);
                    window.grid[i][j].children[0].style.left = `${moveAmount}px`;
                }
            }
            break;
        }
        case 'ArrowRight': {
            //rotate
            transpose(animation);
            reverseRows(animation);

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (animation[i][j] === -1) continue
                    window.grid[i][j].classList.add(`animate`);
                    const moveAmount = 112 * (animation[i][j] - i);
                    window.grid[i][j].children[0].style.left = `${moveAmount}px`;
                }
            }
            break;
        }
        default: {
            return;
        }
    }

}



function animateScore(score) {
    if (score === 0) return
    window.gameInfo.score += score;
    window.scoreAnimHolder.innerText = `+${score}`;
    window.scoreAnimHolder.classList.add('show');
    setTimeout(() => {
        window.scoreAnimHolder.classList.remove('show')
    }, window.scoreAnimationTime);
    renderScore();

}

function renderScore() {
    if (window.gameInfo.score > window.highscore) {
        window.highscore = window.gameInfo.score;
        localStorage.setItem('highscore', window.highscore);
    }

    window.scoreHolder.innerText = window.gameInfo.score;
    window.highscoreHolder.innerText = window.highscore;
}


function createElementAndMerge(mergedTiles) {
    const _grid = window.gameInfo.grid;
    const grid = window.grid;
    let index = 0;
    let arr = [];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (_grid[i][j] === -1) {
                arr[index] = i * 4 + j;
                index++;
            }
        }
    }
    let N = arr.length;
    if (N <= 0) {
        if (checkForEnd() === true) {
            return false
        }
    }
    const [pos, number] = getRandomElement(N - 1);
    const position = arr[pos];
    let pos1 = Math.floor(position / 4);
    let pos2 = position % 4;
    _grid[pos1][pos2] = number;
    const el = grid[pos1][pos2].children[0]
    el.innerText = number;
    el.classList.add('animate_new');

    mergeAnim(mergedTiles)
    setTimeout(() => {
        el.classList.remove('animate_new');
    }, 250, el)

    if (N === 1) {
        if (checkForEnd() === true) {
            return false
        }
    }
    return true
}
function mergeAnim(mergedTiles) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mergedTiles[i][j] === true) {
                window.grid[i][j].children[0].classList.add('animation_merge');
                setTimeout(() => {
                    window.grid[i][j].children[0].classList.remove('animation_merge');
                }, 250, i, j)
            }
        }
    }
}
function render(_grid) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = _grid[i][j];
            window.grid[i][j].children[0].innerText = String(value);
            window.grid[i][j].classList.remove('animate');
            window.grid[i][j].children[0].style.top = '0px';
            window.grid[i][j].children[0].style.left = '0px';
            window.grid[i][j].className = `gridCell ${(value === -1 ? 'hide' : (`cellVal_${value}`))}`
        }
    }
}

function checkForEnd() {
    const _grid = window.gameInfo.grid;
    let isEnd = true;
    for (let i = 0; i < 4 && isEnd; i++) {
        for (let j = 0; j < 3; j++) {
            if (_grid[i][j] === _grid[i][j + 1]) {
                isEnd = false;
                break;
            }
        }
    }
    for (let i = 0; i < 4 && isEnd; i++) {
        for (let j = 0; j < 3; j++) {
            if (_grid[j][i] === _grid[j + 1][i]) {
                isEnd = false;
                break;
            }
        }
    }
    return isEnd
}
function endGame() {
    document.getElementById('endPrompt').classList.add('show');
    window.end = true;
    saveGame();
}


function saveGame() {
    localStorage.setItem('gameInfo', JSON.stringify(window.gameInfo));
    localStorage.setItem('end', window.end);
}
function randomPos() {
    return Math.round(Math.random() * 3);
}
function getRandomElement(range) {
    const rand = Math.random();
    const pos = Math.round(Math.random() * range);
    if (rand >= 0.9) {
        return [pos, 4];
    }
    return [pos, 2];
}

function transpose(_grid) {
    for (let i = 0; i < 4; i++) {
        for (let j = i; j < 4; j++) {
            let T = _grid[i][j];
            _grid[i][j] = _grid[j][i];
            _grid[j][i] = T;
        }
    }
}
function reverseRows(_grid) {
    for (let i = 0; i < 4; i++) {
        let T = _grid[i][0];
        _grid[i][0] = _grid[i][3];
        _grid[i][3] = T;

        T = _grid[i][1];
        _grid[i][1] = _grid[i][2];
        _grid[i][2] = T;
    }
}