const Interaction = require("../models/Interaction")
const { Op } = require("sequelize")

// Get all interactions
exports.getAllInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.findAll()
    res.status(200).json(interactions)
  } catch (error) {
    console.error("Error fetching interactions:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get interaction by ID
exports.getInteractionById = async (req, res) => {
  try {
    const interaction = await Interaction.findByPk(req.params.id)
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" })
    }
    res.status(200).json(interaction)
  } catch (error) {
    console.error("Error fetching interaction:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create new interaction
exports.createInteraction = async (req, res) => {
  try {
    const { client_name, interaction_type, details, interaction_timestamp } = req.body

    if (!client_name || !interaction_type) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newInteraction = await Interaction.create({
      client_name,
      interaction_type,
      details,
      interaction_timestamp: interaction_timestamp || new Date(),
    })

    res.status(201).json(newInteraction)
  } catch (error) {
    console.error("Error creating interaction:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update interaction
exports.updateInteraction = async (req, res) => {
  try {
    const { client_name, interaction_type, details, interaction_timestamp } = req.body

    const interaction = await Interaction.findByPk(req.params.id)
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" })
    }

    await interaction.update({
      client_name: client_name || interaction.client_name,
      interaction_type: interaction_type || interaction.interaction_type,
      details: details !== undefined ? details : interaction.details,
      interaction_timestamp: interaction_timestamp || interaction.interaction_timestamp,
    })

    res.status(200).json(interaction)
  } catch (error) {
    console.error("Error updating interaction:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete interaction
exports.deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findByPk(req.params.id)
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" })
    }

    await interaction.destroy()
    res.status(200).json({ message: "Interaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting interaction:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get interactions by date range
exports.getInteractionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const interactions = await Interaction.findAll({
      where: {
        interaction_timestamp: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["interaction_timestamp", "ASC"]],
    })

    res.status(200).json(interactions)
  } catch (error) {
    console.error("Error fetching interactions by date range:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
