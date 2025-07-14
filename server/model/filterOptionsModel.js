import mongoose from 'mongoose'

// Schema cho từng filter item
const filterItemSchema = new mongoose.Schema({
  key: { type: String, required: true },          // ví dụ: "brand", "price"
  label: { type: String, required: true },        // ví dụ: "Thương hiệu"
  type: { type: String, enum: ['checkbox', 'range', 'radio'], required: true },
  values: { type: [String], default: undefined }, // dùng với checkbox/radio
  min: Number,                                    // dùng với range
  max: Number,
  step: Number,
  unit: String,
  path: String,
  match: String
}, { _id: false })

// Schema cho danh mục và các filters của nó
const filterOptions = new mongoose.Schema({
  category: { type: String, required: true, unique: true }, // ví dụ: "phone"
  filters: [filterItemSchema],
}, {
  timestamps: true
})

export default mongoose.model('FilterOptions', filterOptions, 'FilterOptions')