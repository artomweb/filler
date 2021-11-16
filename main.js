let socket = io("https://rppi.artomweb.com/filler", { reconnectionDelay: 500 });

let createGameButton = document.getElementById("createGameButton");
let joinGameButton = document.getElementById("joinGameButton");
let gameIDInput = document.getElementById("gameIDInput");
let overlayMsg = document.getElementById("overlayMsg");

let gameID;
let clientID;
let currentPlayer;
let notCurrentPlayer;
let opponentID;
let board;

function setUpGame(dataBoard) {
    board = dataBoard;
    console.log("board", board);
    boardInit();
}

function gameStep() {
    boardInit();
    if (currentPlayer == clientID) {
        overlayMsg.style.display = "none";
        notCurrentPlayer = opponentID;
    } else {
        overlayMsg.style.display = "block";
        overlayMsg.innerHTML = "waiting for other player to move...";
        notCurrentPlayer = clientID;
    }
    popOut(notCurrentPlayer);
}

socket.on("joinedGame", (data) => {
    console.log("joinGame", data);
    createMessage("", "Joined game!", "alert-success");
    gameID = data.gameID;
    currentPlayer = clientID;
    opponentID = data.host;
    setUpGame(data.board);
    gameStep();
});

socket.on("createdGameResponse", (data) => {
    console.log("created game", data);
    document.getElementById("gameLink").innerHTML = data.gameID;
    createMessage("", "Created game!", "alert-success");
    gameID = data.gameID;
    setUpGame(data.board);
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
    currentPlayer = data.opponentID;
    opponentID = data.opponentID;
    createMessage("Yay!", data.message, "alert-info");
    overlayMsg.style.display = "none";
    gameStep();
});

socket.on("gameUpdate", (data) => {
    console.log(data);
    currentPlayer = data.currentPlayer;
    board = data.board;
    gameStep();
});

socket.on("gameOver", (data) => {
    console.log(data);
    createMessage("", data.message, "alert-info", false);
    board = data.thisGame.board;
    gameStep();
});

function createMessage(name, message, type, timed = true) {
    let alertsCont = document.getElementById("alerts");

    if (alertsCont.childElementCount > 0) {
        // let thisAlert = new bootstrap.Alert(alertsCont.firstChild);
        // thisAlert.close();
        alertsCont.firstChild.remove();
    }

    let wrapper = document.createElement("div");

    wrapper.classList.add("alert", type, "alert-dismissible", "fade", "show");

    wrapper.innerHTML = "<strong>" + name + "</strong> " + message + '<button type="button" class="btn-close"data-bs-dismiss="alert"></button>';

    alertsCont.appendChild(wrapper);

    if (timed) {
        setTimeout(() => {
            let thisAlert = new bootstrap.Alert(wrapper);
            thisAlert.close();
            // if (wrapper.isConnected) {
            //     alertsCont.removeChild(wrapper);
            // }
        }, 4000);
    }
}

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