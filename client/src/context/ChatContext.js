import { useEffect } from "react"
import { createContext, useRef, useState } from "react"

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const wsRef = useRef(null)

  useEffect(() => {
    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  const disconnectWS = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      console.log("WS Disconnected manually")
    }
  }

  const connectWS = (token) => {
    if (wsRef.current) return
    const ws = new WebSocket(`ws://localhost:2908?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ WS Connected")
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      console.log("📩 WS Received:", msg)
      setMessages((prev) => [...prev, msg.data])
    }

    ws.onclose = () => {
      console.log("❌ WS Disconnected")
    }
  }

  return (
    <ChatContext.Provider value={{ messages, setMessages, connectWS }}>
      {children}
    </ChatContext.Provider>
  )
}

export { ChatContext, ChatProvider }