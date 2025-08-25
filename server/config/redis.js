const { createClient } = require('redis')

const client = createClient({
    username: 'default',
    password: process.env.REDIS_CLOUD_PASSWORD,
    socket: {
        host: process.env.REDIS_CLOUD_SOCKET_HOST,
        port: process.env.REDIS_CLOUD_SOCKET_PORT
    }
})

client.on('error', err => console.log('Redis Client Error', err))

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect()
        console.log("Redis connected ✅")
    }
}

connectRedis()

module.exports = client