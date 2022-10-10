import Game from "./game.js";

document.getElementById("updateBoard").addEventListener("click", () => {
    let boardContainer = document.getElementById("boardContainer");
    boardContainer.innerHTML = "";
    let nickname = document.getElementById("nickname").value;
    let height = document.getElementById("height").value;
    let width = document.getElementById("width").value;
    let mines = document.getElementById("mines").value;
    let validInput = true;

    if (!nickname || !height || !width || !mines) {
        validInput = false;
    }
    if (height < 0 || height > 100) {
        validInput = false;
    }
    if (width < 0 || width > 100) {
        validInput = false;
    }
    if (mines > height * width) {
        validInput = false;
    }

    if (validInput) {
        const game = new Game(
            boardContainer,
            document.getElementById("scoreContainer"),
            nickname,
            height,
            width,
            mines
        );
        game.start();
    } else {
        boardContainer.innerHTML = "<p>Invalid input!</p>";
    }
});
