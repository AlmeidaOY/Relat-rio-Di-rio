const Payment = require("../models/Payment")
const { Op } = require("sequelize")

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll()
    res.status(200).json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }
    res.status(200).json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { client_name, amount, payment_method, payment_timestamp, notes } = req.body

    if (!client_name || !amount || !payment_method) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newPayment = await Payment.create({
      client_name,
      amount,
      payment_method,
      payment_timestamp: payment_timestamp || new Date(),
      notes,
    })

    res.status(201).json(newPayment)
  } catch (error) {
    console.error("Error creating payment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { client_name, amount, payment_method, payment_timestamp, notes } = req.body

    const payment = await Payment.findByPk(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    await payment.update({
      client_name: client_name || payment.client_name,
      amount: amount || payment.amount,
      payment_method: payment_method || payment.payment_method,
      payment_timestamp: payment_timestamp || payment.payment_timestamp,
      notes: notes !== undefined ? notes : payment.notes,
    })

    res.status(200).json(payment)
  } catch (error) {
    console.error("Error updating payment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    await payment.destroy()
    res.status(200).json({ message: "Payment deleted successfully" })
  } catch (error) {
    console.error("Error deleting payment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get payments by date range
exports.getPaymentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const payments = await Payment.findAll({
      where: {
        payment_timestamp: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["payment_timestamp", "ASC"]],
    })

    res.status(200).json(payments)
  } catch (error) {
    console.error("Error fetching payments by date range:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
