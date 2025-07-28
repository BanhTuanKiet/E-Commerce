import mongoose from "mongoose"

const baseOptions = {
  discriminatorKey: 'category',
  collection: 'Products'
}

const productSchema = new mongoose.Schema({
  brand: String,
  model: String,
  price: Number,
  images: [String],
  stock: Number,
  category: String,
  state: String,
  reviews: Number
}, baseOptions)

const Product = mongoose.model("Product", productSchema)
export default Product
