import mongoose from "mongoose"

const categoriesModel = new mongoose.Schema({
    _id: String,
    name: String
})

export default mongoose.model('Categories', categoriesModel, 'Categories')
