import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema({
  model: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number },
  chip: { type: String },
  size: { type: Number }, // inch
  stock: { type: Number, default: 100 },
  category: String,
  state: String,
  processor: {
    name: String,
    coreThread: String,       // ví dụ: "10 cores / 12 threads"
    frequency: String,        // ví dụ: "1.3GHz – 4.4GHz"
    cache: String,
    tdp: String
  },

  ramAndStorage: {
    ram: String,              // ví dụ: "8GB DDR4 2666MHz / 3200MHz"
    ramSlots: Number,
    ramUpgrade: String,
    storage: String,          // ví dụ: "512GB SSD"
    storageUpgrade: String
  },

  gpu_display: {
    gpu: String,              // ví dụ: "Intel UHD Graphics (Onboard)"
    gpuUpgrade: String,
    panel: String,            // ví dụ: "WVA IPS"
    brightness: String,
    color: String,
    refreshRate: String,
    antiGlare: Boolean,
    touch: Boolean
  },

  others: {
    battery: String,          // ví dụ: "3-cell 41Wh"
    ports: [String],          // array of strings
    os: String,
    weight: String            // ví dụ: "1.66–1.90kg"
  },

  images: [String]
});

export default mongoose.model('Laptops', laptopSchema, 'Laptops');
