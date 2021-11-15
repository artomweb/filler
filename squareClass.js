class simpleSquare {
    mouseInside() {
        return mouseX >= this.pos.x - this.size / 2 && mouseX < this.realPos.x + this.size / 2 && mouseY >= this.realPos.y - this.size / 2 && mouseY < this.realPos.y + this.size / 2;
    }
}

class boardSquare extends simpleSquare {
    constructor(row, col, squareColour) {
        super();
        this.boardPos = createVector(row, col);
        this.realPos = createVector(XOff + (col * squareWidth + squareWidth / 2), YOff + (row * squareHeight + squareHeight / 2));
        this.colour = squareColour;
        this.size = squareWidth;
        this.isPlayerOne = false;
        this.isPlayerTwo = false;
    }

    show() {
        rectMode(CENTER);
        noStroke();
        fill(this.colour);
        rect(this.realPos.x, this.realPos.y, this.size + 1, this.size + 1);
    }
}

class optionSquare extends boardSquare {
    constructor(i) {
        super();
        this.realPos = createVector(85 + i * 125, height - 100);
        this.colour = colours[i];
        this.clickable = true;
        this.size = 85;
        this.sizeSmall = 30;
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