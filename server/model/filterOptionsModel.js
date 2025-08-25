const mongoose = require('mongoose')

const filterItemSchema = new mongoose.Schema({
 key: { type: String, required: true },
 label: { type: String, required: true },      
 type: { type: String, enum: ['checkbox', 'range', 'radio'], required: true },
 values: { type: [String], default: undefined }, 
 min: Number,                               
 max: Number,
 step: Number,
 unit: String,
 path: String,
 match: String
}, { _id: false })

const filterOptions = new mongoose.Schema({
 category: { type: String, required: true, unique: true },
 filters: [filterItemSchema],
}, {
 timestamps: true
})

module.exports = mongoose.model('FilterOptions', filterOptions, 'FilterOptions')