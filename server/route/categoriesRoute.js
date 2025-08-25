const express = require("express")
const { getCategories } = require("../controller/categoriesController.js")
const categoriesRoute = express.Router()

categoriesRoute.get("/", getCategories)

module.exports = categoriesRoute