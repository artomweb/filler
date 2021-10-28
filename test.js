const numColumns = 8;
const numRows = 7;

let squares = new Array(numColumns);

const colors = ["A", "B", "C", "D", "E", "F"];

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

for (i = 0; i < numColumns; i++) {
    let combinedColors = shuffle([...colors, ...colors]);
    console.log(combinedColors);
    squares[i] = new Array(numRows);
    for (j = 0; j < numRows; j++) {
        squares[i][j] = combinedColors[j];
    }
}

console.table(squares);