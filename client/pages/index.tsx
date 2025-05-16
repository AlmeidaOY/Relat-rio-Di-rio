"use client"

import { useState } from "react"
import Dashboard from "../components/dashboard"
import DetailedReport from "../components/detailed-report"

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [reportType, setReportType] = useState("daily")
  const [reportDate, setReportDate] = useState(new Date())

  const handleViewReport = (type, date) => {
    setReportType(type)
    setReportDate(date)
    setCurrentView("report")
  }

  return (
    <main>
      {currentView === "dashboard" && <Dashboard onViewReport={handleViewReport} />}

      {currentView === "report" && (
        <DetailedReport reportType={reportType} date={reportDate} onBack={() => setCurrentView("dashboard")} />
      )}
    </main>
  )
}
