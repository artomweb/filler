let padding = 10;
let numRows = 7,
    numColumns = 8;
let gridWidth, gridHeight;
let gridOrigin;
let squareWidth, squareHeight;

let squares = new Array(numColumns);
let optionSquares = [];

const colors = ["#F83D5C", "#AFDD6A", "#4DB3F6", "#6A4CA3", "#4A474A", "#F3D51E"];

// main setup function

function setup() {
    cnv = createCanvas(800, 900);

    cnv.mouseClicked(eventMouse);

    cnv.parent("sketch");

    animGraph = createGraphics(width, height);
    gridWidth = 700;
    gridHeight = (numRows * gridWidth) / 8;
    gridOrigin = createVector(width / 2 - gridWidth / 2, 50);
    squareWidth = (gridWidth - padding) / numColumns;
    squareHeight = (gridHeight - padding) / numRows;

    for (i = 0; i < numColumns; i++) {
        squares[i] = new Array(numRows);
        for (j = 0; j < numRows; j++) {
            let theseColors = shuffle(colors);
            let thisColor = theseColors[0];

            while (!checkNeighbors(i, j, thisColor)) {
                theseColors.shift();
                thisColor = theseColors[0];
            }
            let squareTemp = new playSquare(i, j, thisColor);
            squares[i][j] = squareTemp;
        }
    }

    if (squares[0][6].col == squares[7][0].col) {
        console.log(squares[0][6].col, squares[7][0].col);
        let filtColors = colors.filter((item) => item !== squares[7][0].col);
        console.log(filtColors);
        squares[0][6].col = random(filtColors);
    }

    for (let i = 0; i < colors.length; i++) {
        let optionTemp = new optionSquare(i);
        if (optionTemp.col == squares[7][0].col || optionTemp.col == squares[0][6].col) {
            optionTemp.clickable = false;
        }
        optionSquares.push(optionTemp);
    }

    squares[0][6].isPlayerSquare = true;

    if (squares[0][5].col == squares[1][6].col && squares[1][6].col == squares[7][0].col) {
        let theseColors = shuffle(colors);
        let thisColor = theseColors[0];

        while (!checkNeighbors(0, 5, thisColor)) {
            theseColors.shift();
            thisColor = theseColors[0];
        }
        squares[0][5].col = thisColor;
        console.log("trapped");
    }
}

// main draw loop, draws player squares after and separately so the are drawn overtop

function draw() {
    background(220);

    for (i = 0; i < numColumns; i++) {
        for (j = 0; j < numRows; j++) {
            if (!squares[i][j].isPlayerSquare) {
                squares[i][j].show();
            }
        }
    }

    for (i = 0; i < numColumns; i++) {
        for (j = 0; j < numRows; j++) {
            if (squares[i][j].isPlayerSquare) {
                squares[i][j].show();
            }
        }
    }

    for (let i = 0; i < optionSquares.length; i++) {
        optionSquares[i].show();
    }
}

function checkNeighbors(x, y, col) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (Math.abs(i) !== Math.abs(j) || (i && j) == 0) {
                if (squares[x - i] && squares[x - i][y - j]) {
                    if (squares[x - i][y - j].col == col) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function getNeighborColors(x, y, col) {
    let neighborColors = [];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (Math.abs(i) !== Math.abs(j) || (i && j) == 0) {
                if (squares[x - i] && squares[x - i][y - j]) {
                    neighborColors.push(squares[x - i][y - j].col);
                }
            }
        }
    }
}

// handle a mouse event and check if an option has been clicked

function eventMouse() {
    for (let i = 0; i < optionSquares.length; i++) {
        if (optionSquares[i].mouseInside()) {
            if (optionSquares[i].clickable) {
                optionClicked(optionSquares[i].col);
                optionSquares[i].clickable = false;
            }
        }
    }
}

// add new neighbours for each player square

function optionClicked(col) {
    for (i = 0; i < numColumns; i++) {
        for (j = 0; j < numRows; j++) {
            if (squares[i][j].isPlayerSquare) {
                addNeighbors(i, j, col);
                squares[i][j].col = col;
            }
        }
    }
    popOut();
    setOptions();
}

// change the options that can be clicked based off of the corner squares
function setOptions() {
    for (var i = 0; i < optionSquares.length; i++) {
        if (optionSquares[i].col == squares[7][0].col || optionSquares[i].col == squares[0][6].col) {
            optionSquares[i].clickable = false;
        } else {
            optionSquares[i].clickable = true;
        }
    }
}

// recursively add new neighbours for a given square, checking against given color

