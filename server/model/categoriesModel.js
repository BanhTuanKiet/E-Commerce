import mongoose from "mongoose"

const categories = new mongoose.Schema({
    _id: String,
    name: String
})

export default mongoose.model('Categories', categories, 'Categories')
