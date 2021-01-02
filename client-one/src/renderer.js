const net = require('net')
const ipcRenderer = require('electron').ipcRenderer

let msg = document.getElementById("chat-messages");
let button = document.getElementById("button");
let textBox = document.getElementById("message-text");
let userConnStatus = document.getElementById("user-status")

const socket = {
    port: 54000,
    readable: true,
    writable:true
}

const client = net.createConnection(socket);

function updateScroll() {
    msg.scrollTop = msg.scrollHeight
}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


button.addEventListener("click", function () {
    let str = textBox.value;
    if (str !== "") {
        ipcRenderer.send('my-message', str)
        let currentTime = formatAMPM(new Date)
        msg.innerHTML += "<div id='sender-massage'><div" +
            " id='bubble-image-me'></div> <div class='bubble me'><p>" + str + "<p" +
            " class='current-time'>" + currentTime + "</p></p></div></div>";
    }
    textBox.value = ""
    updateScroll()
});

textBox.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        button.click();
    }
});

ipcRenderer.on('received-message', (event, message) => {
    let currentTime = formatAMPM(new Date)
    msg.innerHTML += "<div id='received-message'><div" +
        " id='bubble-image-you'></div> <div class='bubble you'><p>" + message + "<p" +
        " class='current-time-you'>" + currentTime + "</p></p></div></div>";
    updateScroll()
})


let checkedValue = document.querySelector('.messageCheckbox');

checkedValue.addEventListener("click", () => {
    if (checkedValue.checked) {
        ipcRenderer.send('switch-status', true)
        userConnStatus.innerText = "Online"
    } else {
        ipcRenderer.send('switch-status', false)
        userConnStatus.innerText = "Offline"
    }
})

let usernameTop = document.getElementById("user-name")
usernameTop.innerHTML = localStorage.getItem("NAME")
