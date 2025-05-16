const express = require("express")
const router = express.Router()
const paymentsController = require("../controllers/payments")

// GET all payments
router.get("/", paymentsController.getAllPayments)

// GET payments by date range
router.get("/date-range", paymentsController.getPaymentsByDateRange)

// GET payment by ID
router.get("/:id", paymentsController.getPaymentById)

// POST create new payment
router.post("/", paymentsController.createPayment)

// PUT update payment
router.put("/:id", paymentsController.updatePayment)

// DELETE payment
router.delete("/:id", paymentsController.deletePayment)

module.exports = router
