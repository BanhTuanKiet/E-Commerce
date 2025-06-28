import filterOptionModel from "../model/filterOptionsModel.js"

export const getFilterOptionsByCategory = async (category) => {
    return await filterOptionModel.findOne({ category: category })
}