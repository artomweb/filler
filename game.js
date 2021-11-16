let optionSquares = [];

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

    cnv.mouseClicked(eventMouse);

    cnv.parent("sketch");

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
    optionSquares = [];
    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            let thisSquare = board[i][j];
            board[i][j] = new boardSquare(i, j, thisSquare.serverBoard, thisSquare.colour);
        }
    }

    // create the clickable options
    for (let i = 0; i < colours.length; i++) {
        let optionTemp = new optionSquare(i);
        console.log(optionTemp.colour);
        if (optionTemp.colour == board[6][0].colour || optionTemp.colour == board[0][7].colour) {
            optionTemp.clickable = false;
        }
        optionSquares.push(optionTemp);
    }
}

function draw() {
    background(220);

    if (!board) return;

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            // if (!boardSquares[i][j].isPlayerSquare) {
            board[i][j].show();
            // console.log(board[i][j]);
            // }
        }
    }

    for (let i = 0; i < optionSquares.length; i++) {
        optionSquares[i].show();
    }
}

function eventMouse() {
    for (let i = 0; i < optionSquares.length; i++) {
        if (optionSquares[i].mouseInside()) {
            if (optionSquares[i].clickable) {
                console.log(optionSquares[i].colour);
                socket.emit("move", { chosenColour: optionSquares[i].colour });
            }
        }
    }
}