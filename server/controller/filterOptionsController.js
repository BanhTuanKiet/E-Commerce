import mongoose from "mongoose"
import { getFilterOptionsByCategory, addNewOptions, updateFilterOptions } from "../service/filterOptionsService.js"
import ErrorException from "../util/errorException.js"
import { findFirstProduct } from "../service/productsService.js"

export const getFilterOptions = async (req, res, next) => {
  try {
    const { category } = req.params

    const filterOptions = await getFilterOptionsByCategory(category)

    return res.json({ data: filterOptions })
  } catch (error) {
    console.error("Error fetching phones:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const putFilterOptions = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { category } = req.params
    const filterOptions = req.body

    const updatedFilterOptions = await updateFilterOptions(category, filterOptions.filters, session)

    if (!updatedFilterOptions) throw new ErrorException(400, 'Update failed')
      
    await session.commitTransaction()
    return res.json({ message: 'Updated' })
  } catch (error) {
    session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
}

export const putNewFilterOptions = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { category } = req.params
    const newOption = req.body

    if (newOption.key.toLowerCase() === 'price') {
      newOption.match = 'range'
    } else if (newOption.type.toLowerCase() === 'checkbox') {
      const hasRangeObject = Array.isArray(newOption.values) &&
        newOption.values.some(v => typeof v === 'object' && v !== null && 'start' in v && 'end' in v)

      if (hasRangeObject) {
        newOption.match = 'multi-range'
      } else {
        newOption.match = 'regex'
      }
    } else {
      newOption.match = 'regex'
    }

    const product = await findFirstProduct(category)

    if (!product) throw new ErrorException(400, 'Product not found')

    let path = ''
    const plainProduct = product.toObject ? product.toObject() : product

    Object.entries(plainProduct).forEach(([key, value]) => {
      if (key.toLocaleLowerCase() === newOption.key.toLocaleLowerCase()) {
        path = key
        return
      }

      if (value && typeof value === 'object') {
        Object.entries(plainProduct[key]).forEach(([childKey, childValue]) => {
          if (childKey.toLocaleLowerCase() === newOption.key.toLocaleLowerCase())
            path = `${key}.${childKey}`
        })
      }
    })

    if (!path || !path.length) throw new ErrorException(400, 'Key do not exist in this product')

    newOption.path = path

    const newFilter = await addNewOptions(category, newOption, session)

    if (!newFilter) throw new ErrorException(400, 'Add new option failed')

    await session.commitTransaction()
    return res.json({ data: newFilter, message: "Updated" })
  } catch (error) {
    session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
}