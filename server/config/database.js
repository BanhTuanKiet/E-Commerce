const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let isConnected = false

const DATABASE_URL = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PUBLIC : process.env.MONGO_URI

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    })

    isConnected = true
    console.log(`✅ Connected to MongoDB at ${DATABASE_URL}`)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB