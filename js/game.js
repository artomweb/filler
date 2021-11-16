let optionboard = [];

let padding = 10;
let YOff, XOff;

let numRows = 7,
    numColumns = 8;

let gridWidth, gridHeight;
let gridCenter;
let squareWidth, squareHeight;

const colours = ["#F83D5C", "#AFDD6A", "#4DB3F6", "#6A4CA3", "#4A474A", "#F3D51E"];

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
        // console.log(optionTemp.colour);
        if (optionTemp.colour == board[6][0].colour || optionTemp.colour == board[0][7].colour) {
            optionTemp.clickable = false;
        }
        optionboard.push(optionTemp);
    }
}

function draw() {
    background(220);

    if (!board) return;

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            // if (board[i][j].playerOwner != currentPlayer) {
            board[i][j].show();
            // console.log(board[i][j]);
            // }
        }
    }

    // console.log(currentPlayer);

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            if (board[i][j].playerOwner == notCurrentPlayer) {
                board[i][j].show();
                // console.log(board[i][j]);
            }
        }
    }

    for (let i = 0; i < optionboard.length; i++) {
        optionboard[i].show();
    }
}

function eventMouse() {
    for (let i = 0; i < optionboard.length; i++) {
        if (optionboard[i].mouseInside()) {
            if (optionboard[i].clickable && currentPlayer == clientID) {
                // console.log(optionboard[i].colour);
                socket.emit("move", { chosenColour: optionboard[i].colour, gameID, clientID });
            }
        }
    }
}

function popOut(player) {
    // console.log(player);
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
    // playerboard[i].gray = true;

    // playerboard[i].col = playerboard[0].col;

    // console.log(totalX, totalY);
    let avgX = totalX / total;
    let avgY = totalY / total;

    let scalePoint = createVector(avgX, avgY);

    // console.log(scalePoint);

    let limit = 50;
    let current = 0;

    let scaleAmount = 1.004;
    let delay = 0.2;

    let popIn = setInterval(() => {
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numColumns; j++) {
                if (board[i][j].playerOwner == player) {
                    board[i][j].realPos.sub(scalePoint).mult(scaleAmount).add(scalePoint);
                    board[i][j].size *= scaleAmount;
                }
            }
        }
        // console.log("out");
        if (current >= limit) {
            // console.log("CLEARED");
            clearInterval(popIn);
            current = 0;
            let popOut = setInterval(() => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColumns; j++) {
                        if (board[i][j].playerOwner == player) {
                            board[i][j].realPos
                                .sub(scalePoint)
                                .mult(1 / scaleAmount)
                                .add(scalePoint);
                            board[i][j].size *= 1 / scaleAmount;
                        }
                    }
                }
                // console.log("out");
                if (current >= limit) {
                    // console.log("CLEARED");
                    clearInterval(popOut);
                    for (let i = 0; i < numRows; i++) {
                        for (let j = 0; j < numColumns; j++) {
                            if (board[i][j].playerOwner == player) {
                                board[i][j].resetPos();
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