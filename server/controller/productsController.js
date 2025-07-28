import { getFilterOptionsByCategory } from "../service/filterOptionsService.js"
import { countProductByState, getFilterProducts, findProducts, findProductsByCategory, getProductById, getOtherOptionsItem, getSaleProductsByCategory, getProductByState, getProductsByOptions } from "../service/productsService.js"
import { getProductImage } from "../util/getProductImage.js"
import ErrorException from "../util/error.js"
import { getList } from "../service/categoriesService.js"

export const getProducts = async (req, res, next) => {
  try {
    const { page } = req.query
    const { products, totalPages } = await findProducts(page)

    return res.json({ data: products, totalPages: totalPages })
  } catch (error) {
    next(error)
  }
}

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { page } = req.query

    const { products, totalPages } = await findProductsByCategory(category, page)

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

export const filterProducts = async (req, res, next) => {
  try {
    const { options } = req.params
    const { page } = req.query

    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const { products, totalPages } = await getFilterProducts(decodedOptions, page)

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

export const filterProductsByCategory = async (req, res, next) => {
  try {
    const { category, options } = req.params
    const { page } = req.query
    const decodedOptions = JSON.parse(decodeURIComponent(options))

    const filters = await getFilterOptionsByCategory(category)
    const { products, totalPages } = await getProductsByOptions(category, filters.filters, decodedOptions, page)

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

export const getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)

    const imageUrls = getProductImage(product.images)

    const productWithImages = { ...product.toObject?.(), images: imageUrls }

    return res.json({ data: productWithImages })
  } catch (error) {
    next(error)
  }
}

export const getOtherOptions = async (req, res, next) => {
  try {
    const { model } = req.params

    const product = await getOtherOptionsItem(model)

    return res.json({ data: product })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getSaleProducts = async (req, res, next) => {
  try {
    const saleProducts = [] // Mỗi phần tử là mảng sản phẩm đã có ảnh
    const categories = await getList()

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
    console.error(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProductsByState = async (req, res, next) => {
  try {
    const { state } = req.params
    const products = await getProductByState(state)

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

export const countProduct = async (req, res, next) => {
  try {
    const { state } = req.params

    const count = await countProductByState(state)
    console.log(state, count)
    return res.json({ key: state, data: count })
  } catch (error) {
    next(error)
  }
}