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

// CORS configuration for mobile clients
const corsOptions = {
  origin: "*", // In production, restrict this to your app's domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

// Middleware
app.use(cors(corsOptions))
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "An error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
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
