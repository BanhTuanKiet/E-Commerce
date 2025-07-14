import { categoryMap } from "../util/categoryMap.js"

export const getProductsByCategory = async (category) => {
    return await categoryMap[category].find()
}

export const getPhonesByOptions = async (category, filters, options) => {
    const query = {}

    filters.forEach(filter => {
        const value = options[filter.key]
        
        if (value) {
            if (filter.match === "range") {
                query[filter.path] = { $gt: value.min, $lte: value.max }
            } else if (filter.match === "regex") {
                value.forEach(v => {
                    query[filter.path] = { $regex: v, $options: 'i' }
                })
            } else if (filter.match === "multi-range") {
                value.forEach(v => {
                    query[filter.path] = { $gte: v.start, $lte: v.end }
                })
            } else {
                query[filter.path] = { $in: value }
            }
        }
        
        return query
    })
    const products = await categoryMap[category].find(query)

    return products
}

export const getProductById = async (category, id) => {
    return await categoryMap[category].findById(id)
}

export const getOtherOptionsItem = async (category, model) => {
    return await categoryMap[category].find(
        { model: model }
    ).select('_id ram storage')
}

export const getSaleProductsByCategory = async (category) => {
    return categoryMap[category].find({ discount: { $gt: 0 } })
    .sort({ discount: -1 })
    .limit(10)
    .lean()
}

export const getItemsByState = async (state) => {
    return categoryMap["laptop"].find({ state: state })
}