import { getCartByCustomer } from "../service/cartsService.js"
import { getProductImage } from "../util/getProductImage.js"

export const getCart = async (req, res) => {
    try {
        const { customerId } = req.params
        const cart = await getCartByCustomer(customerId)

        const cartObj = cart.toObject().items.map((product, index) => {
            const imageUrls = getProductImage(product._id.images)

            return {
                ...product._id,
                images: imageUrls, quantity: cart.items[index].quantity
            }
        })

        return res.json({ data: cartObj })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}