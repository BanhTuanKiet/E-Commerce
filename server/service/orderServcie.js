import orders from "../model/ordersModel.js"

export const postOrder = async (order) => {
    return await orders.create(JSON.parse(JSON.stringify(order)))
}

export const findOrdersByCustomerId = async (customerId) => {
    return await orders.find({ customerId: customerId })
}

export const findOrdersByStatus = async (customerId, status) => {
    return await orders.find({ customerId: customerId, orderStatus: status })
}

export const findOrderById = async (orderId) => {
    return await orders.findById(orderId).populate('items.productId')
}