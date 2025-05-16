"use client"

import { useState, useEffect } from "react"
import { ReportsAPI } from "../services/api"

export function useReport(reportType = "daily", date = new Date()) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Format date for API
  const formatDate = (date) => {
    return date instanceof Date ? date.toISOString().split("T")[0] : date
  }

  // Fetch report data
  const fetchReport = async (type, date) => {
    setLoading(true)
    setError(null)

    try {
      let data
      const formattedDate = formatDate(date)

      switch (type) {
        case "daily":
          data = await ReportsAPI.getDailyReport(formattedDate)
          break
        case "weekly":
          data = await ReportsAPI.getWeeklyReport(formattedDate)
          break
        case "monthly":
          data = await ReportsAPI.getMonthlyReport(formattedDate)
          break
        default:
          data = await ReportsAPI.getDailyReport(formattedDate)
      }

      setReport(data)
    } catch (err) {
      setError(err.message || "Failed to fetch report")
      console.error("Error fetching report:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch report on mount or when dependencies change
  useEffect(() => {
    fetchReport(reportType, date)
  }, [reportType, date])

  // Refresh report data
  const refreshReport = () => {
    fetchReport(reportType, date)
  }

  return {
    report,
    loading,
    error,
    refreshReport,
  }
}
