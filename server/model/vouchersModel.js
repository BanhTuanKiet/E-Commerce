import mongoose from 'mongoose'

const voucherSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxDiscount: {
        type: Number,
        default: null
    },
    minOrderValue: {
        type: Number,
        default: null
    },
    quantity: {
        type: Number,
        required: true
    },
    usageLimitPerUser: {
        type: Number,
        default: 1
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    categories: {
        type: [String],   // Mảng string chứa ID hoặc tên danh mục
        default: []
    }
}, {
    timestamps: true
})

export default mongoose.model('Vouchers', voucherSchema, 'Vouchers')