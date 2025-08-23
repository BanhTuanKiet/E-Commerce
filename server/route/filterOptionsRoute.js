import expres from "express"
import { getFilterOptions, putFilterOptions, putNewFilterOptions } from "../controller/filterOptionsController.js"
import authToken from "../middleware/authToken.js"
import authTokenFirebase from "../middleware/authTokenFirebase.js"
import { authRole } from '../middleware/authRole.js'
import { inputValidation } from "../middleware/inputValidation.js"
import { newFilterOptionsSchema, updateFilterOptionsSchema } from "../util/valideInput.js"

const filterOptionsRoute = expres.Router()

filterOptionsRoute.put("/add/:category", inputValidation(newFilterOptionsSchema, 'body'), authTokenFirebase, authRole('admin'), putNewFilterOptions)
filterOptionsRoute.get("/:category", getFilterOptions)
filterOptionsRoute.put("/:category", inputValidation(updateFilterOptionsSchema, 'body'), authTokenFirebase, authRole('admin'),  putFilterOptions)

export default filterOptionsRoute