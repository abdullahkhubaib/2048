// Updates the frames
const lineColour = "#BBADA0";
const textDarkColour = "#776E65";
const textLightColour = "#F9F6F2";
const tileColours = ["#CDC1B4", "#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C5F", "#F65E3B", "#EDCF72", "#EDCC61", "#EDC850", "#EDC53F", "#EEC22E"];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.textAlign = "center";
ctx.font = "55px Clear Sans";
let grid = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
let tempGrid = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
let previousGrid = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
let key = "";
let newTile = true;
let mousePos = {
    x: 0,
    y: 0
};
let clickPos = {
    x: 0,
    y: 0
};
let score = 0;
let highScore = score;
(async function () {
    let previous = Date.now();
    let fTime;
    await randomizeTile();
    newTile = true;
    await randomizeTile();
    while (true) {
        fTime = Date.now() - previous;
        previous = Date.now();
        //console.log(fTime);
        ctx.fillStyle = lineColour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await drawGrid();
        await drawButtons();
        await buttonClicks();
        await input();
        await randomizeTile();
        highscore();
        document.title = `2048 - ${1000 / fTime}FPS`;
        await delay(1);
    }
})();
async function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            ctx.fillStyle = tileColours[grid[i][j]];
            ctx.fillRect(j * 106 + (15 * (j + 1)), i * 106 + (15 * (i + 1)), 106, 106);
            if (grid[i][j] !== 0) {
                ctx.fillStyle = grid[i][j] < 3 ? textDarkColour : textLightColour;
                ctx.fillText("" + (1 << grid[i][j]), j * 106 + (15 * (j + 1)) + 53, i * 106 + (15 * (i + 1)) + 72, 106);
            }
        }
    }
}
async function drawButtons() {
    ctx.fillStyle = tileColours[0];
    ctx.fillRect(499, 15, canvas.width - 499 - 15, canvas.height - 30);
    if (mousePos.y >= 30 && mousePos.y <= 30 + 100 && mousePos.x >= 499 + 15 && mousePos.x <= 499 + 15 + 200) {
        ctx.fillStyle = tileColours[3];
        ctx.fillRect(499 + 15, 30, 200, 100);
        ctx.fillStyle = textLightColour;
        ctx.fillText("New Game", 499 + 15 + 100, 30 + 69, 175);
    }
    else {
        ctx.fillStyle = tileColours[1];
        ctx.fillRect(499 + 15, 30, 200, 100);
        ctx.fillStyle = textDarkColour;
        ctx.fillText("New Game", 499 + 15 + 100, 30 + 69, 175);
    }
    if (mousePos.y >= 145 && mousePos.y <= 145 + 100 && mousePos.x >= 499 + 15 && mousePos.x <= 499 + 15 + 200) {
        ctx.fillStyle = tileColours[3];
        ctx.fillRect(499 + 15, 145, 200, 100);
        ctx.fillStyle = textLightColour;
        ctx.fillText("Undo", 499 + 15 + 100, 145 + 69, 200);
    }
    else {
        ctx.fillStyle = tileColours[1];
        ctx.fillRect(499 + 15, 145, 200, 100);
        ctx.fillStyle = textDarkColour;
        ctx.fillText("Undo", 499 + 15 + 100, 145 + 69, 200);
    }
    ctx.fillStyle = textDarkColour;
    ctx.fillText("Score: " + score, 499 + 15 + 100, 240 + 69, 200);
    ctx.font = "25px Clear Sans";
    ctx.fillText("HighScore: " + highScore, 499 + 15 + 100, 350 + 69, 200);
    ctx.font = "55px Clear Sans";
}
async function buttonClicks() {
    if (clickPos.y >= 30 && clickPos.y <= 30 + 100 && clickPos.x >= 499 + 15 && clickPos.x <= 499 + 15 + 200) {
        grid = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];
        score = 0;
        newTile = true;
        await randomizeTile();
        newTile = true;
        await randomizeTile();
        newTile = false;
        clickPos = { x: 0, y: 0 };
    }
    if (clickPos.y >= 145 && clickPos.y <= 145 + 100 && clickPos.x >= 499 + 15 && clickPos.x <= 499 + 15 + 200) {
        undo();
        clickPos = { x: 0, y: 0 };
    }
}
async function input() {
    if (key === "ArrowDown" || key === "ArrowUp" || key === "ArrowLeft" || key === "ArrowRight") {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                tempGrid[i][j] = grid[i][j];
            }
        }
        for (let x = 0; x < 3; x++) {
            switch (key) {
                case "ArrowDown":
                    for (let i = 1; i < grid.length; i++) {
                        for (let j = 0; j < grid[0].length; j++) {
                            if (grid[i][j] === 0 && grid[i - 1][j] !== 0) {
                                grid[i][j] = grid[i - 1][j];
                                grid[i - 1][j] = 0;
                                newTile = true;
                            }
                        }
                    }
                    for (let i = grid.length - 1; i > 0; i--) {
                        for (let j = 0; j < grid[0].length; j++) {
                            if (grid[i][j] === grid[i - 1][j] && grid[i][j] !== 0) {
                                score += 1 << (++grid[i][j]);
                                grid[i - 1][j] = 0;
                                newTile = true;
                            }
                        }
                    }
                    break;
                case "ArrowUp":
                    for (let i = grid.length - 2; i >= 0; i--) {
                        for (let j = 0; j < grid[0].length; j++) {
                            if (grid[i][j] === 0 && grid[i + 1][j] !== 0) {
                                grid[i][j] = grid[i + 1][j];
                                grid[i + 1][j] = 0;
                                newTile = true;
                            }
                        }
                    }
                    for (let i = 0; i < grid.length - 1; i++) {
                        for (let j = 0; j < grid[0].length; j++) {
                            if (grid[i][j] === grid[i + 1][j] && grid[i][j] !== 0) {
                                score += 1 << (++grid[i][j]);
                                grid[i + 1][j] = 0;
                                newTile = true;
                            }
                        }
                    }
                    break;
                case "ArrowLeft":
                    for (let j = grid.length - 2; j >= 0; j--) {
                        for (let i = 0; i < grid.length; i++) {
                            if (grid[i][j] === 0 && grid[i][j + 1] !== 0) {
                                grid[i][j] = grid[i][j + 1];
                                grid[i][j + 1] = 0;
                                newTile = true;
                            }
                        }
                    }
                    for (let j = 0; j < grid[0].length - 1; j++) {
                        for (let i = 0; i < grid.length; i++) {
                            if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
                                score += 1 << (++grid[i][j]);
                                grid[i][j + 1] = 0;
                                newTile = true;
                            }
                        }
                    }
                    break;
                case "ArrowRight":
                    for (let j = 1; j < grid[0].length; j++) {
                        for (let i = 0; i < grid.length; i++) {
                            if (grid[i][j] === 0 && grid[i][j - 1] !== 0) {
                                grid[i][j] = grid[i][j - 1];
                                grid[i][j - 1] = 0;
                                newTile = true;
                            }
                        }
                    }
                    for (let j = grid[0].length - 1; j > 0; j--) {
                        for (let i = 0; i < grid.length; i++) {
                            if (grid[i][j] === grid[i][j - 1] && grid[i][j] !== 0) {
                                score += 1 << (++grid[i][j]);
                                grid[i][j - 1] = 0;
                                newTile = true;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        key = "";
    }
}
async function randomizeTile() {
    if (newTile) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                previousGrid[i][j] = tempGrid[i][j];
            }
        }
        let emptyTiles = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] === 0) {
                    emptyTiles.push({ i, j });
                }
            }
        }
        newTile = false;
        if (emptyTiles.length === 0) {
            console.log("Game Over!");
        }
        else {
            const randTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[randTile.i][randTile.j] = Math.floor(Math.random() * 2) + 1;
        }
        // console.table(grid);
    }
}
function highscore() {
    if (score > highScore) {
        highScore = score;
    }
}
function undo() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j] = previousGrid[i][j];
        }
    }
}
document.addEventListener("keydown", e => key = e.key);
document.addEventListener("mousemove", e => {
    mousePos.x = e.clientX - 8;
    mousePos.y = e.clientY - 8;
});
document.addEventListener("click", e => {
    clickPos.x = e.clientX - 8;
    clickPos.y = e.clientY - 8;
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//# sourceMappingURL=index.js.map