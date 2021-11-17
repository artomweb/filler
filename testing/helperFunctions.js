/**
 * Returns a valid colour that is not present in the given squares neighbours
 * @param {number} row The row of the square to check
 * @param {number} col The column of the square to check
 * @return {string} The colour chosen
 */

function getRandomAvailable(row, col, coloursToChoose) {
    let neighborColors = getNeighborColors(row, col);

    let theseColors = coloursToChoose.filter((x) => !neighborColors.includes(x));

    // console.log(theseColors);

    let thisColor = random(theseColors);

    return thisColor;
}

let squaresToCheck = [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
];

/**
 * Returns an array of the neighbouring colours
 * @param {number} row The row of the square to check
 * @param {number} col The column of the square to check
 * @return {Array} Array of neighbouring colours
 */
function getNeighborColors(y, x) {
    let neighborColors = [];
    for (let c of squaresToCheck) {
        if (boardSquares[y - c.y] && boardSquares[y - c.y][x - c.x]) {
            neighborColors.push(boardSquares[y - c.y][x - c.x].colour);
        }
    }

    return neighborColors;
}