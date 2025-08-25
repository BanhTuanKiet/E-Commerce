const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_CLOUDINARY_KEY,
  api_secret: process.env.API_CLOUDINARY_SECRET_KEY,
})

module.exports = cloudinary
