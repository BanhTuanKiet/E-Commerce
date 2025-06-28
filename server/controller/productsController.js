import { getProductsByCategory, getPhonesByOptions, getProductById } from "../service/productsService.js"

export const getProducts = async (req, res, next) => {
    try {
        const { category } = req.params

        const products = await getProductsByCategory(category)        

        return res.json({ data: products })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const filterProducts = async (req, res, next) => {
  try {
    const { category, options } = req.params
    const decodedOptions = JSON.parse(decodeURIComponent(options))
    let products 

    if (category === "phones") {
        products = await getPhonesByOptions(decodedOptions)
    }

    return res.json({ data: products })
  } catch (error) {
    console.error("Filter error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProductDetail = async (req, res, next) => {
  try {
    const { category, id } = req.params

    const product = await getProductById(category, id)

    return res.json({ data: product })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}