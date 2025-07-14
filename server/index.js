import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import corsConfig from "./config/cors.js"
import cookieParser from "cookie-parser"

import productsRoute from "./route/productsRoute.js"
import filterOptionsRoute from "./route/filterOptionsRoute.js"
import categoriesRoute from "./route/categoriesRoute.js"
import cartsRoute from "./route/cartsRoute.js"
import { errorException } from "./middleware/errorException.js"
import usersRoute from "./route/usersRoute.js"
import vouchersRoute from "./route/vouchersRoute.js"

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(express.json())
app.use(corsConfig)
app.use(cookieParser())

connectDB().then(() => {
  app.use('/categories', categoriesRoute)
  app.use('/products', productsRoute)
  app.use('/filter_options', filterOptionsRoute)
  app.use('/carts', cartsRoute)
  app.use('/users', usersRoute)
  app.use('/vouchers', vouchersRoute)
  app.use(errorException)

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
})