import mongoose from "mongoose";
import Product from "./productsModel.js";

const headphoneSchema = new mongoose.Schema({
  type: String,
  connectivity: String,
  microphone: Boolean,
  noise_cancelling: Boolean,
  battery: {
    battery_life: String,
    charging_connector: String
  },
  features: {
    support_voice_assistant: Boolean,
    touch_controls: Boolean,
    water_resistance: String,
    multipoint_connection: Boolean
  },
  sound: {
    driver_size: String,
    frequency_response: String,
    impedance: String,
    codec_support: [String]
  },
  others: {
    weight: String,
    dimensions: {
      length: String,
      width: String,
      thickness: String
    },
    material: String
  }
});

const Headphone = Product.discriminator("Headphones", headphoneSchema, "Headphones");
export default Headphone