const cors = require('cors')

const corsConfig = cors({
    origin: [
        `http://localhost:3000`,
        `https://e-commerce-8eeb6.web.app`,
        `https://e-commerce-8eeb6.firebaseapp.com`
    ],
    methods: ['Get', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    credentials: true // sending with cookie
})

module.exports = corsConfig