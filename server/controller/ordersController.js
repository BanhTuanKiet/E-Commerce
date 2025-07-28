import mongoose from "mongoose"
import { postOrder, findOrdersByCustomerId, findOrdersByStatus, findOrderById,findPresentOrder } from "../service/orderServcie.js"
import { getProductImage } from "../util/getProductImage.js"

export const placeOrder = async (req, res, next) => {
    try {
        const { user } = req
        const { order } = req.body

        order.customerId = user._id
        order.paymentStatus = "unpaid"
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

export const getPresentOrder = async (req, res, next) => {
    try {
        const { user } = req
        const objectId = new mongoose.Types.ObjectId(user._id)
        const order = await findPresentOrder(objectId)
       
        return res.json({ data: order })
    } catch (error) {
        next(error)
    }
}