const mongoose = require("mongoose")
const {
  countOrderByState,
  postOrder,
  findOrderById,
  findPresentOrder,
  getAllOrders,
  getFilterProducts,
  updateOrderStatus,
  hasUsedVoucher,
  filterOrdersByCustomerAndOpions,
  findOrderBasic
} = require("../service/orderServcie.js")
const { getProductImage } = require("../util/imageUtil.js")
const ErrorException = require("../util/errorException.js")
const { sendMailUpdateOrderStatus } = require("../util/mailUtl.js")
const { minusQuantityProduct } = require("../service/productsService.js")
const { minusQuantityVoucher } = require("../service/vouchersService.js")
const querystring = require('qs')
const crypto = require('crypto')
const vnpay = require("../config/vnpayConfig.js")

const countOrder = async (req, res, next) => {
  try {
    const { state } = req.params

    const orders = await countOrderByState(state)

    if (typeof orders !== 'number' || isNaN(orders)) throw new ErrorException(500, "Invalid count result")

    return res.json({ key: state, data: orders })
  } catch (error) {
    next(error)
  }
}

const placeOrder = async (req, res, next) => {
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

const vnpayPayment = async (req, res, next) => {
  try {
    const dateFormat = (await import('dateformat')).default
    // const vnp_IpnUrl = "http://localhost:3000/order/auth/vnpay_ipn"p_HashSecret
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    const date = new Date()
    // var bankCode = req.body.bankCode
    var vnp_Params = {}

    vnp_Params['vnp_Amount'] = req.body.totalAmount * 100
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_CreateDate'] = dateFormat(date, 'yyyymmddHHMMss')
    vnp_Params['vnp_CurrCode'] = 'VND'
    // vnp_Params['vnp_ExpireDate'] = dateFormat(date.getTime() + 30 * 60 * 1000, 'yyyymmddHHMMss')
    vnp_Params['vnp_IpAddr'] = '127.0.0.1'
    vnp_Params['vnp_Locale'] = 'vn'
    vnp_Params['vnp_OrderInfo'] = 'a'
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_ReturnUrl'] = 'https://domainmerchant.vn/ReturnUrl'
    vnp_Params['vnp_TmnCode'] = '5JCKYLCW'
    vnp_Params['vnp_TxnRef'] = Date.now().toString()
    vnp_Params['vnp_Version'] = '2.1.0'

    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort())
    
    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', 'XTQG5BZMLAXUB7RA63LH222SRDU1Z3N7')
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params)

    return res.json({ vnpUrl: vnpUrl })
  } catch (error) {
    next(error)
  }
}

const HandleVNPay = async (req, res, next) => {
  try {
    var vnp_Params = req.query
    const secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort())

    const tmnCode = vnpay.globalConfig.vnp_TmnCode
    const secretKey = vnpay.globalConfig.vnp_HashSecret

    const signData = querystring.stringify(vnp_Params)
    const hmac = crypto.createHmac("sha512", secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex")

    const transactionMessages = {
      "00": "Transaction successful",
      "01": "Transaction incomplete",
      "02": "Transaction error",
      "04": "Transaction reversed (customer was charged but transaction failed)",
      "05": "Transaction under processing",
      "06": "Refund request sent to the bank",
      "07": "Transaction suspected of fraud",
      "09": "Refund rejected"
    }

    const responseMessages = {
      "00": "Transaction successful",
      "07": "Transaction suspected of fraud",
      "09": "Transaction failed: Unregistered InternetBanking",
      "10": "Transaction failed: Too many incorrect authentication attempts",
      "11": "Transaction failed: Payment timeout",
      "12": "Transaction failed: Account locked",
      "13": "Transaction failed: Incorrect OTP",
      "24": "Transaction failed: Customer canceled",
      "51": "Transaction failed: Insufficient balance",
      "65": "Transaction failed: Exceeded daily transaction limit",
      "75": "Transaction failed: Bank under maintenance",
      "79": "Transaction failed: Too many incorrect password attempts",
      "99": "Transaction failed: Unknown error"
    }

    const transactionStatus = vnp_Params['vnp_TransactionStatus']
    const responseCode = vnp_Params['vnp_ResponseCode'] || "02"

    if (["02", "04", "05", "06", "07", "09"].includes(transactionStatus) || ["07", "99"].includes(responseCode)) {
      throw new ApiError(responseMessages[responseCode], 500)
    }

    if (secureHash !== signed) {
      throw new ApiError('', 500)
    }

    const { email } = req.body

    const orderId = req.body.orderId
    const userId = await OrderService.GetUserId(email)

    if (userId === null) {
      throw new ApiError('Userid not found', 500)
    }

    const orderDetails = await OrderService.Payment(userId, orderId, 'paid')

    if (orderDetails.length === 0) {
      throw new ApiError("Failed to add new order!", 500)
    }

    return res.json({ message: responseMessages[responseCode], status: 'success' })
  } catch (error) {
    next(error)
  }
}

const getOrderBasic = async (req, res, next) => {
  try {
    const { user } = req

    const orders = await findOrderBasic(user._id)

    return res.json({ data: orders })
  } catch (error) {
    next(error)
  }
}

const getOrders = async (req, res, next) => {
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

const getOrder = async (req, res, next) => {
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

const getPresentOrder = async (req, res, next) => {
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

const filterOrdersByCustomerId = async (req, res, next) => {
  try {
    let { options, page } = req.query
    const { user } = req
    const decodedOptions = JSON.parse(options)
    if (!page) page = 1

    const { orders, totalPages } = await filterOrdersByCustomerAndOpions(user._id, decodedOptions, page)

    if (!Array.isArray(orders) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid order list")

    return res.json({ data: orders, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const filterOrders = async (req, res, next) => {
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

const putOrderStatus = async (req, res, next) => {
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

    await updateOrderStatus(order, orderStatus, paymentStatus)

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

module.exports = {
  countOrder,
  placeOrder,
  vnpayPayment,
  HandleVNPay,
  getOrderBasic,
  getOrders,
  getOrder,
  getPresentOrder,
  filterOrdersByCustomerId,
  filterOrders,
  putOrderStatus
}