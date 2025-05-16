const express = require("express")
const router = express.Router()
const productsController = require("../controllers/products")

// GET all products
router.get("/", productsController.getAllProducts)

// GET products by date range
router.get("/date-range", productsController.getProductsByDateRange)

// GET product by ID
router.get("/:id", productsController.getProductById)

// POST create new product
router.post("/", productsController.createProduct)

// PUT update product
router.put("/:id", productsController.updateProduct)

// DELETE product
router.delete("/:id", productsController.deleteProduct)

module.exports = router
