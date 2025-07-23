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
  state: String
}, baseOptions)

const Product = mongoose.model("Products", productSchema, "Products")
export default Product
