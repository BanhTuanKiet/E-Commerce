import Voucher from "../model/vouchersModel.js"

export const findVouchers = async () => {
  return await Voucher.find()
}

export const findVoucherByCode = async (voucherCode) => {
  return await Voucher.findOne({ code: { $regex: `^${voucherCode}$`, $options: 'i' } })
}

export const minusQuantityVoucher = async (id, session) => {
  return await Voucher.updateOne(
    { _id: id },
    { $inc: { quantity: -1, used: 1 } },
    { session }
  )
}

export const findVoucherId = async (voucherId) => {
  return Voucher.findById(voucherId)
}

export const updateVoucher = async (voucher, session) => {
  return await Voucher.findByIdAndUpdate(
    voucher._id,
    { $set: voucher },
    { new: true, runValidators: true },
    { session }
  );
};

export const updateVoucherStatus = async (voucher, session) => {
  const { _id, createdAt, updatedAt, ...updateData } = voucher

  return await Voucher.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true, session }
  );
}

const itemsPerPage = 10

export const getFilterVouchers = async (options, page) => {
  const skipIndex = (page - 1) * itemsPerPage
  const query = {}
  const now = new Date(new Date().toISOString())
  let searchTerm

  Object.entries(options).map(([key, value]) => {
    if (key === '' || key === 'total' || value === '') return
    if (key === 'isActive' && (value === "active" || value === 'pause')) {
      query[key] = value === 'active' ? true : false
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

  let vouchers = await Voucher.find(query).skip(skipIndex).limit(10)
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
    totalPages: Math.ceil(totalPages / 10),
  }
}