let board = [];

let numRows = 7,
    numColumns = 7;

let cellWidth;

let orderedCornerList = [];

let drawnLines = [];
let currentLine = 0;
let currentStartPoint;
let currentEndPoint;

let linePointOne, linePointTwo;

let col;

function setup() {
    cnv = createCanvas(500, 500);

    cnv.parent("sketch");

    cellWidth = Math.round((width / numColumns) * 100) / 100;

    for (let i = 0; i < numRows; i++) {
        board[i] = new Array(numColumns);
        for (let j = 0; j < numColumns; j++) {
            board[i][j] = { x: j * cellWidth + cellWidth / 2, y: i * cellWidth + cellWidth / 2, val: 0, colour: colours[Math.floor(Math.random() * colours.length)] };
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

    board[1][2].val = 1;
    board[1][3].val = 1;
    board[1][4].val = 1;
    board[2][1].val = 1;
    board[2][2].val = 1;
    board[2][3].val = 1;
    board[2][4].val = 1;
    board[2][5].val = 1;
    board[3][2].val = 1;
    board[3][3].val = 1;
    board[3][4].val = 1;
    board[4][1].val = 1;
    board[4][2].val = 1;
    board[4][3].val = 1;
    board[4][4].val = 1;
    board[4][5].val = 1;
    board[5][1].val = 1;
    board[5][2].val = 1;
    board[5][3].val = 1;
    board[5][4].val = 1;
    board[5][5].val = 1;
    // console.table(board);

    rectMode(CENTER);

    console.time("Get ordered corners");
    let corners = getCorners();
    orderedCornerList = orderCorners(corners);
    console.timeEnd("Get ordered corners");

    currentStartPoint = orderedCornerList[currentLine];
    currentEndPoint = orderedCornerList[currentLine + 1];

    linePointOne = currentStartPoint;
    linePointTwo = currentStartPoint;

    col = color("white");
}

// let cellsAround = [{x: }]

function isValid(i, j) {
    if (!(board[i] && board[i][j])) {
        return false;
    }

    if (board[i] && board[i][j] && board[i][j].val == 0) {
        return false;
    }

    return true;
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

function getCornersBy(corners, corner) {
    let otherAxis = corner.axis == "x" ? "y" : "x";
    return corners
        .filter((c) => Math.floor(c[otherAxis]) == Math.floor(corner[otherAxis]))
        .filter((c) => Math.floor(c[corner.axis]) !== Math.floor(corner[corner.axis]))
        .sort((a, b) => a[corner.axis] - b[corner.axis]);
}

let t = 0;

let drawnPoints = [];

let lineDrawn = false;

let alpha = 255;

const colours = ["#F83D5C", "#AFDD6A", "#4DB3F6", "#6A4CA3", "#4A474A", "#F3D51E"];

function draw() {
    background(220);

    // stroke("black");
    noStroke();
    fill("pink");
    // strokeWeight(1);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            board[i][j].val == 0 ? fill(220) : fill(board[i][j].colour);
            rect(board[i][j].x, board[i][j].y, cellWidth);
        }
    }

    if (lineDrawn) {
        col.setAlpha(alpha);
        stroke(col);
        strokeWeight(5);

        for (let i = 0; i < drawnPoints.length - 1; i += 2) {
            // console.log("line");
            line(drawnPoints[i].x, drawnPoints[i].y, drawnPoints[i + 1].x, drawnPoints[i + 1].y);
        }

        alpha -= 2;

        return;
    }

    // fill("black");

    if (t > 1) {
        t = 0;
        drawnPoints.push(currentStartPoint, currentEndPoint);
        currentLine++;

        if (currentLine > orderedCornerList.length - 2) {
            // console.log("current line too high");
            lineDrawn = true;
            // drawnPoints = [];
            currentLine = 0;
        }
        currentStartPoint = orderedCornerList[currentLine];
        currentEndPoint = orderedCornerList[currentLine + 1];
    }

    stroke("white");
    strokeWeight(5);

    for (let i = 0; i < drawnPoints.length - 1; i++) {
        // console.log("line");
        line(drawnPoints[i].x, drawnPoints[i].y, drawnPoints[i + 1].x, drawnPoints[i + 1].y);
    }

    // console.log(currentStartPoint, currentEndPoint);

    line(currentStartPoint.x, currentStartPoint.y, linePointTwo.x, linePointTwo.y);

    // circle(linePointTwo.x, linePointTwo.y, 20);

    linePointTwo = p5.Vector.lerp(currentStartPoint, currentEndPoint, t);

    t += 0.05 * (150 / currentStartPoint.dist(currentEndPoint));

    // console.log(t);

    // console.log(currentEndPoint);

    // currentLine++;
    // console.log(orderedCornerList);
    // noLoop();
}

function getCorners() {
    let corners = [];
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            if (board[i][j].val == 1) {
                let isConvex = false;
                if (!isValid(i, j - 1) && !isValid(i - 1, j)) {
                    // fill("pink");
                    // circle(board[i][j].x - cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    corners.push({ x: board[i][j].x - cellWidth / 2, y: board[i][j].y - cellWidth / 2, axis: "x", dir: 1 });
                    isConvex = true;
                }
                if (!isValid(i, j + 1) && !isValid(i + 1, j)) {
                    // fill("red");
                    // circle(board[i][j].x + cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    corners.push({ x: board[i][j].x + cellWidth / 2, y: board[i][j].y + cellWidth / 2, axis: "x", dir: -1 });
                    isConvex = true;
                }
                if (!isValid(i - 1, j) && !isValid(i, j + 1)) {
                    // fill("blue");
                    // circle(board[i][j].x + cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                    corners.push({ x: board[i][j].x + cellWidth / 2, y: board[i][j].y - cellWidth / 2, axis: "y", dir: 1 });
                    isConvex = true;
                }
                if (!isValid(i, j - 1) && !isValid(i + 1, j)) {
                    // fill("orange");
                    // circle(board[i][j].x - cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                    corners.push({ x: board[i][j].x - cellWidth / 2, y: board[i][j].y + cellWidth / 2, axis: "y", dir: -1 });
                    isConvex = true;
                }

                if (!isConvex) {
                    if (isValid(i, j - 1) && isValid(i - 1, j) && !isValid(i - 1, j - 1)) {
                        // fill("green");
                        // circle(board[i][j].x - cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                        corners.push({ x: board[i][j].x - cellWidth / 2, y: board[i][j].y - cellWidth / 2, axis: "y", dir: -1 });
                    }
                    if (isValid(i - 1, j) && isValid(i, j + 1) && !isValid(i - 1, j + 1)) {
                        // fill("aqua");
                        // circle(board[i][j].x + cellWidth / 2, board[i][j].y - cellWidth / 2, 20);
                        corners.push({ x: board[i][j].x + cellWidth / 2, y: board[i][j].y - cellWidth / 2, axis: "x", dir: 1 });
                    }

                    if (isValid(i, j - 1) && isValid(i + 1, j) && !isValid(i + 1, j - 1)) {
                        // fill("cornsilk");
                        // circle(board[i][j].x - cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                        corners.push({ x: board[i][j].x - cellWidth / 2, y: board[i][j].y + cellWidth / 2, axis: "x", dir: -1 });
                    }
                    if (isValid(i, j + 1) && isValid(i + 1, j) && !isValid(i + 1, j + 1)) {
                        // fill("gold");
                        // circle(board[i][j].x + cellWidth / 2, board[i][j].y + cellWidth / 2, 20);
                        corners.push({ x: board[i][j].x + cellWidth / 2, y: board[i][j].y + cellWidth / 2, axis: "y", dir: 1 });
                    }
                }
            }
        }
    }
    return corners;
}

