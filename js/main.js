let socket = io("https://rppi.artomweb.com/filler", { reconnectionDelay: 500 });

let createGameButton = document.getElementById("createGameButton");
let joinGameButton = document.getElementById("joinGameButton");
let gameIDInput = document.getElementById("gameIDInput");
let overlayMsg = document.getElementById("overlayMsg");

let gameID;

let clientID;
let opponentID;

let currentPlayer;
let notCurrentPlayer;

let board;

function setUpGame(data) {
    board = data.board;
    gameID = data.gameID;
    console.log("board", data.board);
    boardInit();
}

function gameStep(popT = true) {
    boardInit();
    if (currentPlayer == clientID) {
        overlayMsg.style.display = "none";
        notCurrentPlayer = opponentID;
        flashTiles(true);
    } else if (currentPlayer == opponentID) {
        overlayMsg.style.display = "block";
        overlayMsg.innerHTML = "waiting for other player to move...";
        notCurrentPlayer = clientID;
    }
    if (popT) {
        popOut(notCurrentPlayer);
    }
}

socket.on("joinedGame", (data) => {
    console.log("joinGame", data);
    createMessage("", "Joined game!", "alert-success");
    currentPlayer = clientID;
    opponentID = data.host;
    setUpGame(data);
    gameStep((popT = false));
});

socket.on("createdGameResponse", (data) => {
    console.log("created game", data);
    document.getElementById("gameLink").innerHTML = data.gameID;
    createMessage("", "Created game!", "alert-success");

    setUpGame(data);
    overlayMsg.innerHTML = "waiting for player to join...";
    overlayMsg.style.display = "block";
});

socket.on("newClient", (data) => {
    clientID = data.clientID;
    console.log("newClient", data);
});

socket.on("error", (data) => {
    console.log("error", data);
    createMessage("hmmmmm", data.message, "alert-warning");
});

socket.on("playerConnected", (data) => {
    console.log("playerConnected", data);
    let thisGame = data.thisGame;
    currentPlayer = thisGame.currentPlayer;
    opponentID = thisGame.client;
    board = thisGame.board;
    createMessage("Yay!", data.message, "alert-info");
    overlayMsg.style.display = "none";
    gameStep((popT = false));
});

socket.on("gameUpdate", (data) => {
    console.log(data);
    currentPlayer = data.currentPlayer;
    board = data.board;
    gameStep();
});

socket.on("gameOver", (data) => {
    console.log(data);
    flashTiles(false);
    overlayMsg.style.display = "none";
    if (data.status == "WIN") {
        createMessage("", data.message, "alert-success", false);
    } else if (data.status == "LOST") {
        createMessage("", data.message, "alert-danger", false);
    } else {
        createMessage("", data.message, "alert-info", false);
    }
    board = data.thisGame.board;
    gameStep();
    overlayMsg.style.display = "none";
});

createGameButton.addEventListener("click", (e) => {
    setTimeout(() => {
        createGameButton.blur();
    }, 300);
    socket.emit("createGame", { clientID });
});

joinGameButton.addEventListener("click", (e) => {
    setTimeout(() => {
        joinGameButton.blur();
    }, 300);
    socket.emit("joinGame", { gameID: gameIDInput.value, clientID });
});

// setTimeout(() => {
//     createGameButton.click();
// }, 500);