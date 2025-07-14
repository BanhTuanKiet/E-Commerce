import { getFilterOptionsByCategory } from "../service/filterOptionsService.js"
import { getProductsByCategory, getPhonesByOptions, getProductById, getOtherOptionsItem, getSaleProductsByCategory, getItemsByState } from "../service/productsService.js"
import { getProductImage } from "../util/getProductImage.js"
import ErrorException from "../util/error.js"
import { getList } from "../service/categoriesService.js"

export const getProducts = async (req, res, next) => {
  try {
    const { category } = req.params
    const products = await getProductsByCategory(category)

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

    return res.json({ data: productsWithImages })
  } catch (error) {
    next(error)
  }
}


export const filterProducts = async (req, res, next) => {
  try {
    const { category, options } = req.params
    const decodedOptions = JSON.parse(decodeURIComponent(options))
    let products
    let filters

    // if (category === "phones") {
    filters = await getFilterOptionsByCategory(category)
    products = await getPhonesByOptions(category, filters.filters, decodedOptions)
    // }

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

    return res.json({ data: productsWithImageUrls })
  } catch (error) {
    console.error("Filter error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProductDetail = async (req, res, next) => {
  try {
    const { category, id } = req.params

    const product = await getProductById(category, id)

    const imageUrls = getProductImage(product.images)

    const productWithImages = { ...product.toObject?.(), images: imageUrls }

    return res.json({ data: productWithImages })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getOtherOptions = async (req, res, next) => {
  try {
    const { category, model } = req.params

    const product = await getOtherOptionsItem(category, model)

    return res.json({ data: product })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getSaleProducts = async (req, res, next) => {
  try {
    const saleProducts = [] // Mỗi phần tử là mảng sản phẩm đã có ảnh
    const categories = await getList()
    console.log(categories)
    for (const category of categories) {
      const items = await getSaleProductsByCategory(category.name.toLowerCase())
      console.log(items.length)
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
    console.log(req.params)
    const products = await getItemsByState(state)

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