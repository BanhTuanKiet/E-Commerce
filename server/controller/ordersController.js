import mongoose from "mongoose"
import { countOrderByState, postOrder, findOrdersByCustomerId, findOrdersByStatus, findOrderById, findPresentOrder, getAllOrders, getFilterProducts, updateOrderStatus, hasUsedVoucher } from "../service/orderServcie.js"
import { getProductImage } from "../util/getProductImage.js"
import ErrorException from "../util/error.js"
import { sendMailUpdateOrderStatus } from "../util/mailUtl.js"
import { minusQuantityProduct } from "../service/productsService.js"
import { minusQuantityVoucher } from "../service/vouchersService.js"

export const countOrder = async (req, res, next) => {
  try {
    const { state } = req.params

    const orders = await countOrderByState(state)

    if (typeof orders !== 'number' || isNaN(orders)) throw new ErrorException(500, "Invalid count result")

    return res.json({ key: state, data: orders })
  } catch (error) {
    next(error)
  }
}

export const placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { user } = req
    let { order } = req.body

    order.customerId = new mongoose.Types.ObjectId(user?._id)
    order.orderStatus = "processing"
    order.paymentStatus = "unpaid"

    const isUsed = await hasUsedVoucher(user._id, order.voucher._id)
    
    if (isUsed) throw new ErrorException(400, "You have already used this voucher")

    const ordered = await postOrder([order], session)

    if (!ordered) throw new ErrorException(400, "Order failed")

    const result = await minusQuantityVoucher(ordered.voucher._id, session)
    console.log(result)

    await session.commitTransaction()
    return res.json({ message: "Place order successful!" })
  } catch (error) {
    session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const { user } = req
    const { page } = req.query

    if (user.role === 'customer') {
      // orders = await findOrdersByCustomerId(user._id)
    } else if (user.role === 'admin') {
      const { orders, totalPages } = await getAllOrders(page)

      if (!Array.isArray(orders) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid order list")

      return res.json({ data: orders, totalPages: totalPages })
    }

    // return res.json({ data: orders })
  } catch (error) {
    next(error)
  }
}
//order page -> customer
export const filterOrdersByStatus = async (req, res, next) => {
  try {
    const { user } = req
    const { status } = req.params

    const orders = await findOrdersByStatus(user._id, status)

    if (!Array.isArray(products)) throw new ErrorException(500, "Invalid product list")

    return res.json({ data: orders })
  } catch (error) {
    next(error)
  }
}

export const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params
    const { role } = req.user

    const order = await findOrderById(orderId)

    if (!order) throw new ErrorException(500, "Order not found")

    const orderObj = order.toObject()

    const itemsWithImgs = orderObj.items.map((product, index) => {
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

    orderObj.items = itemsWithImgs

    if (role !== 'admin') {
      delete orderObj.customerId
    }

    return res.json({ data: orderObj })
  } catch (error) {
    next(error)
  }
}

export const getPresentOrder = async (req, res, next) => {
  try {
    const { user } = req
    const objectId = new mongoose.Types.ObjectId(user._id)
    const order = await findPresentOrder(objectId)

    if (!order) throw new ErrorException(500, "Order not found")

    return res.json({ data: order })
  } catch (error) {
    next(error)
  }
}

export const filterOrders = async (req, res, next) => {
  try {
    let { options, page } = req.query

    if (!page) page = 1

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { orders, totalPages } = await getFilterProducts(decodedOptions, page)

    if (!Array.isArray(orders) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid order list")

    return res.json({ data: orders, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

export const putOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const validOrderStatuses = ['processing', 'confirmed', 'shipping', 'delivered', 'cancelled']
    const validPaymentStatuses = ['unpaid', 'paid', 'failed']

    const { orderId } = req.params
    const { orderStatus, paymentStatus } = req.body.status

    const order = await findOrderById(orderId)
    if (!order) throw new ErrorException(404, "Order not found!")

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      throw new ErrorException(400, "Invalid order status!")
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      throw new ErrorException(400, "Invalid payment status!")
    }

    if (paymentStatus === 'paid' && orderStatus !== 'delivered' && order.orderStatus !== 'delivered') {
      throw new ErrorException(400, "Can only mark as paid when order is delivered")
    }

    if (paymentStatus === 'failed' && orderStatus !== 'cancelled' && order.orderStatus !== 'cancelled') {
      throw new ErrorException(400, "Can only mark as failed when order is cancelled")
    }

    const updatedOrder = await updateOrderStatus(order, orderStatus, paymentStatus)

    try {
      await sendMailUpdateOrderStatus("kiett5153@gmail.com", orderStatus)
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr)
    }

    if (orderStatus === "shipping") {
      await Promise.all(order.items.map(async item => {
        await minusQuantityProduct(item.productId, item.quantity, session)
      }))
    }

    await session.commitTransaction()
    session.endSession()
    return res.json({ message: "Order updated successfully", data: order })

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}