function orderCorners(corners) {
    const BLC = createVector(board[6][0].x - cellWidth / 2, board[6][0].y + cellWidth / 2);

    const distance = (coor1, coor2) => {
        const x = coor2.x - coor1.x;
        const y = coor2.y - coor1.y;
        return Math.sqrt(x * x + y * y);
    };

    corners.sort((a, b) => distance(a, BLC) - distance(b, BLC));

    let current_axis = corners[0].axis;
    let current_dir = corners[0].dir;

    let orderedCornerList = [corners[0]];

    let currentCorner = corners[0];

    while (orderedCornerList.length < corners.length + 1) {
        let sameOrderedC = getCornersBy(corners, currentCorner, current_axis);
        let nextCorner;

        if (current_dir == -1 && current_axis == "y") {
            nextCorner = _.chain(sameOrderedC)
                .filter((c) => c[current_axis] < currentCorner[current_axis])
                .maxBy(current_axis)
                .value();
        } else if (current_dir == 1 && current_axis == "y") {
            nextCorner = _.chain(sameOrderedC)
                .filter((c) => c[current_axis] > currentCorner[current_axis])
                .minBy(current_axis)
                .value();
        } else if (current_dir == 1 && current_axis == "x") {
            nextCorner = _.chain(sameOrderedC)
                .filter((c) => c[current_axis] > currentCorner[current_axis])
                .minBy(current_axis)
                .value();
        } else if (current_dir == -1 && current_axis == "x") {
            nextCorner = _.chain(sameOrderedC)
                .filter((c) => c[current_axis] < currentCorner[current_axis])
                .maxBy(current_axis)
                .value();
        }

        orderedCornerList.push(nextCorner);

        // circle(currentCorner.x, currentCorner.y, 30);
        // stroke("red");
        // strokeWeight(5);

        // line(currentCorner.x, currentCorner.y, nextCorner.x, nextCorner.y);

        // noStroke();
        // circle(currentCorner.x, currentCorner.y, 20);

        currentCorner = nextCorner;
        current_axis = nextCorner.axis;
        current_dir = nextCorner.dir;
    }

    let cornerVec = orderedCornerList.map((corner) => createVector(corner.x, corner.y));

    return cornerVec;
}