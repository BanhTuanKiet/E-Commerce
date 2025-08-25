const categoriesModel = require('../model/categoriesModel.js')

const getList = async () => {
   return await categoriesModel.find()
}

module.exports = {
   getList
}