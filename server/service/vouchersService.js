const Voucher = require("../model/vouchersModel.js")

const findVouchers = async () => {
  return await Voucher.find()
}

const findVoucherAvailableForCustomer = async (now) => {
  return await Voucher.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true
  })
}

const findVoucherByCode = async (voucherCode) => {
  return await Voucher.findOne({ code: { $regex: `^${voucherCode}$`, $options: 'i' } })
}

const minusQuantityVoucher = async (id, session) => {
  return await Voucher.updateOne(
    { _id: id },
    { $inc: { quantity: -1, used: 1 } },
    { session }
  )
}

const findVoucherId = async (voucherId) => {
  return Voucher.findById(voucherId)
}

const updateVoucher = async (voucher, session) => {
  return await Voucher.findByIdAndUpdate(
    voucher._id,
    { $set: voucher },
    { new: true, runValidators: true, session }
  )
}

const updateVoucherStatus = async (voucher, session) => {
  const { _id, createdAt, updatedAt, ...updateData } = voucher

  return await Voucher.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true, session }
  )
}

const itemsPerPage = 10

const getFilterVouchers = async (options, page) => {
  const skipIndex = (page - 1) * itemsPerPage
  const query = {}
  const now = new Date(new Date().toISOString())
  let searchTerm

  Object.entries(options).forEach(([key, value]) => {
    if (key === '' || key === 'total' || value === '') return
    if (key === 'isActive' && (value === "active" || value === 'pause')) {
      query[key] = value === 'active'
    }
    else if (value === 'expired') {
      query.endDate = { $lt: now }
    } else if (value === 'upcoming') {
      query.startDate = { $gt: now }
    } else if (key === 'code') {
      searchTerm = value.toLowerCase()
    } else {
      query[key] = value
    }
  })

  let vouchers = await Voucher.find(query).skip(skipIndex).limit(itemsPerPage)
  const totalPages = await Voucher.countDocuments(query)

  if (searchTerm) {
    vouchers = vouchers.filter(voucher => {
      const code = voucher.code.toLowerCase() || ''
      const description = voucher.description.toLowerCase() || ''
      return (
        code.includes(searchTerm) ||
        description.includes(searchTerm)
      )
    })
  }

  return {
    vouchers,
    totalPages: Math.ceil(totalPages / itemsPerPage),
  }
}

const addVoucher = async (voucher, session) => {
  return await Voucher.create([voucher], { session })
}

const deleteVoucher = async (voucher) => {
  return await Voucher.deleteOne(voucher)
}

module.exports = {
  findVouchers,
  findVoucherByCode,
  minusQuantityVoucher,
  findVoucherId,
  updateVoucher,
  updateVoucherStatus,
  getFilterVouchers,
  addVoucher,
  deleteVoucher,
  findVoucherAvailableForCustomer
}
