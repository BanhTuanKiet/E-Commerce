const express = require("express")
const { getFilterOptions, putFilterOptions, putNewFilterOptions } = require("../controller/filterOptionsController.js")
const authToken = require("../middleware/authToken.js")
const authTokenFirebase = require("../middleware/authTokenFirebase.js")
const authRole = require("../middleware/authRole.js")
const inputValidation = require("../middleware/inputValidation.js")
const { newFilterOptionsSchema, updateFilterOptionsSchema } = require("../util/valideInput.js")

const filterOptionsRoute = express.Router()

filterOptionsRoute.put("/add/:category", inputValidation(newFilterOptionsSchema, 'body'), authTokenFirebase, authRole('admin'), putNewFilterOptions)
filterOptionsRoute.get("/:category", getFilterOptions)
filterOptionsRoute.put("/:category", inputValidation(updateFilterOptionsSchema, 'body'), authTokenFirebase, authRole('admin'), putFilterOptions)

module.exports = filterOptionsRoute