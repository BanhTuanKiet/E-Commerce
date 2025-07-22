import { addProductToCart, getCartByCustomer, updateCartByCustomerId } from "../service/cartsService.js"
import { getProductImage } from "../util/getProductImage.js"

export const getCart = async (req, res, next) => {
    try {
        const { user } = req
        const cart = await getCartByCustomer(user._id)
        
        const cartObj = cart.toObject().items.map((product, index) => {
            const imageUrls = getProductImage(product._id.images)

            return {
                ...product,
                _id: {
                    ...product._id,
                    images: imageUrls
                },
                quantity: cart.items[index].quantity
            }
        })
        
        return res.json({ data: cartObj })
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req, res, next) => {
    try {
        const { user } = req
        const { cart } = req.body

        await updateCartByCustomerId(user._id, cart)

        return res.json({})
    } catch (error) {
        next(error)
    }
}

export const postProductToCart = async (req, res, next) => {
    try {
        const { productId } = req.body
        const { user } = req
        
        await addProductToCart(productId, user._id)

        return res.json({ message: "Added product successfully!" })
    } catch (error) {
        next(error)
    }
}