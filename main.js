let socket = io("https://rppi.artomweb.com/filler", { reconnectionDelay: 500 });

let createGameButton = document.getElementById("createGameButton");
let joinGameButton = document.getElementById("joinGameButton");
let gameIDInput = document.getElementById("gameIDInput");
let waiting = document.getElementById("waiting");

let gameID;
let clientID;
let board;

function setUpGame(dataBoard) {
    board = dataBoard;
    console.log("board", board);
    boardInit();
    waiting.style.display = "block";
}

socket.on("joinedGame", (data) => {
    console.log("joinGame", data);
    createMessage("", "Joined game!", "alert-success");
    setUpGame(data.board);
});

socket.on("createdGameResponse", (data) => {
    console.log("created game", data);
    document.getElementById("gameLink").innerHTML = data.gameID;
    createMessage("", "Created game!", "alert-success");
    setUpGame(data.board);
});

socket.on("newClient", (data) => {
    clientID = data.clientID;
    console.log("newClient", data);
});

socket.on("error", (data) => {
    console.log("error", data);
    createMessage("hmmmmm", data.message, "alert-warning");
});

function createMessage(name, message, type) {
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

    setTimeout(() => {
        let thisAlert = new bootstrap.Alert(wrapper);
        thisAlert.close();
        // if (wrapper.isConnected) {
        //     alertsCont.removeChild(wrapper);
        // }
    }, 4000);
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
    socket.emit("joinGame", { gameID: gameIDInput.value });
});