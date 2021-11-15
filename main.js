let socket = io("https://rppi.artomweb.com/filler", { reconnectionDelay: 500 });

let createGameButton = document.getElementById("createGameButton");
let joinGameButton = document.getElementById("joinGameButton");
let gameIDInput = document.getElementById("gameIDInput");

let gameID;
let clientID;

socket.on("joinedGame", (data) => {
    console.log("joinGame", data);
    gameID = data.gameID;
});

socket.on("createdGameResponse", (data) => {
    console.log("created game", data);
    document.getElementById("gameLink").innerHTML = data.gameID;
});

socket.on("newClient", (data) => {
    clientID = data.clientID;
    console.log("newClient", data);
});
socket.on("error", (data) => {
    console.log("error", data);
    let alertsCont = document.getElementById("alerts");

    if (alertsCont.childElementCount > 0) {
        // let thisAlert = new bootstrap.Alert(alertsCont.firstChild);
        // thisAlert.close();
        alertsCont.firstChild.remove();
    }

    let wrapper = document.createElement("div");

    wrapper.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show");

    wrapper.innerHTML = "<strong>Hmmmm </strong>" + data.message + '<button type="button" class="btn-close"data-bs-dismiss="alert"></button>';

    alertsCont.appendChild(wrapper);

    setTimeout(() => {
        let thisAlert = new bootstrap.Alert(wrapper);
        thisAlert.close();
        // if (wrapper.isConnected) {
        //     alertsCont.removeChild(wrapper);
        // }
    }, 5000);
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
    socket.emit("joinGame", { gameID: gameIDInput.value });
});