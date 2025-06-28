import expres from "express"
import { getFilterOptions } from "../controller/filterOptionsController.js"
const filterOptionRoute = expres.Router()

filterOptionRoute.get("/:category", getFilterOptions)

export default filterOptionRoute