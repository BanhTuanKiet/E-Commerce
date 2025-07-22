import { createClient } from 'redis'

const client = createClient({
    username: 'default',
    password: 'rQQM8S05CU2MotB78BXhghGoWrZkcQG2',
    socket: {
        host: 'redis-19949.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 19949
    }
})

client.on('error', err => console.log('Redis Client Error', err))

await client.connect()

export default client