const mongoose = require('mongoose')

const users = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  firebaseID: { type: String, required: false },
  email: { type: String, required: true },
  name: { type: String, required: false, default: '' },
  phoneNumber: { type: String, required: false },
  gender: { type: String, enum: ["male", "female"], required: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  password: { type: String, required: false },
  location: {
    address: { type: String },
    ward: { type: String },
    city: { type: String }
  },
  providers: { type: [String], default: ['email/password'] },
  refreshToken: String,
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: "Users"
})

const User = mongoose.model('User', users)
module.exports = User