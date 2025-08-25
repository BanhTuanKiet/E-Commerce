const mongoose = require('mongoose')
const Product = require('./productsModel.js')

const tabletSchema = new mongoose.Schema({
 storage: String,
 ram: String,
 configuration_and_memory: {
   operating_system: String,
   processor_chip: String,
   graphics_chip: String,
   bluetooth: String,
   wifi: String,
   cellular: String
 },
 camera_and_display: {
   front_camera: String,
   rear_camera: String,
   flash: Boolean,
   display_technology: String,
   screen: String,
   size: String,
   brightness: String
 },
 battery: {
   capacity: String,
   connector: String
 },
 features: {
   touch_id: Boolean,
   face_id: Boolean,
   apple_pencil_support: String,
   samsung_pen_support: Boolean,
   keyboard_support: Boolean,
   apple_intelligence: Boolean
 },
 others: {
   material: String,
   weight: String,
   dimensions: {
     length: String,
     width: String,
     thickness: String
   }
 }
})

const Tablet = Product.discriminator("Tablets", tabletSchema, "Tablets")

module.exports = Tablet