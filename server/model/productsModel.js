const mongoose = require('mongoose')

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
 reviews: Number,
 sold: Number,
 createdAt: { type: Date, default: Date.now() },
 avgScore: { type: Number, default: 0 },
}, baseOptions)

const Product = mongoose.model("Product", productSchema)
module.exports = Product