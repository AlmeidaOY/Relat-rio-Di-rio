"use client"

import { useState } from "react"
import { ArrowLeft, Download, Share2, Printer, Calendar, Filter } from "lucide-react"
import { useReport } from "../hooks/useReport"

export default function DetailedReport({ reportType = "daily", date = new Date(), onBack }) {
  const { report, loading, error, refreshReport } = useReport(reportType, date)
  const [activeSection, setActiveSection] = useState("summary")

  if (loading) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-blue-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="neumorphic-card p-8 rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-blue-200">Carregando relatório...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-blue-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="neumorphic-card p-8 rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full neumorphic-avatar-small flex items-center justify-center mb-4 text-red-500">
            <span className="text-3xl">!</span>
          </div>
          <p className="text-red-300 mb-4">Erro ao carregar relatório</p>
          <button className="neumorphic-button py-2 px-6 rounded-full text-sm" onClick={refreshReport}>
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-blue-800 to-indigo-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="neumorphic-icon-button w-8 h-8 rounded-full flex items-center justify-center mr-3"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-medium">
            Relatório {reportType === "daily" ? "Diário" : reportType === "weekly" ? "Semanal" : "Mensal"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="neumorphic-icon-button w-8 h-8 rounded-full flex items-center justify-center">
            <Download className="w-4 h-4" />
          </button>
          <button className="neumorphic-icon-button w-8 h-8 rounded-full flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="neumorphic-icon-button w-8 h-8 rounded-full flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Date and Filter */}
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="neumorphic-inset px-3 py-1.5 rounded-lg flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-blue-300" />
          <span className="text-sm">{report.periodLabel}</span>
        </div>
        <button className="neumorphic-outset px-3 py-1.5 rounded-lg flex items-center">
          <Filter className="w-4 h-4 mr-2 text-blue-300" />
          <span className="text-sm">Filtrar</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div className="neumorphic-card p-3 rounded-xl">
          <p className="text-xs text-blue-300 mb-1">Total Pagamentos</p>
          <p className="text-lg font-semibold">{report.stats.summary.totalPayments.toLocaleString()} KZ</p>
          <p className="text-xs text-blue-200 mt-1">{report.stats.summary.paymentCount} transações</p>
        </div>
        <div className="neumorphic-card p-3 rounded-xl">
          <p className="text-xs text-blue-300 mb-1">Total Produtos</p>
          <p className="text-lg font-semibold">{report.stats.summary.totalProducts.toLocaleString()} KZ</p>
          <p className="text-xs text-blue-200 mt-1">{report.stats.summary.productCount} produtos</p>
        </div>
        <div className="neumorphic-card p-3 rounded-xl">
          <p className="text-xs text-blue-300 mb-1">Total TPA</p>
          <p className="text-lg font-semibold">{(report.stats.paymentMethods.TPA?.total || 0).toLocaleString()} KZ</p>
          <p className="text-xs text-blue-200 mt-1">
            {report.stats.paymentMethods.TPA?.percentage || 0}% das transações
          </p>
        </div>
        <div className="neumorphic-card p-3 rounded-xl">
          <p className="text-xs text-blue-300 mb-1">Cash & Transferência</p>
          <p className="text-lg font-semibold">
            {(
              (report.stats.paymentMethods.CASH?.total || 0) + (report.stats.paymentMethods.Transferência?.total || 0)
            ).toLocaleString()}{" "}
            KZ
          </p>
          <p className="text-xs text-blue-200 mt-1">
            {(
              Number.parseFloat(report.stats.paymentMethods.CASH?.percentage || 0) +
              Number.parseFloat(report.stats.paymentMethods.Transferência?.percentage || 0)
            ).toFixed(1)}
            % das transações
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="px-4 flex space-x-4 border-b border-blue-700/30 mt-2">
        <button
          className={`pb-2 px-1 ${activeSection === "summary" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveSection("summary")}
        >
          RESUMO
        </button>
        <button
          className={`pb-2 px-1 ${activeSection === "payments" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveSection("payments")}
        >
          PAGAMENTOS
        </button>
        <button
          className={`pb-2 px-1 ${activeSection === "products" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveSection("products")}
        >
          PRODUTOS
        </button>
        <button
          className={`pb-2 px-1 ${activeSection === "interactions" ? "text-blue-300 border-b-2 border-blue-300" : "text-blue-200/70"}`}
          onClick={() => setActiveSection("interactions")}
        >
          LIGAÇÕES
        </button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeSection === "summary" && (
          <div className="px-4 py-3">
            <h3 className="text-lg font-medium mb-3">Resumo do Período</h3>

            <div className="neumorphic-card p-4 rounded-xl mb-4">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Distribuição de Receita</h4>
              <div className="h-40 flex items-center justify-center">
                {/* Placeholder for chart - would use Chart.js in real implementation */}
                <div className="w-32 h-32 rounded-full neumorphic-inset flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 bg-blue-500 h-full"
                      style={{
                        width: "100%",
                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                        transform: `rotate(${(report.stats.summary.totalPayments / (report.stats.summary.totalPayments + report.stats.summary.totalProducts)) * 360}deg)`,
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 bg-orange-500 h-full"
                      style={{
                        width: "100%",
                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                        transform: `rotate(0deg)`,
                      }}
                    ></div>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {Math.round(
                        (report.stats.summary.totalPayments /
                          (report.stats.summary.totalPayments + report.stats.summary.totalProducts)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs">Pagamentos</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-xs">Produtos</span>
                </div>
              </div>
            </div>

            <div className="neumorphic-card p-4 rounded-xl">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Métodos de Pagamento</h4>
              <div className="space-y-3">
                {Object.entries(report.stats.paymentMethods).map(([method, data]) => (
                  <div key={method} className="flex items-center">
                    <div className="h-2 rounded-full bg-blue-500 mr-2" style={{ width: `${data.percentage}%` }}></div>
                    <div className="flex justify-between w-full">
                      <span className="text-xs">{method}</span>
                      <span className="text-xs font-medium">{data.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "payments" && (
          <div className="px-4 py-3">
            <h3 className="text-lg font-medium mb-3">Pagamentos</h3>

            <div className="space-y-3">
              {report.details.payments.map((payment) => (
                <div key={payment.payment_id} className="neumorphic-list-item p-3 rounded-xl flex items-center">
                  <div className="w-10 h-10 rounded-full neumorphic-avatar-small flex items-center justify-center mr-3 text-xs">
                    {payment.payment_method === "Transferência" && <span>TR</span>}
                    {payment.payment_method === "TPA" && <span>TPA</span>}
                    {payment.payment_method === "CASH" && <span>CA</span>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{payment.client_name}</h4>
                    <p className="text-xs text-blue-200">
                      {new Date(payment.payment_timestamp).toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Number.parseFloat(payment.amount).toLocaleString()} KZ</p>
                    <p className="text-xs text-blue-300">{payment.payment_method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "products" && (
          <div className="px-4 py-3">
            <h3 className="text-lg font-medium mb-3">Produtos</h3>

            <div className="space-y-3">
              {report.details.products.map((product) => (
                <div key={product.sale_id} className="neumorphic-list-item p-3 rounded-xl flex items-center">
                  <div className="w-10 h-10 rounded-full neumorphic-avatar-small flex items-center justify-center mr-3 text-xs">
                    <span>PR</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.product_name}</h4>
                    <p className="text-xs text-blue-200">
                      {new Date(product.sale_timestamp).toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Number.parseFloat(product.value).toLocaleString()} KZ</p>
                    <p className="text-xs text-blue-300">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "interactions" && (
          <div className="px-4 py-3">
            <h3 className="text-lg font-medium mb-3">Ligações</h3>

            {report.details.interactions.length === 0 ? (
              <div className="neumorphic-card p-5 rounded-xl flex flex-col items-center justify-center h-40">
                <p className="text-blue-200 mb-3">Nenhuma ligação registrada para este período</p>
                <button className="neumorphic-button py-2 px-6 rounded-full text-sm">Registrar Nova Ligação</button>
              </div>
            ) : (
              <div className="space-y-3">
                {report.details.interactions.map((interaction) => (
                  <div
                    key={interaction.interaction_id}
                    className="neumorphic-list-item p-3 rounded-xl flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full neumorphic-avatar-small flex items-center justify-center mr-3 text-xs">
                      <span>
                        {interaction.interaction_type === "Reclamação" && "RC"}
                        {interaction.interaction_type === "Levantamento" && "LV"}
                        {interaction.interaction_type === "Intervenção" && "IN"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{interaction.client_name}</h4>
                      <p className="text-xs text-blue-200">
                        {new Date(interaction.interaction_timestamp).toLocaleTimeString("pt-PT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-300">{interaction.interaction_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
