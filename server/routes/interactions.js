const express = require("express")
const router = express.Router()
const interactionsController = require("../controllers/interactions")

// GET all interactions
router.get("/", interactionsController.getAllInteractions)

// GET interactions by date range
router.get("/date-range", interactionsController.getInteractionsByDateRange)

// GET interaction by ID
router.get("/:id", interactionsController.getInteractionById)

// POST create new interaction
router.post("/", interactionsController.createInteraction)

// PUT update interaction
router.put("/:id", interactionsController.updateInteraction)

// DELETE interaction
router.delete("/:id", interactionsController.deleteInteraction)

module.exports = router
