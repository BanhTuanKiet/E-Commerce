import cloudinary from "../config/cloudinary.js"

export const getProductImage = (productImages) => {
    const imageUrls = productImages.map(id =>
        cloudinary.url(id, {
            secure: true,
            fetch_format: 'auto',
            quality: 'auto',
        })
    )

    return imageUrls
}