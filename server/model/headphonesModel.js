import mongoose from "mongoose"

const headphonesModel = new mongoose.Schema({
  _id: String, // e.g. "sony-wh1000xm5-8gb-128gb" (nếu có phiên bản)

  brand: String,     // e.g. "Sony", "Bose", "Apple"
  model: String,     // e.g. "WH-1000XM5", "QC45", "AirPods Max"
  type: String,      // "Over-ear", "On-ear", "In-ear", "True Wireless"

  connectivity: String, // "Wireless", "Wired", "True Wireless"
  microphone: Boolean,
  noise_cancelling: Boolean,

  battery: {
    battery_life: String,   // e.g. "30 hours"
    charging_connector: String // e.g. "USB-C", "Lightning", "MagSafe"
  },

  features: {
    support_voice_assistant: Boolean, // Google Assistant, Siri
    touch_controls: Boolean,
    water_resistance: String, // e.g. "IPX4"
    multipoint_connection: Boolean
  },

  sound: {
    driver_size: String, // e.g. "40mm"
    frequency_response: String, // e.g. "20Hz–20kHz"
    impedance: String, // e.g. "32Ω"
    codec_support: [String] // e.g. ["SBC", "AAC", "LDAC"]
  },

  price: Number,
  stock: Number,
  images: [String],

  others: {
    weight: String, // e.g. "250g"
    dimensions: {
      length: String,
      width: String,
      thickness: String
    },
    material: String // e.g. "Aluminum + Leatherette"
  }
})

export default mongoose.model('Headphones', headphonesModel, 'Headphones')