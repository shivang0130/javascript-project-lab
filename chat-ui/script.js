const state = {
    messages: []
}

const chatMessages = document.getElementById("chatMessages")
const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")

const clientId = crypto.randomUUID()

const socket = new WebSocket("ws://localhost:3000")

socket.addEventListener("message", (event) => {

    const message = JSON.parse(event.data)

    message.sender = message.clientId === clientId ? "sent" : "received"

    state.messages.push(message)

    render()

})

function render() {

    chatMessages.innerHTML = ""

    state.messages.forEach(msg => {

        const messageEl = document.createElement("div")

        messageEl.className = `message ${msg.sender}`

        messageEl.innerHTML = `
<div>${msg.text}</div>
<small>${msg.timestamp}</small>
`

        chatMessages.appendChild(messageEl)

    })

    scrollToBottom()

}

function sendMessage(text) {

    const message = {
        id: Date.now(),
        text: text,
        clientId: clientId,
        timestamp: new Date().toLocaleTimeString()
    }

    socket.send(JSON.stringify(message))

}

sendBtn.addEventListener("click", () => {

    const text = input.value.trim()

    if (!text) return

    sendMessage(text)

    input.value = ""

})

input.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        sendBtn.click()

    }

})

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight

}

