let errors = {username: "", port: ""}
let valid = false

let buttonSubmit = document.getElementById("button")
let usernameInputError = document.getElementById("error-username-input")
let portInputError = document.getElementById("error-port-input")


function handleSubmit(username) {
    const name = username

    localStorage.setItem("NAME", name)

    return
}

buttonSubmit.addEventListener("click", () => {
    event.preventDefault()

    let usernameInput = document.getElementById("username-input")
    let portInput = document.getElementById("port-input")



    handleSubmit(usernameInput.value)

    valid = true

    if (usernameInput.value === "") {
        valid = false
        errors.username = "Username can't be empty!"
    } else errors.username = ""

    if (portInput.value === "" || portInput.value !== "54000") {
        valid = false
        errors.port = "Port must be 54000!"
    } else errors.port = ""

    if (valid) {
        window.location.href = "./index.html";
    } else {
        usernameInputError.innerText = errors.username
        portInputError.innerText = errors.port
    }
})


