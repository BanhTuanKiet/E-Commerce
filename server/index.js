const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/database.js")
const corsConfig = require("./config/cors.js")
const cookieParser = require("cookie-parser")
const http = require("http")
const admin = require("firebase-admin")

const productsRoute = require("./route/productsRoute.js")
const filterOptionsRoute = require("./route/filterOptionsRoute.js")
const categoriesRoute = require("./route/categoriesRoute.js")
const cartsRoute = require("./route/cartsRoute.js")
const errorException = require("./middleware/errorException.js")
const usersRoute = require("./route/usersRoute.js")
const vouchersRoute = require("./route/vouchersRoute.js")
const ordersRoute = require("./route/ordersRoute.js")
const reviewsRoute = require("./route/reviewsRoute.js")
const productFieldsRoute = require("./route/productFiledsRoute.js")
const { initWebSocketServer } = require("./config/webSocket.js")

const serviceAccount = require("./config/serviceAccount.js")

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(express.json())
app.use(corsConfig)
app.use(cookieParser())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const server = http.createServer(app)

initWebSocketServer(server)

connectDB().then(() => {
  app.use("/categories", categoriesRoute)
  app.use("/products", productsRoute)
  app.use("/filter_options", filterOptionsRoute)
  app.use("/carts", cartsRoute)
  app.use("/users", usersRoute)
  app.use("/vouchers", vouchersRoute)
  app.use("/orders", ordersRoute)
  app.use("/reviews", reviewsRoute)
  app.use("/productFields", productFieldsRoute)

  app.use(errorException)

  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
})
