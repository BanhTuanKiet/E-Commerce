const mongoose = require('mongoose')
const Product = require('./productsModel.js')

const laptopSchema = new mongoose.Schema({
 chip: String,
 size: Number,
 processor: {
   name: String,
   coreThread: String,
   frequency: String,
   cache: String,
   tdp: String
 },
 ramAndStorage: {
   ram: String,
   ramSlots: Number,
   ramUpgrade: String,
   storage: String,
   storageUpgrade: String
 },
 gpu_display: {
   gpu: String,
   gpuUpgrade: String,
   panel: String,
   brightness: String,
   color: String,
   refreshRate: String,
   antiGlare: Boolean,
   touch: Boolean
 },
 others: {
   battery: String,
   ports: [String],
   os: String,
   weight: String
 }
})

const Laptop = Product.discriminator("Laptops", laptopSchema, "Laptops")

module.exports = Laptop