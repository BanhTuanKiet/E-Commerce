import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });

    isConnected = true
    console.log(`✅ Connected to MongoDB at ${process.env.MONGO_URI}`)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
