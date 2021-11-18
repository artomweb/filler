let board = [];

let numRows = 7,
    numColumns = 7;

let cellWidth;

function setup() {
    cnv = createCanvas(500, 500);

    cnv.parent("sketch");

    cellWidth = width / numColumns;

    for (let i = 0; i < numRows; i++) {
        board[i] = new Array(numColumns);
        for (let j = 0; j < numColumns; j++) {
            board[i][j] = { x: j * cellWidth + cellWidth / 2, y: i * cellWidth + cellWidth / 2, val: 0, visted: false };
        }
    }

    // board[numRows - 1][0].val = 1;
    // board[numRows - 1][1].val = 1;
    // board[numRows - 1][2].val = 1;
    // board[numRows - 1][3].val = 1;
    // board[numRows - 2][1].val = 1;
    // board[numRows - 2][2].val = 1;
    // board[numRows - 2][3].val = 1;
    // board[numRows - 3][1].val = 1;
    // board[numRows - 3][2].val = 1;
    // board[numRows - 3][3].val = 1;

    board[2][2].val = 1;
    board[2][3].val = 1;
    board[2][4].val = 1;
    board[3][1].val = 1;
    board[3][2].val = 1;
    board[3][3].val = 1;
    board[3][4].val = 1;
    board[3][5].val = 1;
    board[4][2].val = 1;
    board[4][3].val = 1;
    board[4][4].val = 1;

    // console.table(board);

    rectMode(CENTER);
}

// let cellsAround = [{x: }]

function getSquaresAroundPoint(i, j, lastDir) {
    let squaresAround;
}

function isNotValid(i, j) {
    if (!(board[i] && board[i][j])) {
        return true;
    }

    if (board[i] && board[i][j] && board[i][j].val == 0) {
        return true;
    }

    return false;
}

let squaresAround = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
];

function hasOneValidNeighbour(i, j) {
    let neighbours = [];
    for (let s of squaresAround) {
        if (board[i - s.y] && board[i - s.y][j - s.x] && board[i - s.y][j - s.x].val == 0) {
            neighbours.push(s);
        }
    }

    if (neighbours.length == 1) return neighbours[0];

    return false;
}

function draw() {
    background(220);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            board[i][j].val == 0 ? fill(255) : fill(0);
            rect(board[i][j].x, board[i][j].y, cellWidth);
        }
    }

    fill("red");
    // circle(board[numRows - 1][0].x - cellWidth / 2, board[numRows - 1][0].y + cellWidth / 2, 20);

    console.time("loop");
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (board[i][j].val == 1) {
                let convexCorner = false;
                if (isNotValid(i, j - 1) && isNotValid(i - 1, j)) {
                    fill("pink");
                    circle(board[i][j].x - cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    convexCorner = true;
                }
                if (isNotValid(i, j + 1) && isNotValid(i + 1, j)) {
                    fill("red");
                    circle(board[i][j].x + cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    convexCorner = true;
                }
                if (isNotValid(i - 1, j) && isNotValid(i, j + 1)) {
                    fill("blue");
                    circle(board[i][j].x + cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    convexCorner = true;
                }
                if (isNotValid(i, j - 1) && isNotValid(i + 1, j)) {
                    fill("orange");
                    circle(board[i][j].x - cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    convexCorner = true;
                }

                if (!convexCorner) {
                    if (!isNotValid(i, j - 1) && !isNotValid(i - 1, j) && isNotValid(i - 1, j - 1)) {
                        fill("green");
                        circle(board[i][j].x - cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    }

                    if (!isNotValid(i - 1, j) && !isNotValid(i, j + 1) && isNotValid(i - 1, j + 1)) {
                        fill("aqua");
                        circle(board[i][j].x + cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    }

                    if (!isNotValid(i, j - 1) && !isNotValid(i + 1, j) && isNotValid(i + 1, j - 1)) {
                        fill("cornsilk");
                        circle(board[i][j].x - cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    }
                    if (!isNotValid(i, j + 1) && !isNotValid(i + 1, j) && isNotValid(i + 1, j + 1)) {
                        fill("gold");
                        circle(board[i][j].x + cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    }
                }
            }
        }
    }

    console.timeEnd("loop");
    noLoop();
}