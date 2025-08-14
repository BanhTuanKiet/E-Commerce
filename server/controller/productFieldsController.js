import ProductField from '../model/productFieldsModel.js'

export const getProductFields = async (req, res, next) => {
  try {
    const { type } = req.params
    const fields = await ProductField.findOne({ type: type })

    return res.json({ data: fields })
  } catch (error) {
    next(error)
  }
}