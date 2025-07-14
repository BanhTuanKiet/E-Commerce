import expres from "express"
import { getCategories } from "../controller/categoriesController.js"
const categoriesRoute = expres.Router()

categoriesRoute.get("/", getCategories)

export default categoriesRoute