function addNeighbors(x, y, col) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (Math.abs(i) !== Math.abs(j) || (i && j) == 0) {
                if (squares[x - i] && squares[x - i][y - j]) {
                    if (squares[x - i][y - j].col == col) {
                        if (!squares[x - i][y - j].isPlayerSquare) {
                            squares[x - i][y - j].isPlayerSquare = true;

                            addNeighbors(x - i, y - j, col);
                        }
                        // console.log(squares[x - i][y - j]);
                    }
                }
            }
        }
    }
}

// animation for enlarging and shrinking players squares

function popOut() {
    let totalX = 0,
        totalY = 0;
    let total = 0;
    for (i = 0; i < numColumns; i++) {
        for (j = 0; j < numRows; j++) {
            if (squares[i][j].isPlayerSquare) {
                totalX += squares[i][j].realPos.x;
                totalY += squares[i][j].realPos.y;
                total++;
            }
        }
    }
    // playerSquares[i].gray = true;

    // playerSquares[i].col = playerSquares[0].col;

    console.log(totalX, totalY);
    let avgX = totalX / total;
    let avgY = totalY / total;

    let scalePoint = createVector(avgX, avgY);

    console.log(scalePoint);

    let limit = 50;
    let current = 0;

    let scaleAmount = 1.004;
    let delay = 0.2;

    let popIn = setInterval(() => {
        for (i = 0; i < numColumns; i++) {
            for (j = 0; j < numRows; j++) {
                if (squares[i][j].isPlayerSquare) {
                    squares[i][j].realPos.sub(scalePoint).mult(scaleAmount).add(scalePoint);
                    squares[i][j].width *= scaleAmount;
                    squares[i][j].height *= scaleAmount;
                }
            }
        }
        // console.log("out");
        if (current >= limit) {
            // console.log("CLEARED");
            clearInterval(popIn);
            current = 0;
            let popOut = setInterval(() => {
                for (i = 0; i < numColumns; i++) {
                    for (j = 0; j < numRows; j++) {
                        if (squares[i][j].isPlayerSquare) {
                            squares[i][j].realPos
                                .sub(scalePoint)
                                .mult(1 / scaleAmount)
                                .add(scalePoint);
                            squares[i][j].width *= 1 / scaleAmount;
                            squares[i][j].height *= 1 / scaleAmount;
                        }
                    }
                }
                // console.log("out");
                if (current >= limit) {
                    // console.log("CLEARED");
                    clearInterval(popOut);
                    for (i = 0; i < numColumns; i++) {
                        for (j = 0; j < numRows; j++) {
                            if (squares[i][j].isPlayerSquare) {
                                squares[i][j].resetPos();
                            }
                        }
                    }
                }
                current++;
            }, delay);
        }
        current++;
    }, delay);
}

class optionSquare {
    constructor(i) {
        this.index = i;
        this.pos = createVector(85 + i * 125, height - 100);
        this.col = colors[i];
        this.clickable = true;
        this.size = 85;
        this.sizeSmall = 30;
    }

    show() {
        rectMode(CENTER);
        noStroke();
        fill(this.col);
        if (this.clickable) {
            square(this.pos.x, this.pos.y, this.size);
        } else {
            square(this.pos.x, this.pos.y, this.sizeSmall);
        }
    }

    mouseInside() {
        return mouseX >= this.pos.x - this.size / 2 && mouseX < this.pos.x + this.size / 2 && mouseY >= this.pos.y - this.size / 2 && mouseY < this.pos.y + this.size / 2;
    }
}

class playSquare {
    constructor(i, j, col) {
        this.gridPos = createVector(i, j);
        this.realPos = createVector(gridOrigin.x + (padding / 2 + (this.gridPos.x * squareWidth + squareWidth / 2)), gridOrigin.y + (padding / 2 + (this.gridPos.y * squareHeight + squareHeight / 2)));
        this.col = col;
        this.width = squareWidth;
        this.height = squareHeight;
        this.isPlayerSquare = false;
    }

    resetPos() {
        this.realPos = createVector(gridOrigin.x + (padding / 2 + (this.gridPos.x * squareWidth + squareWidth / 2)), gridOrigin.y + (padding / 2 + (this.gridPos.y * squareHeight + squareHeight / 2)));
        this.width = squareWidth;
        this.height = squareHeight;
    }

    show() {
        rectMode(CENTER);

        noStroke();

        if (this.gray) {
            fill(220);
        } else {
            fill(this.col);
        }

        rect(this.realPos.x, this.realPos.y, this.width + 1, this.height + 1);

        // rect(this.realPos.x, this.realPos.y, 20);
    }

    mouseInside() {
        return mouseX >= this.pos.x - this.width / 2 && mouseX < this.pos.x + this.width / 2 && mouseY >= this.pos.y - this.height / 2 && mouseY < this.pos.y + this.height / 2;
    }
}