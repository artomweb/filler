let optionboard = [];

let padding = 10;
let YOff, XOff;

let numRows = 7,
    numColumns = 8;

let gridWidth, gridHeight;
let gridCenter;
let squareWidth, squareHeight;

const colours = ["#F83D5C", "#AFDD6A", "#4DB3F6", "#6A4CA3", "#4A474A", "#F3D51E"];

let white;

function setup() {
    cnv = createCanvas(1500, 1687.5);

    cnv.parent("sketch");
    cnv.mouseClicked(eventMouse);

    let margin = 80;

    gridWidth = width - margin * 2;
    gridHeight = (numRows * gridWidth) / numColumns;
    gridCenter = createVector(width / 2 - gridWidth / 2, margin);
    squareWidth = (gridWidth - padding) / numColumns;
    squareHeight = (gridHeight - padding) / numRows;

    YOff = gridCenter.y;
    XOff = gridCenter.x;

    white = color("white");
}

function boardInit() {
    optionboard = [];
    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            let thisSquare = board[i][j];
            board[i][j] = new boardSquare(i, j, thisSquare.serverBoard, thisSquare.colour, thisSquare.playerOwner);
        }
    }

    // create the clickable options
    for (let i = 0; i < colours.length; i++) {
        let optionTemp = new optionSquare(i);
        console.log(board[6][0].colour.toString(), optionTemp.p5Colour.toString());
        if (optionTemp.p5Colour.toString() === board[6][0].colour.toString() || optionTemp.p5Colour.toString() === board[0][7].colour.toString()) {
            optionTemp.clickable = false;
        }
        optionboard.push(optionTemp);
    }
}

let flashPlayerTiles = false;
let t = 0;
let change = 0.04;
let c = change;
let maxOpacity = 0.4;

function draw() {
    background(230);
    if (!board) return;

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner != notCurrentPlayer) {
                board[i][j].show();
            }
        }
    }

    // console.log(currentPlayer);

    if (flashPlayerTiles) {
        if (t < 0) c = change;
        if (t > 1) c = -change;
        t += c;
    }

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner == notCurrentPlayer) {
                board[i][j].show();
            } else if (flashPlayerTiles && board[i][j].playerOwner == clientID) {
                let thisCol = board[i][j].originalColour;
                board[i][j].colour = lerpColor(thisCol, lerpColor(thisCol, white, maxOpacity), t);
                board[i][j].show();
            }
        }
    }

    for (let i = 0; i < optionboard.length; i++) {
        optionboard[i].show();
    }
}

function flashTiles(bool) {
    if (bool) {
        flashPlayerTiles = true;
    } else {
        flashPlayerTiles = false;
        t = 0;
        c = change;
    }
}

function eventMouse() {
    for (let i = 0; i < optionboard.length; i++) {
        if (optionboard[i].mouseInside()) {
            if (optionboard[i].clickable && currentPlayer == clientID) {
                // console.log(optionboard[i].colour);
                flashTiles(false);
                socket.emit("move", { chosenColour: optionboard[i].colour, gameID, clientID });
            }
        }
    }
}

function popOut(player) {
    let totalX = 0,
        totalY = 0;
    let total = 0;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner == player) {
                totalX += board[i][j].realPos.x;
                totalY += board[i][j].realPos.y;
                total++;
            }
        }
    }
    let avgX = totalX / total;
    let avgY = totalY / total;

    let scalePoint = createVector(avgX, avgY);

    let limit = 50;
    let current = 0;

    const scaleAmount = 1.004;
    const delay = 0.2;

    let popIn = setInterval(() => {
        scalePlayerSquares(player, scalePoint, scaleAmount);
        if (current >= limit) {
            clearInterval(popIn);
            current = 0;
            let popOut = setInterval(() => {
                scalePlayerSquares(player, scalePoint, 1 / scaleAmount);
                if (current >= limit) {
                    clearInterval(popOut);
                    // clearPositions(player);
                }
                current++;
            }, delay);
        }
        current++;
    }, delay);
}

function clearPositions(player) {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner == player) {
                board[i][j].resetPos();
            }
        }
    }
}

function scalePlayerSquares(player, scalePoint, SF) {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner == player) {
                board[i][j].realPos.sub(scalePoint).mult(SF).add(scalePoint);
                board[i][j].size *= SF;
            }
        }
    }
}