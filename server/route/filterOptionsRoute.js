import expres from "express"
import { getFilterOptions } from "../controller/filterOptionsController.js"
const filterOptionsRoute = expres.Router()

filterOptionsRoute.get("/:category", getFilterOptions)

export default filterOptionsRoute