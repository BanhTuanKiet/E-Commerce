import { getFilterOptionsByCategory } from "../service/filterOptionsService.js"

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