const cors = require('cors')

const corsConfig = cors({
    origin: [
        `http://localhost:3000`,
        // 'http://localhost:2908`,'
        // `https://web-js-68ea2.web.app`,
        // `https://web-js-68ea2.firebaseapp.com`,
        // `https://gateway-4ot3.onrender.com`
    ],
    methods: ['Get', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    credentials: true // sending with cookie
})

module.exports = corsConfig