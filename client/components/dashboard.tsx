"use client"

import { useState, useRef } from "react"
import {
  BarChart3,
  PieChart,
  RefreshCw,
  ChevronDown,
  Bell,
  Menu,
  Info,
  X,
  Check,
  Link2,
  List,
  CreditCard,
  DollarSign,
  ArrowUpDown,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("payments")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullStartY, setPullStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [reportType, setReportType] = useState("daily")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [viewMode, setViewMode] = useState("card") // card or list

  const contentRef = useRef(null)

  // Simulate data loading
  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Handle pull to refresh
  const handleTouchStart = (e) => {
    if (contentRef.current.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e) => {
    if (isPulling) {
      const distance = e.touches[0].clientY - pullStartY
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100))
      }
    }
  }

  const handleTouchEnd = () => {
    if (isPulling) {
      if (pullDistance > 70) {
        refreshData()
      }
      setPullDistance(0)
      setIsPulling(false)
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Menu className="w-6 h-6 mr-3" />
          <h1 className="text-xl font-medium">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Info className="w-5 h-5" />
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 flex space-x-4 border-b border-blue-700/30">
        <button
          className={`pb-2 px-1 ${activeTab === "profile" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveTab("profile")}
        >
          PROFILE
        </button>
        <span className="text-blue-200/50">•</span>
        <button
          className={`pb-2 px-1 ${activeTab === "payments" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveTab("payments")}
        >
          RECENT
        </button>
      </div>

      {/* Mode Selector */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="neumorphic-inset px-3 py-1.5 rounded-lg flex items-center">
            <span className="text-sm font-medium mr-2">PROFILE MODE</span>
            <span className="text-xs text-blue-300">DEFAULT</span>
            <ChevronDown className="w-4 h-4 ml-1 text-blue-300" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="neumorphic-inset px-3 py-1.5 rounded-lg flex items-center">
            <span className="text-xs text-blue-300">DISCOVERY</span>
            <span className="ml-2 w-8 h-4 bg-blue-400/30 rounded-full flex items-center p-0.5">
              <span className="w-3 h-3 bg-white rounded-full ml-auto"></span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex space-x-2">
        <button className="neumorphic-outset px-4 py-2 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 mr-1" />
          <span className="text-sm">Clear</span>
        </button>
        <button className="neumorphic-outset px-4 py-2 rounded-full flex items-center justify-center">
          <RefreshCw className="w-4 h-4 mr-1" />
          <span className="text-sm">Radar</span>
        </button>
        <button
          className="neumorphic-outset px-4 py-2 rounded-full flex items-center justify-center bg-blue-500/20 flex-grow"
          onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
        >
          {viewMode === "card" ? (
            <>
              <div className="w-4 h-4 mr-1 border border-blue-300 rounded"></div>
              <span className="text-sm">Card</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4 mr-1" />
              <span className="text-sm">List</span>
            </>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="text-xs text-center text-blue-200/70 mt-1">
        Swipe Card <span className="mx-1">←</span> to Forget • Swipe <span className="mx-1">→</span> to Remember
      </div>

      {/* Main Content Area - Scrollable */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto pb-20 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        {isPulling && (
          <div
            className="absolute top-0 left-0 w-full flex justify-center items-center"
            style={{ height: `${pullDistance}px` }}
          >
            <RefreshCw
              className={`w-6 h-6 text-blue-300 ${pullDistance > 70 ? "animate-spin" : ""}`}
              style={{ transform: `rotate(${pullDistance * 2}deg)` }}
            />
          </div>
        )}

        {/* Content based on view mode */}
        <div className="px-4 py-2">{viewMode === "card" ? <ReportCard /> : <ReportList />}</div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="neumorphic-inset px-2 py-1 rounded-lg flex items-center">
            <span className="text-xs text-blue-300">DISCOVERY</span>
            <span className="ml-1">ON</span>
          </div>
        </div>

        <button className="neumorphic-ping w-16 h-16 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full ping-animation"></div>
          <span className="text-sm font-medium">PING</span>
        </button>

        <div className="flex items-center">
          <div className="neumorphic-inset px-2 py-1 rounded-lg flex items-center">
            <span className="text-xs text-blue-300">SHARING</span>
            <span className="ml-1">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Report Card Component
function ReportCard() {
  return (
    <div className="neumorphic-card p-5 rounded-2xl flex flex-col items-center">
      <div className="w-24 h-24 rounded-full overflow-hidden neumorphic-avatar mb-4">
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-1">Relatório Diário</h2>
      <p className="text-blue-200 text-sm mb-4">HOJE, 13/05/2025</p>

      <div className="w-full space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Total Pagamentos:</span>
          <span className="font-medium">188.400 KZ</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Total Produtos:</span>
          <span className="font-medium">74.300 KZ</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Total Geral:</span>
          <span className="font-medium text-green-400">262.700 KZ</span>
        </div>
      </div>

      <button className="neumorphic-button py-2 px-6 rounded-full text-sm">VER RELATÓRIO COMPLETO</button>

      <div className="flex justify-between w-full mt-6 pt-4 border-t border-blue-700/30">
        <button className="neumorphic-icon-button w-10 h-10 rounded-full flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </button>
        <button className="neumorphic-icon-button w-10 h-10 rounded-full flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
        <button className="neumorphic-icon-button w-10 h-10 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5" />
        </button>
        <button className="neumorphic-icon-button w-10 h-10 rounded-full flex items-center justify-center">
          <Link2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Report List Component
function ReportList() {
  const reports = [
    {
      id: 1,
      title: "Pagamentos NET",
      date: "HOJE, 11:46 AM",
      amount: "188.400 KZ",
      icon: <DollarSign className="w-5 h-5 text-green-400" />,
    },
    {
      id: 2,
      title: "Produtos da Loja",
      date: "HOJE, 11:46 AM",
      amount: "74.300 KZ",
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
    },
    {
      id: 3,
      title: "Transações TPA",
      date: "HOJE, 11:46 AM",
      amount: "128.750 KZ",
      icon: <CreditCard className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 4,
      title: "Cash & Transferência",
      date: "HOJE, 11:46 AM",
      amount: "133.950 KZ",
      icon: <ArrowUpDown className="w-5 h-5 text-orange-400" />,
    },
    {
      id: 5,
      title: "Relatório Semanal",
      date: "ONTEM, 15:30 PM",
      amount: "1.254.800 KZ",
      icon: <PieChart className="w-5 h-5 text-indigo-400" />,
    },
  ]

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="neumorphic-list-item p-3 rounded-xl flex items-center">
          <div className="w-12 h-12 rounded-full neumorphic-avatar-small flex items-center justify-center mr-3">
            {report.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{report.title}</h3>
            <p className="text-xs text-blue-200">{report.date}</p>
          </div>
          <div className="text-right">
            <span className="font-medium">{report.amount}</span>
            <button className="ml-2 text-blue-300">•••</button>
          </div>
        </div>
      ))}
    </div>
  )
}
