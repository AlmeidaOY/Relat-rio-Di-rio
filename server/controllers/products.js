const Product = require("../models/Product")
const { Op } = require("sequelize")

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { product_name, value, payment_method_details, category, sale_timestamp } = req.body

    if (!product_name || !value || !payment_method_details) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newProduct = await Product.create({
      product_name,
      value,
      payment_method_details,
      category: category || "ENTRADA",
      sale_timestamp: sale_timestamp || new Date(),
    })

    res.status(201).json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { product_name, value, payment_method_details, category, sale_timestamp } = req.body

    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.update({
      product_name: product_name || product.product_name,
      value: value || product.value,
      payment_method_details: payment_method_details || product.payment_method_details,
      category: category || product.category,
      sale_timestamp: sale_timestamp || product.sale_timestamp,
    })

    res.status(200).json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.destroy()
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get products by date range
exports.getProductsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const products = await Product.findAll({
      where: {
        sale_timestamp: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["sale_timestamp", "ASC"]],
    })

    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products by date range:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
