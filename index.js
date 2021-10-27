let padding = 10;
let gridSize;
let gridWidth, gridHeight;
let gridOrigin;
let squareWidth, squareHeight;

function setup() {
  cnv = createCanvas(400, 600);
  // cnv.mouseClicked(changeGray);
  gridOrigin = createVector(0, 0);
  gridWidth = 400;
  gridWidth = 400;
  squareWidth = gridWidth / gridSize;
  squareHeight = gridHeight / gridSize;
}

function draw() {
  background(220);
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
  }

  show() {
    rectMode(CENTER);

    fill(this.col);
    rect(this.realPos.x, this.realPos.y, boxWidth - 10, boxHeight - 10, 5);
  }
}
