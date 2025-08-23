import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import corsConfig from "./config/cors.js"
import cookieParser from "cookie-parser"
import http from 'http'
import admin from "firebase-admin"

import productsRoute from "./route/productsRoute.js"
import filterOptionsRoute from "./route/filterOptionsRoute.js"
import categoriesRoute from "./route/categoriesRoute.js"
import cartsRoute from "./route/cartsRoute.js"
import { errorException } from "./middleware/errorException.js"
import usersRoute from "./route/usersRoute.js"
import vouchersRoute from "./route/vouchersRoute.js"
import ordersRoute from "./route/ordersRoute.js"
import reviewsRoute from "./route/reviewsRoute.js"
import productFieldsRoute from "./route/productFiledsRoute.js"
import { initWebSocketServer } from "./config/webSocket.js"

import serviceAccount from "./config/serviceAccount.js"

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(express.json())
app.use(corsConfig)
app.use(cookieParser())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const server = http.createServer(app)

initWebSocketServer(server)

connectDB().then(() => {
  app.use('/categories', categoriesRoute)
  app.use('/products', productsRoute)
  app.use('/filter_options', filterOptionsRoute)
  app.use('/carts', cartsRoute)
  app.use('/users', usersRoute)
  app.use('/vouchers', vouchersRoute)
  app.use('/orders', ordersRoute)
  app.use('/reviews', reviewsRoute)
  app.use('/productFields', productFieldsRoute)

  app.use(errorException)

  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
})