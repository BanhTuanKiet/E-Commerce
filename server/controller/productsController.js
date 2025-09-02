const { getFilterOptionsByCategory } = require("../service/filterOptionsService.js")
const {
  addProuct,
  findFirstProduct,
  countProductByState,
  getFilterProducts,
  findProducts,
  findProductsByCategory,
  getProductById,
  findProductBySearchTerm,
  getOtherOptionsItem,
  getSaleProductsByCategory,
  getProductByState,
  getProductsByOptions,
  updateProduct,
  removeProduct
} = require("../service/productsService.js")

const { getProductImage, handleImageUpload } = require("../util/imageUtil.js")
const ErrorException = require("../util/errorException.js")
const { getList } = require("../service/categoriesService.js")
const mongoose = require("mongoose")

const getProducts = async (req, res, next) => {
  try {
    const { page } = req.query

    if (typeof page !== 'number') throw new ErrorException(400, "Invalid page")

    const { products, totalPages } = await findProducts(page)

    if (!Array.isArray(products) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid product list")

    return res.json({ data: products, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { page } = req.query

    if (!category || category.trim() === '') {
      throw new ErrorException(400, "Category is required")
    }

    const { products, totalPages } = await findProductsByCategory(category, page)

    if (!Array.isArray(products) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid product list")

    const productsWithImages = products.map((product) => {
      if (!product.images) {
        return product
      }

      const imageUrls = getProductImage(product.images)

      return {
        ...product.toObject?.(),
        images: imageUrls
      }
    })

    return res.json({ data: productsWithImages, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const filterProducts = async (req, res, next) => {
  try {
    let { options, page } = req.query

    if (!page) page = 1

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { products, totalPages } = await getFilterProducts(decodedOptions, page)

    if (!Array.isArray(products) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid product list")

    const productsWithImages = products.map((product) => {
      if (!product.images || product.images.length === 0) {
        return product
      }

      const imageUrls = getProductImage(product.images)

      return {
        ...product.toObject?.(),
        images: imageUrls
      }
    })
    return res.json({ data: productsWithImages, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const filterProductsByCategory = async (req, res, next) => {
  try {
    const { category, options } = req.params
    const { page } = req.query

    if (!category || category.trim() === '') {
      throw new ErrorException(400, "Category is required")
    }

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const filters = await getFilterOptionsByCategory(category)
    const { products, totalPages } = await getProductsByOptions(category, filters.filters, decodedOptions, page)

    if (!Array.isArray(products) || typeof totalPages !== 'number') throw new ErrorException(500, "Invalid product list")

    const productsWithImageUrls = products.map((product) => {
      if (!product.images || product.images.length === 0) {
        return product
      }

      const imageUrls = getProductImage(product.images)

      return {
        ...product.toObject?.(),
        images: imageUrls
      }
    })

    return res.json({ data: productsWithImageUrls, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

const getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)

    if (!product) throw new ErrorException(500, "Product not found")

    const imageUrls = getProductImage(product.images)

    const productWithImages = { ...product.toObject?.(), images: imageUrls }

    return res.json({ data: productWithImages })
  } catch (error) {
    next(error)
  }
}

const getOtherOptions = async (req, res, next) => {
  try {
    const { model } = req.params

    if (!model || typeof model !== 'string') {
      throw new ErrorException(500, "Invalid model")
    }

    const product = await getOtherOptionsItem(model)

    return res.json({ data: product })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

const getSaleProducts = async (req, res, next) => {
  try {
    const saleProducts = []
    const categories = await getList()

    if (!Array.isArray(categories)) throw new ErrorException(400, "Invalid category list")

    for (const category of categories) {
      const items = await getSaleProductsByCategory(category.name)

      if (items && items.length > 0) {
        const categoryProducts = []

        for (const product of items) {
          const plainProduct = product.toObject?.() || product

          const imageUrls = plainProduct.images && plainProduct.images.length > 0
            ? getProductImage(plainProduct.images)
            : []

          categoryProducts.push({
            ...plainProduct,
            images: imageUrls
          })
        }

        saleProducts.push(categoryProducts)
      }
    }

    return res.json({ data: saleProducts })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

const getProductsByState = async (req, res, next) => {
  try {
    const { state } = req.params
    const products = await getProductByState(state)

    if (!Array.isArray(products)) throw new ErrorException(400, "Invalid product list")

    const productsWithImages = products.map(product => {
      if (!product.images || product.images.length === 0) {
        return product
      }

      const imageUrls = getProductImage(product.images)

      return {
        ...product?.toObject(),
        images: imageUrls
      }
    })

    return res.json({ data: productsWithImages })
  } catch (error) {
    next(error)
  }
}

const countProduct = async (req, res, next) => {
  try {
    const { state } = req.params

    if (!state || state.trim() === "") throw new ErrorException(500, "State is required")

    const count = await countProductByState(state)

    if (typeof count !== 'number' || isNaN(count)) {
      throw new ErrorException(400, "Invalid count result")
    }

    return res.json({ key: state, data: count })
  } catch (error) {
    next(error)
  }
}

const putProduct = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { product } = req.body

    const updatedProduct = await updateProduct(product, session)

    if (!updatedProduct.acknowledged) {
      throw new ErrorException(500, "Database did not acknowledge the update")
    }
    if (updatedProduct.matchedCount === 0) {
      throw new ErrorException(404, "Product not found")
    }

    if (updatedProduct.modifiedCount === 0) {
      return res.json({ message: "No changes made" })
    }

    await session.commitTransaction()

    return res.json({ message: "Update successful!" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const getFristProduct = async (req, res) => {
  try {
    const { category } = req.params

    if (!category || category.trim() === '') throw new ErrorException(500, "Category is required")

    const product = await findFirstProduct(category)

    if (!product) throw new ErrorException(404, "Product not found!")

    return res.json({ data: product })
  } catch (error) {
    next(error)
  }
}

const postProduct = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const product = req.body

    const imageUrls = await handleImageUpload(product.images)

    if (!imageUrls) {
      throw new ErrorException(400, 'Image upload failed')
    }

    product.images = imageUrls

    const postedProduct = await addProuct(product, session)

    if (!postedProduct) {
      throw new ErrorException(400, "Post product failed")
    }

    await session.commitTransaction()

    return res.json({ message: "Post product successful!" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const objectId = new mongoose.Types.ObjectId(id)

    const product = await removeProduct(objectId)

    if (!product.deletedCount || !product.acknowledged) throw new ErrorException(400, "Delete product failed")

    return res.json({ message: "Delete product succesful" })
  } catch (error) {
    next(error)
  }
}

const searchProduct = async (req, res, next) => {
  try {
    const { searchTerm } = req.query
    console.log(searchTerm)
    if (!searchTerm || !searchTerm.length) throw new ErrorException(400, 'You need write something')

    const splitedTerm = searchTerm.split(' ')

    const products = await findProductBySearchTerm(splitedTerm)

    const productsWithImages = products.map(product => {
      if (!product.images) return product

      const images = getProductImage(product.images)

      return {
        ...product?.toObject(),
        images: images
      }
    })

    return res.json({ data: productsWithImages })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProductsByCategory,
  filterProducts,
  filterProductsByCategory,
  getProductDetail,
  getOtherOptions,
  getSaleProducts,
  getProductsByState,
  countProduct,
  putProduct,
  getFristProduct,
  postProduct,
  deleteProduct,
  searchProduct
}