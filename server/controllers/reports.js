const { generateDetailedReport } = require("../utils/reportGenerator")

// Generate a report (daily, weekly, monthly)
exports.generateReport = async (req, res) => {
  try {
    const { reportType, date } = req.query

    if (!reportType || !date) {
      return res.status(400).json({ message: "Report type and date are required" })
    }

    if (!["daily", "weekly", "monthly"].includes(reportType)) {
      return res.status(400).json({ message: "Invalid report type. Must be daily, weekly, or monthly" })
    }

    const report = await generateDetailedReport(reportType, date)
    res.status(200).json(report)
  } catch (error) {
    console.error("Error generating report:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
