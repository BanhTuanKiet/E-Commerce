const mongoose = require('mongoose')

const users = new mongoose.Schema({
   _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
   firebaseID: { type: String, required: true },
   email: { type: String, required: true },
   name: { type: String, required: true },
   phoneNumber: { type: String, required: true },
   gender: { type: String, enum: ["male", "female"], required: true },
   role: { type: String, enum: ["customer", "admin"], default: "customer" },
   password: { type: String, required: true },
   location: {
       address: { type: String },
       ward: { type: String },
       city: { type: String }
   },
   refreshToken: String
}, { timestamps: true })

module.exports = mongoose.model('User', users, 'Users')