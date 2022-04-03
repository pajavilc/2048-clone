let grid;
let gameInfo;




function loadGame() {
    window.grid = [...document.getElementById('grid').children].map(el => el.children);
    window.gameInfo = JSON.parse(localStorage.getItem('gameInfo'));
    let highscore = localStorage.getItem('highscore') || 0;

    if (window.gameInfo === null) {
        newGame();
        window.gameInfo = localStorage.getItem('gameInfo');
    }

    const _gridInfo = window.gameInfo.grid;
    render(_gridInfo);
    document.querySelector('#score .value').innerHTML = window.gameInfo.score;
    document.querySelector('#best .value').innerHTML = highscore;
}

function newGame() {

    let _grid = new Array(4).fill(-1).map(() => new Array(4).fill(-1))
    const firstpos = [randomPos(), randomPos()];
    const secondpos = [randomPos(), randomPos()];

    if (firstpos === secondpos) {
        secondpos[1] = (secondpos[1] + 1) % 4
    }

    _grid[firstpos[0]][firstpos[1]] = 2;
    _grid[secondpos[0]][secondpos[1]] = 2;

    localStorage.setItem('gameInfo', JSON.stringify({
        score: 0,
        grid: _grid
    }));
    window.gameInfo.grid = _grid;
    render(_grid);
    document.querySelector('#score .value').innerHTML = window.gameInfo.score;
}

function proccessKeyPress(e) {
    e.preventDefault()
    const key = e.key;


    switch (key) {
        case 'ArrowUp': {
            animate(false, pushedUp())
            break;
        }
        case 'ArrowDown': {
            animate(false, pushedDown());

            break;
        }
        case 'ArrowLeft': {
            animate(true, pushedLeft());
            break;
        }
        case 'ArrowRight': {
            animate(true, pushedRight());
            break;
        }
        default: {
            return;
        }
    }
    render(window.gameInfo.grid);
    createElement();
    //TODO:REMOVE

    render(window.gameInfo.grid);
    saveGame();
}




function pushedDown() {
    const gridInfo = window.gameInfo.grid;
    let Anim = [[], [], [], []];
    let next = [[], [], [], []];

    for (let i = 0; i < 4; i++) {

        let row = gridInfo[i];
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
                    row[j] = -1;
                    row[k] = num;
                    break;
                }

                if (row[k] === num) {
                    if (wasChanged[k] === true) {
                        row[j] = -1;
                        row[k - 1] = num;
                        break;
                    }
                    row[j] = -1;
                    row[k] = num * 2;
                    wasChanged[k] = true;
                    break;
                }
                else {
                    row[j] = -1;
                    row[k - 1] = num;
                    break;
                }

            }
        }
        next[i] = row;
    }
    window.gameInfo.grid = next;
    return Anim;
}
function pushedUp() {

    const gridInfo = window.gameInfo.grid;
    reverseRows(gridInfo);
    transpose(gridInfo);
    transpose(gridInfo);
    const animation = pushedDown();
    transpose(gridInfo);
    transpose(gridInfo);
    reverseRows(gridInfo);
    /*
    let Anim = [[], [], [], []];
    let next = [[], [], [], []];

    for (let i = 0; i < 4; i++) {

        let row = gridInfo[i];
        let wasChanged = [false, false, false, false];
        for (let j = 0; j < 4; j++) {
            if (row[j] === -1) {
                continue;
            }
            const num = row[j];
            //checking row to be pushed
            for (let k = j - 1; k >= 0; k--) {
                if (row[k] === -1) {
                    if (k !== 0) {
                        continue;
                    }
                    row[j] = -1;
                    row[k] = num;
                    break;
                }
                if (row[k] === num) {
                    if (wasChanged[k] === true) {
                        row[j] = -1;
                        row[k + 1] = num;
                        break
                    }
                    row[j] = -1;
                    row[k] = num * 2;
                    wasChanged[k] = true;
                    break;
                }
                else {
                    row[j] = -1;
                    row[k + 1] = num;
                    break;
                }
            }
        }
        next[i] = row;
    }
    window.gameInfo.grid = next;
    return Anim;*/
}

function pushedLeft() {
    const _grid = window.gameInfo.grid;
    transpose(_grid);
    reverseRows(_grid);
    const animation = pushedDown()
    reverseRows(_grid);
    transpose(_grid);

    return animation;
}

function pushedRight() {
    const _grid = window.gameInfo.grid;
    reverseRows(_grid);
    transpose(_grid);
    const animation = pushedDown()
    transpose(_grid);
    reverseRows(_grid);
    return animation;
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

        //Same As
        /*for(let j = 0;j<(2);j++){
            let T = _grid[i][j];
            _grid[i][0]= _grid[i][3-j];
            _grid[i][3-j] = T;
            
        }*/
    }
}
function animate(wasRotated, animation) {
    console.error('animate missing')
}

function randomPos() {
    return Math.round(Math.random() * 3);
}

function render(_grid) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            window.grid[i][j].innerHTML = String(_grid[i][j]);
        }
    }
}

function createElement() {
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
        alert('nononono')
    }
    const [pos, number] = getRandomElement(N);
    const position = arr[pos];
    _grid[Math.floor(position / 4)][position % 4] = number;
    grid[Math.floor(position / 4)][position % 4].innerHTML = number;
    if (N === 1) {
        //TODO: ckeck for end
    }
}

function getRandomElement(range) {
    const rand = Math.random();
    const pos = Math.round(Math.random() * range);
    if (rand >= 0.9) {
        return [pos, 4];
    }
    return [pos, 2];
}



function saveGame() {
    localStorage.setItem('gameInfo', JSON.stringify(window.gameInfo));
}