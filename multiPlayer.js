let boardSquares = [];
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
    cnv = createCanvas(800, 900);

    // cnv.mouseClicked(eventMouse);

    cnv.parent("sketch");

    gridWidth = 700;
    gridHeight = (numRows * gridWidth) / numColumns;
    gridCenter = createVector(width / 2 - gridWidth / 2, 40);
    squareWidth = (gridWidth - padding) / numColumns;
    squareHeight = (gridHeight - padding) / numRows;

    YOff = gridCenter.y;
    XOff = gridCenter.x;

    // create board, filling with squares with a random colour which is not found in it's neighbours
    for (let row = 0; row < numRows; row++) {
        boardSquares[row] = new Array(numColumns);
        for (let col = 0; col < numColumns; col++) {
            let squareColour = getRandomAvailable(row, col, colours);
            boardSquares[row][col] = new boardSquare(row, col, squareColour);
        }
    }

    boardSquares[6][0].colour = boardSquares[0][7].colour;

    boardSquares[6][0].isPlayerOne = true;
    boardSquares[0][7].isPlayerTwo = true;

    // check if both players have the same colour
    if (boardSquares[6][0].colour == boardSquares[0][7].colour) {
        console.log("Both players were the same colour");
        let filtColors = colours.filter((item) => item !== boardSquares[0][7].colour);
        // console.log("filter colours", filtColors);
        boardSquares[6][0].colour = getRandomAvailable(6, 0, filtColors);
    }

    // create the clickable options
    for (let i = 0; i < colours.length; i++) {
        let optionTemp = new optionSquare(i);
        if (optionTemp.colour == boardSquares[0][7].colour || optionTemp.colour == boardSquares[6][0].colour) {
            optionTemp.clickable = false;
        }
        optionSquares.push(optionTemp);
    }

    boardSquares[6][0].colour = boardSquares[0][6].colour;

    boardSquares[1][7].colour = boardSquares[6][0].colour;

    console.log(boardSquares[6][0].colour, boardSquares[0][6].colour, boardSquares[1][7].colour);

    if (boardSquares[6][0].colour == boardSquares[0][6].colour && boardSquares[0][6].colour == boardSquares[1][7].colour) {
        console.log("starting player stuck");

        let filtColors = colours.filter((item) => item !== boardSquares[6][0].colour);

        boardSquares[0][6].colour = getRandomAvailable(0, 6, filtColors);
    }

    // if (squares[5][0].col == squares[6][1].col && squares[6][1].col == squares[0][7].col) {
    //     let theseColors = shuffle(colors);
    //     let thisColor = theseColors[0];

    //     while (!checkNeighbors(0, 5, thisColor)) {
    //         theseColors.shift();
    //         thisColor = theseColors[0];
    //     }
    //     squares[0][5].col = thisColor;
    //     console.log("trapped");
    // }

    noLoop();
}

function draw() {
    background(220);

    for (i = 0; i < numRows; i++) {
        for (j = 0; j < numColumns; j++) {
            // if (!boardSquares[i][j].isPlayerSquare) {
            boardSquares[i][j].show();
            // }
        }
    }

    for (let i = 0; i < optionSquares.length; i++) {
        optionSquares[i].show();
    }

    let colorArray = boardSquares.map((row) => row.map((s) => s.colour));

    // console.table(colorArray);
}