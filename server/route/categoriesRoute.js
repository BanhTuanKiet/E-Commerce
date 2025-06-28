import expres from "express"
import { getCategories } from "../controller/categoriesController.js"
const categoryRoute = expres.Router()

categoryRoute.get("/", getCategories)

export default categoryRoute