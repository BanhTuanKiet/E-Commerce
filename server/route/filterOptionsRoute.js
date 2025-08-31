const express = require("express")
const { getFilterOptions, putFilterOptions, putNewFilterOptions } = require("../controller/filterOptionsController.js")
const { authToken, authTokenFirebase, authRole, authAccountActive } = require('../middleware/authMiddleware.js')
const inputValidation = require("../middleware/inputValidation.js")
const { newFilterOptionsSchema, updateFilterOptionsSchema } = require("../util/valideInput.js")

const filterOptionsRoute = express.Router()

filterOptionsRoute.put(
  "/add/:category",
  authTokenFirebase,
  authRole('admin'),
  authAccountActive,
  inputValidation(newFilterOptionsSchema, 'body'),
  putNewFilterOptions
)

filterOptionsRoute.get(
  "/:category", 
  getFilterOptions
)

filterOptionsRoute.put(
  "/:category",
  authTokenFirebase,
  authRole('admin'),
  authAccountActive,
  inputValidation(updateFilterOptionsSchema, 'body'),
  putFilterOptions
)

module.exports = filterOptionsRoute