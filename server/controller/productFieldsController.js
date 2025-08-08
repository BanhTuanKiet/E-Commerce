import ProductField from '../model/productFieldsModel.js'

export const getProductFields = async (req, res, next) => {
  try {
    const fields = await ProductField.findOne()

    return res.json({ data: fields })
  } catch (error) {
    next(error)
  }
}