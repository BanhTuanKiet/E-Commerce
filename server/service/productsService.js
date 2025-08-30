const Product = require('../model/productsModel.js')

const itemsPerPage = 8

const findProducts = async (page) => {
  const skipIndex = (page - 1) * 10

  const products = await Product.find().skip(skipIndex).limit(10)

  const total = await Product.countDocuments()

  return {
    products,
    totalPages: Math.ceil(total / 10)
  }
}

const findProductsByCategory = async (category, page) => {
  const skipIndex = (page - 1) * itemsPerPage

  const products = await Product.find({ category })
    .skip(skipIndex)
    .limit(itemsPerPage)

  const total = await Product.countDocuments({ category })

  return {
    products,
    totalPages: Math.ceil(total / itemsPerPage),
  }
}

const getFilterProducts = async (options, page) => {
  const skipIndex = (page - 1) * 10
  const query = {}

  Object.entries(options).map(([key, value]) => {
    if (key !== '' && key !== 'total' && value !== '' && value !== 'total') {
      query[key] = { $regex: value, $options: 'i' }
    }
  })

  const products = await Product.find(query).skip(skipIndex).limit(10)
  const totalPages = await Product.countDocuments(query)

  return {
    products,
    totalPages: Math.ceil(totalPages / 10),
  }
}

const getProductsByOptions = async (category, filters, options, page) => {
  const query = { category }
  const skipIndex = (page - 1) * itemsPerPage

  filters.forEach(filter => {
    const value = options[filter.key]
    if (value) {
      if (filter.match === "range") {
        query[filter.path] = { $gt: value.min, $lte: value.max }
      } else if (filter.match === "regex") {
        query["$or"] = value.map(v => ({
          [filter.path]: { $regex: v, $options: 'i' }
        }))
      } else if (filter.match === "multi-range") {
        query["$or"] = value.map(v => ({
          [filter.path]: { $gte: v.start, $lte: v.end }
        }))
      } else {
        query[filter.path] = { $in: value }
      }
    }
  })

  const products = await Product.find(query).skip(skipIndex).limit(itemsPerPage)
  const totalPages = await Product.countDocuments(query)

  return {
    products,
    totalPages: Math.ceil(totalPages / itemsPerPage),
  }
}

const getProductById = async (id) => {
  return await Product.findOne({ _id: id })
}

const getOtherOptionsItem = async (model) => {
  return await Product.find(
    { model }
  ).select('_id ram storage')
}

const getSaleProductsByCategory = async (category) => {
  return Product.find({ category, discount: { $gt: 0 } })
    .sort({ discount: -1 })
    .limit(10)
    .lean()
}

const getProductByState = async (state) => {
  return Product.find({ state: state })
}

const countProductByState = async (state) => {
  return await Product.find({ state: state }).countDocuments()
}

const updateProduct = async (product, session) => {
  return await Product.updateOne(
    { _id: product._id },
    { $set: { ...product } },
    { session }
  )
}

const findFirstProduct = async (category) => {
  return await Product.findOne({ category: category })
}

const addProuct = async (product, session) => {
  return await Product.create([product], { session })
}

const removeProduct = async (id) => {
  return await Product.deleteOne({ _id: id })
}

const minusQuantityProduct = async (id, quantity, session) => {
  return await Product.updateOne(
    { _id: id },
    { $inc: { stock: -quantity, sold: quantity } },
    { session }
  )
}

const updateReviewProduct = async (id, avgScore, totalReviews, session) => {
  return await Product.updateOne(
    { _id: id },
    {
      $set: {
        avgScore: avgScore,
        reviews: totalReviews
      }
    },
    { session }
  )
}

const findProductBySearchTerm = async (terms) => {
  const conditions = terms.map(term => ({
    $or: [
      { model: { $regex: term, $options: "i" } },
      { brand: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
    ]
  }))

  return await Product.find({ $and: conditions })
}

module.exports = {
  findProducts,
  findProductsByCategory,
  getFilterProducts,
  getProductsByOptions,
  getProductById,
  getOtherOptionsItem,
  getSaleProductsByCategory,
  getProductByState,
  countProductByState,
  updateProduct,
  findFirstProduct,
  addProuct,
  removeProduct,
  minusQuantityProduct,
  updateReviewProduct,
  findProductBySearchTerm
}