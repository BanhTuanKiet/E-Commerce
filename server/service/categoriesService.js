import categoriesModel from "../model/categoriesModel.js"

export const getList = async () => {
    return await categoriesModel.find()
}