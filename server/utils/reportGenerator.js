const { Op, Sequelize } = require("sequelize")
const moment = require("moment")
const Payment = require("../models/Payment")
const Product = require("../models/Product")
const Interaction = require("../models/Interaction")

// Helper function to get start and end dates for different report types
const getDateRange = (reportType, date) => {
  const targetDate = moment(date)

  switch (reportType) {
    case "daily":
      return {
        startDate: targetDate.startOf("day").toDate(),
        endDate: targetDate.endOf("day").toDate(),
        periodLabel: targetDate.format("DD/MM/YYYY"),
      }
    case "weekly":
      return {
        startDate: targetDate.startOf("isoWeek").toDate(),
        endDate: targetDate.endOf("isoWeek").toDate(),
        periodLabel: `${targetDate.startOf("isoWeek").format("DD/MM/YYYY")} - ${targetDate.endOf("isoWeek").format("DD/MM/YYYY")}`,
      }
    case "monthly":
      return {
        startDate: targetDate.startOf("month").toDate(),
        endDate: targetDate.endOf("month").toDate(),
        periodLabel: targetDate.format("MMMM YYYY"),
      }
    default:
      throw new Error("Invalid report type")
  }
}

// Generate summary statistics
const generateSummaryStats = async (startDate, endDate) => {
  try {
    // Get payments data
    const payments = await Payment.findAll({
      where: {
        payment_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "payment_method",
        [Sequelize.fn("COUNT", Sequelize.col("payment_id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["payment_method"],
    })

    // Get products data
    const products = await Product.findAll({
      where: {
        sale_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "product_name",
        [Sequelize.fn("COUNT", Sequelize.col("sale_id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("value")), "total"],
      ],
      group: ["product_name"],
    })

    // Get interactions data
    const interactions = await Interaction.findAll({
      where: {
        interaction_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ["interaction_type", [Sequelize.fn("COUNT", Sequelize.col("interaction_id")), "count"]],
      group: ["interaction_type"],
    })

    // Calculate totals
    const totalPayments = payments.reduce((sum, item) => sum + Number.parseFloat(item.dataValues.total), 0)
    const totalProducts = products.reduce((sum, item) => sum + Number.parseFloat(item.dataValues.total), 0)
    const totalInteractions = interactions.reduce((sum, item) => sum + Number.parseInt(item.dataValues.count), 0)

    // Payment methods breakdown
    const paymentMethods = {}
    payments.forEach((item) => {
      paymentMethods[item.payment_method] = {
        count: Number.parseInt(item.dataValues.count),
        total: Number.parseFloat(item.dataValues.total),
        percentage: ((Number.parseFloat(item.dataValues.total) / totalPayments) * 100).toFixed(1),
      }
    })

    // Product breakdown
    const productBreakdown = {}
    products.forEach((item) => {
      productBreakdown[item.product_name] = {
        count: Number.parseInt(item.dataValues.count),
        total: Number.parseFloat(item.dataValues.total),
        percentage: ((Number.parseFloat(item.dataValues.total) / totalProducts) * 100).toFixed(1),
      }
    })

    return {
      summary: {
        totalPayments,
        totalProducts,
        totalInteractions,
        totalRevenue: totalPayments + totalProducts,
        paymentCount: payments.reduce((sum, item) => sum + Number.parseInt(item.dataValues.count), 0),
        productCount: products.reduce((sum, item) => sum + Number.parseInt(item.dataValues.count), 0),
      },
      paymentMethods,
      productBreakdown,
      interactionTypes: interactions.map((item) => ({
        type: item.interaction_type,
        count: Number.parseInt(item.dataValues.count),
      })),
    }
  } catch (error) {
    console.error("Error generating summary stats:", error)
    throw error
  }
}

// Generate detailed report data
const generateDetailedReport = async (reportType, date) => {
  try {
    const { startDate, endDate, periodLabel } = getDateRange(reportType, date)

    // Get all payments in the date range
    const payments = await Payment.findAll({
      where: {
        payment_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["payment_timestamp", "ASC"]],
    })

    // Get all products in the date range
    const products = await Product.findAll({
      where: {
        sale_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["sale_timestamp", "ASC"]],
    })

    // Get all interactions in the date range
    const interactions = await Interaction.findAll({
      where: {
        interaction_timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["interaction_timestamp", "ASC"]],
    })

    // Generate summary statistics
    const stats = await generateSummaryStats(startDate, endDate)

    // Generate hourly/daily/weekly timeline data based on report type
    let timelineData = []

    if (reportType === "daily") {
      // For daily reports, group by hour
      const hourlyPayments = await Payment.findAll({
        where: {
          payment_timestamp: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: [
          [Sequelize.fn("date_trunc", "hour", Sequelize.col("payment_timestamp")), "hour"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        group: [Sequelize.fn("date_trunc", "hour", Sequelize.col("payment_timestamp"))],
        order: [[Sequelize.fn("date_trunc", "hour", Sequelize.col("payment_timestamp")), "ASC"]],
      })

      timelineData = hourlyPayments.map((item) => ({
        label: moment(item.dataValues.hour).format("HH:00"),
        value: Number.parseFloat(item.dataValues.total),
      }))
    } else if (reportType === "weekly") {
      // For weekly reports, group by day
      const dailyPayments = await Payment.findAll({
        where: {
          payment_timestamp: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: [
          [Sequelize.fn("date_trunc", "day", Sequelize.col("payment_timestamp")), "day"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        group: [Sequelize.fn("date_trunc", "day", Sequelize.col("payment_timestamp"))],
        order: [[Sequelize.fn("date_trunc", "day", Sequelize.col("payment_timestamp")), "ASC"]],
      })

      timelineData = dailyPayments.map((item) => ({
        label: moment(item.dataValues.day).format("ddd DD/MM"),
        value: Number.parseFloat(item.dataValues.total),
      }))
    } else if (reportType === "monthly") {
      // For monthly reports, group by week
      const weeklyPayments = await Payment.findAll({
        where: {
          payment_timestamp: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: [
          [Sequelize.fn("date_trunc", "week", Sequelize.col("payment_timestamp")), "week"],
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
        ],
        group: [Sequelize.fn("date_trunc", "week", Sequelize.col("payment_timestamp"))],
        order: [[Sequelize.fn("date_trunc", "week", Sequelize.col("payment_timestamp")), "ASC"]],
      })

      timelineData = weeklyPayments.map((item) => ({
        label: `Week ${moment(item.dataValues.week).format("W")}`,
        value: Number.parseFloat(item.dataValues.total),
      }))
    }

    return {
      reportType,
      periodLabel,
      startDate,
      endDate,
      generatedAt: new Date(),
      stats,
      timelineData,
      details: {
        payments,
        products,
        interactions,
      },
    }
  } catch (error) {
    console.error("Error generating detailed report:", error)
    throw error
  }
}

module.exports = {
  generateDetailedReport,
}
