const mongoose = require('mongoose')

const categories = new mongoose.Schema({
   _id: String,
   name: String
})

module.exports = mongoose.model('Categories', categories, 'Categories')