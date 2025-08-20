import { WebSocketServer } from 'ws'
import jwt from "jsonwebtoken"
import ErrorException from "../util/errorException.js"

const wsClients = new Map()
let wss = null

export function initWebSocketServer(server) {
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

export function sendMessage(newMessage, targetUserId = null) {
  for (let [uid, client] of wsClients) {
    // if (client.readyState === client.OPEN) {zz
      // if (!targetUserId || uid === targetUserId) {
        client.send(JSON.stringify({ type: "reply", data: newMessage }))
      // }
    // }
  }
}

export { wsClients }