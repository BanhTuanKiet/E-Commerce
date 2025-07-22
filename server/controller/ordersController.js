import { postOrder, findOrdersByCustomerId, findOrdersByStatus, findOrderById } from "../service/orderServcie.js"
import { getProductImage } from "../util/getProductImage.js"

export const placeOrder = async (req, res, next) => {
    try {
        const { user } = req
        const { order } = req.body

        order.customerId = user._id

        await postOrder(order)

        return res.json({ message: "Place order successful!" })
    } catch (error) {
        next(error)
    }
}

export const getOrders = async (req, res, next) => {
    try {
        const { user } = req

        const orders = await findOrdersByCustomerId(user._id)

        return res.json({ data: orders })
    } catch (error) {
        next(error)
    }
}

export const filterOrdersByStatus = async (req, res, next) => {
    try {
        const { user } = req
        const { status } = req.params

        const orders = await findOrdersByStatus(user._id, status)

        return res.json({ data: orders })
    } catch (error) {
        next(error)
    }
}

export const getOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params

        const order = await findOrderById(orderId)
        const orderObj = order.toObject().items.map((product, index) => {
            const imageUrls = getProductImage(product.productId.images)

            return {
                ...product,
                productId: {
                    ...product.productId,
                    images: imageUrls
                },
                quantity: order.items[index].quantity
            }
        })
        return res.json({ data: { ...order.toObject(), items: orderObj } })
    } catch (error) {
        next(error)
    }
}