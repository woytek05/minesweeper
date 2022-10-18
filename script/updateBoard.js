import Game from "./game.js";

function disableElements(arr) {
    arr.forEach((n) => {
        n.disabled = true;
    });
}

const updateBoard = document.getElementById("updateBoard");
updateBoard.addEventListener("click", () => {
    const boardContainer = document.getElementById("boardContainer");
    const leftFlagsContainer = document.getElementById("leftFlagsContainer");
    const sumContainer = document.getElementById("sumContainer");
    const timerContainer = document.getElementById("timerContainer");
    const nickname = document.getElementById("nickname");
    const height = document.getElementById("height");
    const width = document.getElementById("width");
    const mines = document.getElementById("mines");
    let validInput = true;

    boardContainer.innerHTML = "";
    leftFlagsContainer.innerHTML = "";
    sumContainer.innerHTML = "";
    timerContainer.innerHTML = "";

    if (nickname.value.length > 20) {
        validInput = false;
    }
    if (!nickname.value || !height.value || !width.value || !mines.value) {
        validInput = false;
    }
    if (height.value <= 0 || height.value > 100) {
        validInput = false;
    }
    if (width.value <= 0 || width.value > 100) {
        validInput = false;
    }
    if (mines.value > height.value * width.value) {
        validInput = false;
    }

    if (validInput) {
        const game = new Game(
            boardContainer,
            leftFlagsContainer,
            sumContainer,
            timerContainer,
            nickname.value,
            height.value,
            width.value,
            mines.value
        );
        game.start();
        disableElements([nickname, height, width, mines, updateBoard]);
    } else {
        boardContainer.innerHTML = "<p>Invalid input!</p>";
    }
});
