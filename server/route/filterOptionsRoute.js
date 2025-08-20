import expres from "express"
import { getFilterOptions, putFilterOptions, putNewFilterOptions } from "../controller/filterOptionsController.js"
import authToken from "../middleware/authToken.js"
import { authRole } from '../middleware/authRole.js'
import { inputValidation } from "../middleware/inputValidation.js"
import { newFilterOptionsSchema, updateFilterOptionsSchema } from "../util/valideInput.js"

const filterOptionsRoute = expres.Router()

filterOptionsRoute.use(authToken)
filterOptionsRoute.use(authRole('admin'))

filterOptionsRoute.put("/add/:category", inputValidation(newFilterOptionsSchema, 'body'), putNewFilterOptions)
filterOptionsRoute.get("/:category", getFilterOptions)
filterOptionsRoute.put("/:category", inputValidation(updateFilterOptionsSchema, 'body'),  putFilterOptions)

export default filterOptionsRoute