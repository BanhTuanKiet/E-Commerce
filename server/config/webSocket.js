const { WebSocketServer } = require('ws')
const jwt = require("jsonwebtoken")
const ErrorException = require("../util/errorException.js")

const wsClients = new Map()
let wss = null

function initWebSocketServer(server) {
  wss = new WebSocketServer({ server })

  wss.on('connection', async (ws, req) => {
    const params = new URLSearchParams(req.url.split("?")[1])
    const token = params.get("token")
    if (!token) return ws.close()

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decoded)
    if (!decoded._id) return ws.close()

    wsClients.set(decoded._id, ws)
    console.log(`User ${decoded._id} connected`)
    ws.on('close', () => wsClients.delete(decoded._id))
  })
}

function sendMessage(newMessage, targetUserId = null) {
  for (let [uid, client] of wsClients) {
    // if (client.readyState === client.OPEN) {zz
      // if (!targetUserId || uid === targetUserId) {
        client.send(JSON.stringify({ type: "reply", data: newMessage }))
      // }
    // }
  }
}

module.exports = {
  initWebSocketServer,
  sendMessage,
  wsClients
}
