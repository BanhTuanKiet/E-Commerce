import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    password: { type: String, required: true },
    location: {
        address: { type: String },
        ward: { type: String },
        city: { type: String }
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema, 'Users')
