window.addEventListener("keydown", playedTurn);

window.onload = (() => {
    loadGame();
    document.getElementById("#link_howToPlay").addEventListener('click', highlight);
    document.getElementById('newGame').addEventListener('click', newGame);
})

function highlight(e) {
    const el = document.getElementById("howToPlay");
    el.className = 'animate';
    setTimeout(() => {
        const el = document.getElementById("howToPlay");
        el.className = '';
    }, 2000)
}

