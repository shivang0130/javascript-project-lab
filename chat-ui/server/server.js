const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 3000 })

const clients = new Set()

wss.on("connection", (ws) => {

    console.log("User connected")

    clients.add(ws)

    ws.on("message", (message) => {

        try {

            const parsedMessage = JSON.parse(message)

            console.log(
                `Message from client ${parsedMessage.clientId}: ${parsedMessage.text}`
            )

            clients.forEach(client => {

                if (client.readyState === WebSocket.OPEN) {

                    client.send(JSON.stringify(parsedMessage))

                }

            })

        } catch (err) {

            console.error("Invalid message received:", message)

        }

    })

    ws.on("close", () => {

        clients.delete(ws)

        console.log("User disconnected")

    })

})

console.log("WebSocket server running on ws://localhost:3000")