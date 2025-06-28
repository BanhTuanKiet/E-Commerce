import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import corsConfig from "./config/cors.js"
import productRoute from "./route/productsRoute.js"
import filterOptionRoute from "./route/filterOptionsRoute.js"
import categoryRoute from "./route/categoriesRoute.js"

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(express.json())
app.use(corsConfig)

connectDB().then(() => {
  app.use('/categories', categoryRoute)
  app.use('/products', productRoute)
  app.use('/filter_options', filterOptionRoute)

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
})