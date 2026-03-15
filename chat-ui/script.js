const state = {
    messages: []
}

const chatMessages = document.getElementById("chatMessages")
const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")

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

    saveMessages()

}

function sendMessage(text) {

    const message = {
        id: Date.now(),
        text: text,
        sender: "sent",
        timestamp: new Date().toLocaleTimeString()
    }

    state.messages.push(message)

    render()

    simulateReply()

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

function simulateReply() {

    setTimeout(() => {

        const reply = {
            id: Date.now(),
            text: "Got your message 👍",
            sender: "received",
            timestamp: new Date().toLocaleTimeString()
        }

        state.messages.push(reply)

        render()

    }, 1000)

}

function saveMessages() {

    localStorage.setItem("chatMessages", JSON.stringify(state.messages))

}