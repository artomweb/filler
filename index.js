let padding = 10;
let numRows = 7,
  numColumns = 8;
let gridWidth, gridHeight;
let gridOrigin;
let squareWidth, squareHeight;

let squares = new Array(numColumns);
let optionSquares = [];

let colors = ["F83D5C", "AFDD6A", "4DB3F6", "6A4CA3", "4A474A", "F3D51E"];

let playerSquares = [];

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
      let squareTemp = new playSquare(i, j);
      squares[i][j] = squareTemp;
    }
  }

  if (squares[0][6].col == squares[7][0].col) {
    console.log(squares[0][6].col, squares[7][0].col);
    let filtColors = colors.filter(
      (item) => item !== squares[7][0].col.replace("#", "")
    );
    console.log(filtColors);
    squares[0][6].col = "#" + random(filtColors);
  }

  for (let i = 0; i < colors.length; i++) {
    let optionTemp = new optionSquare(i);
    if (
      optionTemp.col == squares[7][0].col ||
      optionTemp.col == squares[0][6].col
    ) {
      optionTemp.clickable = false;
    }
    optionSquares.push(optionTemp);
  }

  squares[0][6].isPlayerSquare = true;
}

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

function addNeighbors(x, y, col) {
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      if (
        typeof squares[x - i] !== "undefined" &&
        typeof squares[x - i][y - j] !== "undefined"
      ) {
        console.log(squares[x - i][y - j].col);
        if (squares[x - i][y - j].col == col) {
          squares[x - i][y - j].isPlayerSquare = true;
          console.log(squares[i][j]);
        }
      }
    }
  }
}

function optionClicked(col) {
  for (i = 0; i < numColumns; i++) {
    for (j = 0; j < numRows; j++) {
      if (squares[i][j].isPlayerSquare) {
        addNeighbors(i, j, col);
      }
    }
  }
}

function eventMouse() {
  for (let i = 0; i < optionSquares.length; i++) {
    if (optionSquares[i].mouseInside()) {
      if (optionSquares[i].clickable) {
        optionClicked(optionSquares[i].col);
      }
    }
  }

  for (i = 0; i < numColumns; i++) {
    for (j = 0; j < numRows; j++) {
      squares[i][j].show();
    }
  }
}

function popOut() {
  let totalX = 0,
    totalY = 0;
  for (let i = 0; i < playerSquares.length; i++) {
    // playerSquares[i].gray = true;
    totalX += playerSquares[i].realPos.x;
    totalY += playerSquares[i].realPos.y;
    // playerSquares[i].col = playerSquares[0].col;
  }
  // console.log(totalX, totalY);
  let avgX = totalX / playerSquares.length;
  let avgY = totalY / playerSquares.length;

  let scalePoint = createVector(avgX, avgY);

  // console.log(scalePoint);

  let limit = 50;
  let current = 0;

  let scaleAmount = 1.005;
  let delay = 0.1;

  let popIn = setInterval(() => {
    for (let i = 0; i < playerSquares.length; i++) {
      playerSquares[i].realPos.x =
        (playerSquares[i].realPos.x - scalePoint.x) * scaleAmount +
        scalePoint.x;
      playerSquares[i].realPos.y =
        (playerSquares[i].realPos.y - scalePoint.y) * scaleAmount +
        scalePoint.y;
      playerSquares[i].width *= scaleAmount;
      playerSquares[i].height *= scaleAmount;
    }
    // console.log("out");
    if (current >= limit) {
      // console.log("CLEARED");
      clearInterval(popIn);
      current = 0;
      let popOut = setInterval(() => {
        for (let i = 0; i < playerSquares.length; i++) {
          playerSquares[i].realPos.x =
            (playerSquares[i].realPos.x - scalePoint.x) * (1 / scaleAmount) +
            scalePoint.x;
          playerSquares[i].realPos.y =
            (playerSquares[i].realPos.y - scalePoint.y) * (1 / scaleAmount) +
            scalePoint.y;
          playerSquares[i].width *= 1 / scaleAmount;
          playerSquares[i].height *= 1 / scaleAmount;
        }
        // console.log("out");
        if (current >= limit) {
          // console.log("CLEARED");
          clearInterval(popOut);
          for (let i = 0; i < playerSquares.length; i++) {
            playerSquares[i].resetPos();
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
    this.col = "#" + colors[i];
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
    return (
      mouseX >= this.pos.x - this.size / 2 &&
      mouseX < this.pos.x + this.size / 2 &&
      mouseY >= this.pos.y - this.size / 2 &&
      mouseY < this.pos.y + this.size / 2
    );
  }
}

class playSquare {
  constructor(i, j) {
    this.gridPos = createVector(i, j);
    this.realPos = createVector(
      gridOrigin.x +
        (padding / 2 + (this.gridPos.x * squareWidth + squareWidth / 2)),
      gridOrigin.y +
        (padding / 2 + (this.gridPos.y * squareHeight + squareHeight / 2))
    );
    this.col = "#" + random(colors);
    this.width = squareWidth;
    this.height = squareHeight;
    this.isPlayerSquare = false;
  }

  resetPos() {
    this.realPos = createVector(
      gridOrigin.x +
        (padding / 2 + (this.gridPos.x * squareWidth + squareWidth / 2)),
      gridOrigin.y +
        (padding / 2 + (this.gridPos.y * squareHeight + squareHeight / 2))
    );
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

    rect(this.realPos.x, this.realPos.y, this.width + 0.5, this.height + 0.5);

    // rect(this.realPos.x, this.realPos.y, 20);
  }

  mouseInside() {
    return (
      mouseX >= this.pos.x - this.width / 2 &&
      mouseX < this.pos.x + this.width / 2 &&
      mouseY >= this.pos.y - this.height / 2 &&
      mouseY < this.pos.y + this.height / 2
    );
  }
}
