const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const config = require("./config/config")
const sequelize = require("./config/db")

// Import routes
const paymentsRoutes = require("./routes/payments")
const productsRoutes = require("./routes/products")
const interactionsRoutes = require("./routes/interactions")
const reportsRoutes = require("./routes/reports")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/payments", paymentsRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/interactions", interactionsRoutes)
app.use("/api/reports", reportsRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Reporting System API" })
})

// Sync database and start server
const PORT = config.PORT

sequelize
  .sync({ alter: config.NODE_ENV === "development" })
  .then(() => {
    console.log("Database synchronized")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to sync database:", err)
  })
