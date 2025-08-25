const cloudinary = require("../config/cloudinary.js")

const getProductImage = (productImages) => {
  const imageUrls = productImages.map(id =>
    cloudinary.url(id, {
      secure: true,
      fetch_format: 'auto',
      quality: 'auto'
    })
  )

  return imageUrls
}

const handleImageUpload = async (images) => {
  if (!Array.isArray(images)) return []

  const uploadedUrls = []

  for (const image of images) {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'item_images')

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dc06xwakl/image/upload',
        formData
      )
      uploadedUrls.push(response.data.secure_url)
    } catch (error) {
      throw new ErrorException(400, 'Image upload failed')
    }
  }

  return uploadedUrls
}


module.exports = { 
  getProductImage,
  handleImageUpload
}