import mongoose from "mongoose"

const phones = new mongoose.Schema({
  _id: String,
  brand: String,
  model: String,
  storage: String,
  ram: String,
  price: Number,
  category: String,
  state: String,
  discount: { type: Number, default: 0 },
  images: [String],
  stock: Number,
  configuration_and_memory: {
    operating_system: String,
    processor_chip: String,
    graphics_chip: String
  },
  camera_and_display: {
    front_camera: String,
    rear_camera: String,
    lidar_scanner: Boolean,
    display_technology: String,
    flash: Boolean,
    size: Number,
    brightness: String,
    screen: String
  },
  battery: {
    capacity: Number,
    connector: String
  },
  features: {
    fingerprint_security: Boolean,
    face_recognition: Boolean,
    water_resistance: String,
    support_5g: Boolean,
    fast_charging: String
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

export default mongoose.model('Phones', phones, 'Phones')
