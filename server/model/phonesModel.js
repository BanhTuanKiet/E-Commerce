import mongoose from "mongoose";
import Product from "./productsModel.js";

const phoneSchema = new mongoose.Schema({
  storage: String,
  ram: String,
  discount: Number,
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
});

const Phone = Product.discriminator("Phone", phoneSchema);
export default Phone