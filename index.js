

window.addEventListener("keydown", proccessKeyPress)
//window.addEventListener("keydown", (e) => { e.preventDefault() })
window.onload = (() => {
    document.getElementById("#link_howToPlay").addEventListener('click', highlight)
})

function highlight(e) {
    const el = document.getElementById("howToPlay");
    el.className = 'animate';
    setTimeout(() => {
        const el = document.getElementById("howToPlay");
        el.className = '';
    }, 2000)
}

function proccessKeyPress(e) {
    e.preventDefault();

}