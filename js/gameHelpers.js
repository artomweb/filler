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