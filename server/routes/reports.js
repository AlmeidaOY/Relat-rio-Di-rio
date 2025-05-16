const express = require("express")
const router = express.Router()
const reportsController = require("../controllers/reports")

// GET generate report
router.get("/", reportsController.generateReport)

module.exports = router
