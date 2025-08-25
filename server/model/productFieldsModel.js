const mongoose = require('mongoose')

const productFieldSchema = new mongoose.Schema(
 {
   type: { type: String },
   common: {
     category: { type: String },
     brand: { type: String },
     model: { type: String },
     price: { type: String },
     stock: { type: String },
     images: { type: String }
   },

   Phone: {
     storage: { type: String },
     ram: { type: String },
     discount: { type: String },
     configuration_and_memory: {
       operating_system: { type: String },
       processor_chip: { type: String },
       graphics_chip: { type: String }
     },
     camera_and_display: {
       front_camera: { type: String },
       rear_camera: { type: String },
       lidar_scanner: { type: String },
       display_technology: { type: String },
       flash: { type: String },
       size: { type: String },
       brightness: { type: String },
       screen: { type: String }
     },
     battery: {
       capacity: { type: String },
       connector: { type: String }
     },
     features: {
       fingerprint_security: { type: String },
       face_recognition: { type: String },
       water_resistance: { type: String },
       support_5g: { type: String },
       fast_charging: { type: String }
     },
     others: {
       material: { type: String },
       weight: { type: String },
       dimensions: {
         length: { type: String },
         width: { type: String },
         thickness: { type: String }
       }
     }
   },

   Laptop: {
     chip: { type: String },
     size: { type: String },
     processor: {
       name: { type: String },
       coreThread: { type: String },
       frequency: { type: String },
       cache: { type: String },
       tdp: { type: String }
     },
     ramAndStorage: {
       ram: { type: String },
       ramSlots: { type: String },
       ramUpgrade: { type: String },
       storage: { type: String },
       storageUpgrade: { type: String }
     },
     gpu_display: {
       gpu: { type: String },
       gpuUpgrade: { type: String },
       panel: { type: String },
       brightness: { type: String },
       color: { type: String },
       refreshRate: { type: String },
       antiGlare: { type: String },
       touch: { type: String }
     },
     others: {
       battery: { type: String },
       ports: { type: String },
       os: { type: String },
       weight: { type: String }
     }
   }
 },
 {
   timestamps: true,
   collection: "ProductFields"
 }
)

const ProductField = mongoose.model("ProductField", productFieldSchema)

module.exports = ProductField