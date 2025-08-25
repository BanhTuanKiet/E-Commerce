const { getList } = require("../service/categoriesService.js")

const getCategories = async (req, res, next) => {
  try {
    const categories = await getList()

    return res.json({ data: categories })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getCategories
}
