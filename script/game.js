import Block from "./block.js";

export default class Game {
    constructor(
        boardContainer,
        pointsContainer,
        nickname,
        height,
        width,
        mines
    ) {
        this.boardContainer = boardContainer;
        this.pointsContainer = pointsContainer;
        this.points = 0;
        this.nickname = nickname;
        this.height = height;
        this.width = width;
        this.blocks = [];
        for (let i = 0; i < this.height; i++) {
            this.blocks.push([]);
        }
        this.mines = mines;
        this.coordsOfMines = [];
        this.isActive = true;
        this.startTime = new Date();
    }

    start() {
        this.fillCoordsOfMines();
        this.fillBlocks();
        this.updateCount();
        this.updateType();
        this.updatePoints();
        this.createBoard();
    }

    fillCoordsOfMines() {
        for (let i = 0; i < this.mines; i++) {
            let included = false;
            do {
                let randomCoord = this.getRandomCoord(
                    0,
                    this.height,
                    0,
                    this.width
                );
                included = this.coordsOfMines.some(
                    (c) => c.i === randomCoord.i && c.j === randomCoord.j
                );
                if (!included) {
                    this.coordsOfMines.push(randomCoord);
                }
            } while (included);
        }
    }

    fillBlocks() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.coordsOfMines.some((c) => c.i === i && c.j === j)) {
                    this.blocks[i].push(new Block(i, j, 0, "mine", true, true));
                } else {
                    this.blocks[i].push(
                        new Block(i, j, 0, "closed", false, true)
                    );
                }
            }
        }
    }

    updateCount() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.blocks[i][j].type === "mine") {
                    try {
                        this.blocks[i - 1][j - 1].count += 1;
                    } catch {}
                    try {
                        this.blocks[i - 1][j].count += 1;
                    } catch {}
                    try {
                        this.blocks[i - 1][j + 1].count += 1;
                    } catch {}
                    try {
                        this.blocks[i][j - 1].count += 1;
                    } catch {}
                    try {
                        this.blocks[i][j + 1].count += 1;
                    } catch {}
                    try {
                        this.blocks[i + 1][j - 1].count += 1;
                    } catch {}
                    try {
                        this.blocks[i + 1][j].count += 1;
                    } catch {}
                    try {
                        this.blocks[i + 1][j + 1].count += 1;
                    } catch {}
                }
            }
        }
    }

    updateType() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.blocks[i][j].type !== "mine") {
                    this.blocks[i][j].type =
                        "type" + String(this.blocks[i][j].count);
                }
            }
        }
    }

    updatePoints() {
        this.pointsContainer.innerText = "Points: " + this.points;
    }

    createBoard() {
        for (let i = 0; i < this.height; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < this.width; j++) {
                let block = document.createElement("div");
                block.classList.add("block", "closed");
                block.addEventListener("click", () => {
                    this.clickBlock(i, j);
                });
                block.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (this.blocks[i][j].type === "flag") {
                        this.unflagBlock(i, j);
                    } else {
                        this.flagBlock(i, j);
                    }
                });
                row.appendChild(block);
            }
            this.boardContainer.appendChild(row);
        }
        this.rows = Array.from(this.boardContainer.querySelectorAll(".row"));
    }

    getRandomCoord(minHeight, maxHeight, minWidth, maxWidth) {
        minHeight = Math.ceil(minHeight);
        maxHeight = Math.floor(maxHeight);
        let randomHeight = Math.floor(
            Math.random() * (maxHeight - minHeight) + minHeight
        );

        minWidth = Math.ceil(minWidth);
        maxWidth = Math.floor(maxWidth);
        let randomWidth = Math.floor(
            Math.random() * (maxWidth - minWidth) + minWidth
        );
        return { i: randomHeight, j: randomWidth };
    }

    clickBlock(i, j) {
        if (this.isActive && this.blocks[i][j].type !== "flag") {
            if (this.blocks[i][j].type === "mine") {
                this.blocks[i][j].type = "red-mine";
                this.blocks[i][j].covered = false;
                this.showBombs();
                this.showSummary(false);
                this.isActive = false;
            } else if (
                this.blocks[i][j].type !== "mine" &&
                this.blocks[i][j].covered
            ) {
                this.uncoverBlock(i, j);
                this.updatePoints();
            }
            this.checkIfWin();
        }
    }

    uncoverBlock(i, j) {
        if (
            this.blocks[i][j].count === 0 &&
            this.blocks[i][j].type !== "mine" &&
            this.blocks[i][j].type !== "red-mine" &&
            this.blocks[i][j].covered
        ) {
            this.changeClassOfBlockToItsType(i, j, "closed");
            this.blocks[i][j].covered = false;
            try {
                this.uncoverBlock(i - 1, j - 1);
            } catch {}
            try {
                this.uncoverBlock(i - 1, j);
            } catch {}
            try {
                this.uncoverBlock(i - 1, j + 1);
            } catch {}
            try {
                this.uncoverBlock(i, j - 1);
            } catch {}
            try {
                this.uncoverBlock(i, j + 1);
            } catch {}
            try {
                this.uncoverBlock(i + 1, j - 1);
            } catch {}
            try {
                this.uncoverBlock(i + 1, j);
            } catch {}
            try {
                this.uncoverBlock(i + 1, j + 1);
            } catch {}
        } else if (
            this.blocks[i][j].count > 0 &&
            this.blocks[i][j].type !== "mine" &&
            this.blocks[i][j].type !== "red-mine" &&
            this.blocks[i][j].covered
        ) {
            this.changeClassOfBlockToItsType(i, j, "closed");
            this.blocks[i][j].covered = false;
            this.points += this.blocks[i][j].count;
        }
    }

    changeClassOfBlockToItsType(i, j, classToRemove) {
        this.rows[i].childNodes[j].classList.remove(classToRemove);
        this.rows[i].childNodes[j].classList.add(
            String(this.blocks[i][j].type)
        );
    }

    flagBlock(i, j) {
        if (this.isActive && this.blocks[i][j].covered) {
            this.blocks[i][j].type = "flag";
            this.changeClassOfBlockToItsType(i, j, "closed");
            this.checkIfWin();
        }
    }

    unflagBlock(i, j) {
        if (this.isActive && this.blocks[i][j].covered) {
            if (this.blocks[i][j].is_mine) {
                this.blocks[i][j].type = "mine";
            } else {
                this.blocks[i][j].type =
                    "type" + String(this.blocks[i][j].count);
            }
            this.rows[i].childNodes[j].classList.remove("flag");
            this.rows[i].childNodes[j].classList.add("closed");
            this.checkIfWin();
        }
    }

    checkIfWin() {
        let flagged_mines = 0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (
                    this.blocks[i][j].is_mine &&
                    this.blocks[i][j].type === "flag"
                ) {
                    flagged_mines += 1;
                }
            }
        }
        if (parseInt(this.mines) === flagged_mines) {
            this.addCookie(
                this.width + "x" + this.height + "x" + this.mines,
                this.nickname,
                this.getGameTimeInMilliseconds(),
                14
            );
            this.showSummary(true);
            this.isActive = false;
        }
    }

    addCookie(dimention, nickname, time, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        if (
            document.cookie
                .split(";")
                .some((item) => item.trim().startsWith(`${dimention}=`))
        ) {
            let string = `${dimention}=`;
            let startOfRecordsIndex =
                document.cookie.indexOf(string) + string.length;
            let endOfRecordsIndex = startOfRecordsIndex;
            for (let i = startOfRecordsIndex; i < document.cookie.length; i++) {
                if (document.cookie[i] === ";") {
                    break;
                }
                endOfRecordsIndex++;
            }
            document.cookie =
                `${dimention}=` +
                document.cookie.slice(startOfRecordsIndex, endOfRecordsIndex) +
                `,${nickname}~${time}`;
        } else {
            document.cookie = `${dimention}=${nickname}~${time};expires=${d.toUTCString()};path=/`;
        }
    }

    getGameTimeInMilliseconds() {
        let endTime = new Date();
        const diffTime = Math.abs(this.startTime - endTime);
        return diffTime;
    }

    getGameTimeInMinutesAndSeconds() {
        let endTime = new Date();
        const diffTime = Math.abs(this.startTime - endTime);
        let minutes = Math.floor(diffTime / 60000);
        let seconds = ((diffTime % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    showBombs() {
        this.isActive = false;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (
                    this.rows[i].childNodes[j].classList.contains("closed") &&
                    (this.blocks[i][j].type === "mine" ||
                        this.blocks[i][j].type === "red-mine")
                ) {
                    this.changeClassOfBlockToItsType(i, j, "closed");
                    this.blocks[i][j].covered = false;
                }
            }
        }
    }

    showSummary(win) {
        let summary = document.createElement("div");
        summary.classList.add("summary");

        let header = document.createElement("h2");
        if (win) {
            header.innerText = "You win!";
        } else {
            header.innerText = "You lose!";
        }
        summary.appendChild(header);

        let nickname = document.createElement("p");
        nickname.innerText = `Nickname: ${this.nickname}`;
        summary.appendChild(nickname);

        let dimension = document.createElement("p");
        dimension.innerText = `Dimension: ${this.width}x${this.height}x${this.mines}`;
        summary.appendChild(dimension);

        let points = document.createElement("p");
        points.innerText = `Points: ${this.points}`;
        summary.appendChild(points);

        let time = document.createElement("p");
        time.innerText = `Time: ${this.getGameTimeInMinutesAndSeconds()}`;
        summary.appendChild(time);

        let records = document.createElement("p");
        records.innerHTML =
            '<a class="records" href="records.html">Records</a>';
        summary.appendChild(records);

        let again = document.createElement("p");
        again.innerHTML = '<a href="index.html">Again?</a>';
        summary.appendChild(again);

        let dark = document.createElement("div");
        dark.classList.add("dark");
        this.pointsContainer.appendChild(dark);

        this.pointsContainer.appendChild(summary);
    }
}
