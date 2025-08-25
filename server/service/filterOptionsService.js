const filterOptionModel = require('../model/filterOptionsModel.js')

const getFilterOptionsByCategory = async (category) => {
   return await filterOptionModel.findOne({ category: category })
}

const addNewOptions = async (category, newOption, session) => {
 return await filterOptionModel.findOneAndUpdate(
   { category: category },
   {
     $push: {
       filters: newOption
     }
   },
   { new: true, session }
 )
}

const updateFilterOptions = async (category, newFilterOptions, session) => {
 return await filterOptionModel.findOneAndUpdate(
   { category: category },
   {
     $set: {
       filters: newFilterOptions
     }
   },
   { new: true, session }
 )
}

module.exports = {
   getFilterOptionsByCategory,
   addNewOptions,
   updateFilterOptions
}