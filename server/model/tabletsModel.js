import mongoose from "mongoose";

const tablets = new mongoose.Schema({
  _id: String,
  brand: { type: String, required: true },            // Apple, Samsung, Xiaomi, etc.
  model: { type: String, required: true },            // iPad mini (7th Gen), Galaxy Tab S9, etc.
  storage: String,                                    // 64GB, 128GB, etc.
  ram: String,                                        // 4GB, 6GB, 8GB, etc.
  price: Number,
  images: [String],
  stock: Number,
  category: String,
  state: String,
  configuration_and_memory: {
    operating_system: String,                         // iPadOS 18, Android 14, etc.
    processor_chip: String,                           // A17 Pro, Snapdragon 8 Gen 2, etc.
    graphics_chip: String,                            // Optional for high-end tabs
    bluetooth: String,                                // 5.2, 5.3, etc.
    wifi: String,                                     // Wi-Fi 6, 6E, etc.
    cellular: String                                  // 4G, 5G, null (WiFi-only)
  },

  camera_and_display: {
    front_camera: String,
    rear_camera: String,
    flash: Boolean,
    display_technology: String,                       // Liquid Retina, AMOLED, LCD
    screen: String,                                   // Resolution + refresh rate (e.g., "2266x1488, 120Hz")
    size: String,                                     // e.g., "8.3 inch"
    brightness: String                                // e.g., "500 nits"
  },

  battery: {
    capacity: String,                                 // e.g., "5078 mAh"
    connector: String                                 // USB-C, Lightning, etc.
  },

  features: {
    touch_id: Boolean,
    face_id: Boolean,
    apple_pencil_support: String,                     // "Gen 1", "Gen 2", "Pro", "None"
    samsung_pen_support: Boolean,
    keyboard_support: Boolean,
    apple_intelligence: Boolean
  },

  others: {
    material: String,                                 // Aluminum, Glass, Plastic...
    weight: String,                                   // e.g., "293g"
    dimensions: {
      length: String,
      width: String,
      thickness: String
    },
  }
});

export default mongoose.model("Tablets", tablets, 'Tablets')
