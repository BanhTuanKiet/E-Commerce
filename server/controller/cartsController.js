import mongoose from "mongoose"
import { addProductToCart, getCartByCustomer, updateCartByCustomerId } from "../service/cartsService.js"
import { getProductImage } from "../util/getProductImage.js"
import { getProductById } from "../service/productsService.js"
import ErrorException from "../util/errorException.js"

export const getCart = async (req, res, next) => {
  try {
    const { user } = req
    const cart = await getCartByCustomer(user._id)

    if (!cart) return res.json({ data: [] })

    const cartObj = cart?.toObject().items.map((product, index) => {
      const imageUrls = getProductImage(product._id.images)

      return {
        ...product,
        _id: {
          ...product._id,
          images: imageUrls
        },
        quantity: cart.items[index].quantity
      }
    })

    return res.json({ data: cartObj })
  } catch (error) {
    next(error)
  }
}

export const updateCart = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { user } = req
    const cart = req.body

    const formatedCart = cart.map(product => ({
      _id: product._id,
      quantity: product.quantity
    }))

    await updateCartByCustomerId(user._id, formatedCart, session)
    await session.commitTransaction()
    return res.json({})
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

export const postProductToCart = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { productId } = req.body
    const { user } = req

    const product = await getProductById(productId)

    if (!product) throw new ErrorException(500, 'Product not found')

    await addProductToCart(productId, user._id, session)

    await session.commitTransaction()
    return res.json({ message: "Added product successfully!" })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}