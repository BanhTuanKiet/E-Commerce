const Order = require('../model/ordersModel.js')

const itemsPerPage = 10

const getAllOrders = async (page) => {
  const skipIndex = (page - 1) * itemsPerPage

  const orders = await Order.find().skip(skipIndex).limit(itemsPerPage).populate('customerId')
  const totalPages = await Order.countDocuments()

  return {
    orders,
    totalPages: Math.ceil(totalPages / itemsPerPage)
  }
}

const postOrder = async (order, session) => {
  const [ordered] = await Order.create(JSON.parse(JSON.stringify(order)), { session })
  return ordered
}

const findOrdersByCustomerId = async (customerId) => {
  return await Order.find({ customerId: customerId })
}

const findOrderBasic = async (customerId) => {
  return await Order.find(
    { customerId },
    { items: 1 }
  )
    .populate({
      path: 'items.productId',
      select: 'model'
    })
}

const filterOrdersByCustomerAndOpions = async (customerId, options, page) => {
  const query = { customerId }
  const skipIndex = (page - 1) * itemsPerPage
  let start, end = null

  Object.entries(options).forEach(([key, value]) => {
    if (!value || value === 'total') return

    if (key === 'start') {
      start = new Date(Date.UTC(
        new Date(value).getFullYear(),
        new Date(value).getMonth(),
        new Date(value).getDate(),
        0, 0, 0, 0
      ))
    }
    else if (key === 'end') {
      end = new Date(Date.UTC(
        new Date(value).getFullYear(),
        new Date(value).getMonth(),
        new Date(value).getDate(),
        23, 59, 59, 999
      ))
    }
    else {
      query[key] = value
    }
  })

  if (start || end) {
    query['createdAt'] = {}
    if (start) query['createdAt'].$gte = start
    if (end) query['createdAt'].$lte = end
  }

  let orders = await Order.find(query).skip(skipIndex).limit(itemsPerPage).populate('customerId')

  const totalPages = await Order.countDocuments(query)
  console.log(query)

  return {
    orders,
    totalPages: Math.ceil(totalPages / itemsPerPage)
  }
}

const findOrdersByStatus = async (customerId, status) => {
  return await Order.find({ customerId: customerId, orderStatus: status })
}

const findOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('items.productId').populate('customerId')
}

const findPresentOrder = async (userId) => {
  return await Order.findOne(
    {
      customerId: userId,
      orderStatus: { $ne: 'cancelled' }
    },
    null,
    {
      sort: { createdAt: -1 }
    }
  )
}

const countOrderByState = async (state) => {
  return Order.find({ orderStatus: state }).countDocuments()
}

const getFilterProducts = async (options, page) => {
  const query = {}
  const skipIndex = (page - 1) * itemsPerPage
  let searchTerm, start, end = null

  Object.entries(options).map(([key, value]) => {
    if (key === 'createdAtFrom') {
      start = new Date(Date.UTC(
        new Date(value).getFullYear(),
        new Date(value).getMonth(),
        new Date(value).getDate(),
        0, 0, 0, 0
      ))
      query['createdAt'] = { $gte: start, $lte: end }
    }
    else if (key === 'createdAtTo') {
      end = new Date(Date.UTC(
        new Date(value).getFullYear(),
        new Date(value).getMonth(),
        new Date(value).getDate(),
        23, 59, 59, 999
      ))

      query['createdAt'] = { $gte: start, $lte: end }
    }
    else if (key === 'searchTerm') {
      searchTerm = value.toLowerCase()
    }
    else if (key !== '' && key !== 'total' && value !== '' && value !== 'total') {
      query[key] = value
    }
  })

  let orders = await Order.find(query).skip(skipIndex).limit(itemsPerPage).populate('customerId')
  const totalPages = await Order.countDocuments(query)

  if (searchTerm) {
    orders = orders.filter(order => {
      const customerName = order.customerId?.name?.toLowerCase() || ''
      const email = order.customerId?.email?.toLowerCase() || ''
      const orderId = order._id?.toString()

      return (
        customerName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        orderId.includes(searchTerm)
      )
    })
  }

  return {
    orders,
    totalPages: Math.ceil(totalPages / itemsPerPage)
  }
}

const updateOrderStatus = async (orderId, orderStatus, paymentStatus, session = null) => {
  const update = {}
  const now = Date.now()

  if (orderStatus !== "") {
    update[`statusHistory.${orderStatus}.updatedAt`] = now
    update[`orderStatus`] = orderStatus
    update[`statusHistory.${orderStatus}.createdAt`] = now
  }

  if (paymentStatus !== "") {
    update[`paymentStatus`] = paymentStatus
  }

  const order = await Order.findById(orderId).session(session)
  const createdAt = order?.statusHistory?.[orderStatus]?.createdAt
  const updatedAt = order?.statusHistory?.[orderStatus]?.updatedAt

  if (createdAt && createdAt !== updatedAt) {
    delete update[`statusHistory.${orderStatus}.createdAt`]
  }

  return await Order.updateOne(
    { _id: orderId },
    { $set: update },
    { session }
  )
}

const hasUsedVoucher = async (customerId, voucherId) => {
  if (!voucherId) return false
  return await Order.findOne({
    customerId: customerId,
    'voucher._id': voucherId
  })
}

module.exports = {
  getAllOrders,
  postOrder,
  findOrdersByCustomerId,
  findOrderBasic,
  filterOrdersByCustomerAndOpions,
  findOrdersByStatus,
  findOrderById,
  findPresentOrder,
  countOrderByState,
  getFilterProducts,
  updateOrderStatus,
  hasUsedVoucher
}