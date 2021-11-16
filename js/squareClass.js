class simpleSquare {
    mouseInside() {
        return mouseX >= this.realPos.x - this.size / 2 && mouseX < this.realPos.x + this.size / 2 && mouseY >= this.realPos.y - this.size / 2 && mouseY < this.realPos.y + this.size / 2;
    }
}

class boardSquare extends simpleSquare {
    constructor(row, col, serverBoard, squareColour, playerOwner) {
        super();
        this.boardPos = createVector(row, col);
        this.serverBoard = serverBoard;
        this.realPos = createVector(XOff + (col * squareWidth + squareWidth / 2), YOff + (row * squareHeight + squareHeight / 2));
        this.colour = squareColour;
        this.size = squareWidth;
        this.playerOwner = playerOwner;
    }

    show() {
        rectMode(CENTER);
        noStroke();
        fill(this.colour);
        rect(this.realPos.x, this.realPos.y, this.size + 1, this.size + 1);
    }

    resetPos() {
        this.realPos = createVector(XOff + (this.boardPos.y * squareWidth + squareWidth / 2), YOff + (this.boardPos.x * squareHeight + squareHeight / 2));
        this.size = squareWidth;
    }
}

class optionSquare extends boardSquare {
    constructor(i) {
        super();
        this.size = 200;
        this.realPos = createVector(this.size + 1 + i * 232, height - 200);
        this.colour = colours[i];
        this.clickable = true;
        this.sizeSmall = 56;
    }

    show() {
        rectMode(CENTER);
        noStroke();
        fill(this.colour);
        if (this.clickable) {
            square(this.realPos.x, this.realPos.y, this.size);
        } else {
            square(this.realPos.x, this.realPos.y, this.sizeSmall);
        }
    }
}