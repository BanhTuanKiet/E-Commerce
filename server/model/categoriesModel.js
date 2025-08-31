const mongoose = require('mongoose')

const categories = new mongoose.Schema({
   _id: String,
   name: String
}, {
  timestamps: true,
  collection: "Categories"
})

const Category = mongoose.model('Category', categories)
module.exports = Category