import filterOptionModel from "../model/filterOptionsModel.js"

export const getFilterOptionsByCategory = async (category) => {
    return await filterOptionModel.findOne({ category: category })
}

export const addNewOptions = async (category, newOption, session) => {
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

export const updateFilterOptions = async (category, newFilterOptions, session) => {
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