import { ReportsAPI } from "./api.js"

// DOM elements
const reportTypeSelect = document.getElementById("report-type")
const reportDateInput = document.getElementById("report-date")
const generateReportBtn = document.getElementById("generate-report-btn")
const reportContainer = document.getElementById("report-container")
const loadingIndicator = document.getElementById("loading-indicator")

// Initialize date picker with current date
reportDateInput.valueAsDate = new Date()

// Event listeners
generateReportBtn.addEventListener("click", generateReport)

// Generate report function
async function generateReport() {
  try {
    // Show loading indicator
    loadingIndicator.classList.remove("hidden")
    reportContainer.classList.add("hidden")

    const reportType = reportTypeSelect.value
    const date = reportDateInput.value // Format: YYYY-MM-DD

    // Fetch report data from API
    const reportData = await ReportsAPI.generate(reportType, date)

    // Render report
    renderReport(reportData)

    // Hide loading indicator
    loadingIndicator.classList.add("hidden")
    reportContainer.classList.remove("hidden")
  } catch (error) {
    console.error("Error generating report:", error)
    alert("Failed to generate report. Please try again.")
    loadingIndicator.classList.add("hidden")
  }
}

// Render report function
function renderReport(reportData) {
  // Update report header
  const reportType = reportTypeSelect.value
  document.getElementById("report-title").textContent =
    `Relatório ${reportType === "daily" ? "Diário" : reportType === "weekly" ? "Semanal" : "Mensal"}`
  document.getElementById("report-period").textContent = reportData.periodLabel
  document.getElementById("current-date").textContent = new Date().toLocaleDateString("pt-PT")

  // Update summary cards
  document.getElementById("total-payments").textContent =
    `${reportData.stats.summary.totalPayments.toLocaleString()} KZ`
  document.getElementById("total-products").textContent =
    `${reportData.stats.summary.totalProducts.toLocaleString()} KZ`
  document.getElementById("total-tpa").textContent =
    `${(reportData.stats.paymentMethods.TPA?.total || 0).toLocaleString()} KZ`
  document.getElementById("total-cash-transfer").textContent = `${(
    (reportData.stats.paymentMethods.CASH?.total || 0) + (reportData.stats.paymentMethods.Transferência?.total || 0)
  ).toLocaleString()} KZ`

  // Render payments table
  renderPaymentsTable(reportData.details.payments)

  // Render products table
  renderProductsTable(reportData.details.products)

  // Render interactions table
  renderInteractionsTable(reportData.details.interactions)

  // Update charts
  updateCharts(reportData)
}

// Render payments table
function renderPaymentsTable(payments) {
  const tableBody = document.querySelector("#payments-table tbody")
  tableBody.innerHTML = ""

  if (payments.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-gray-500">
          <i class="fas fa-info-circle mr-2"></i>
          Nenhum pagamento registrado para este período
        </td>
      </tr>
    `
    return
  }

  let totalAmount = 0

  payments.forEach((payment) => {
    const row = document.createElement("tr")

    // Format payment timestamp
    const paymentTime = new Date(payment.payment_timestamp).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Determine payment method icon and background
    let methodIcon, methodBg
    switch (payment.payment_method) {
      case "Transferência":
        methodIcon = '<i class="fas fa-university"></i>'
        methodBg = "bg-blue-100 text-blue-600"
        break
      case "TPA":
        methodIcon = '<i class="fas fa-credit-card"></i>'
        methodBg = "bg-purple-100 text-purple-600"
        break
      case "CASH":
        methodIcon = '<i class="fas fa-money-bill-alt"></i>'
        methodBg = "bg-green-100 text-green-600"
        break
      default:
        methodIcon = '<i class="fas fa-money-bill-wave"></i>'
        methodBg = "bg-gray-100 text-gray-600"
    }

    row.innerHTML = `
      <td class="font-medium">${payment.client_name}</td>
      <td>${Number.parseFloat(payment.amount).toLocaleString()} KZ</td>
      <td>
        <span class="flex items-center">
          <div class="payment-method-icon ${methodBg}">
            ${methodIcon}
          </div>
          ${payment.payment_method}
        </span>
      </td>
      <td>${paymentTime}</td>
      <td class="no-print">
        <div class="flex space-x-2">
          <button class="text-blue-500 hover:text-blue-700" onclick="editPayment(${payment.payment_id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700" onclick="deletePayment(${payment.payment_id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `

    tableBody.appendChild(row)
    totalAmount += Number.parseFloat(payment.amount)
  })

  // Update total
  document.getElementById("payment-total").textContent = `${totalAmount.toLocaleString()} KZ`
}

// Render products table
function renderProductsTable(products) {
  const tableBody = document.querySelector("#products-table tbody")
  tableBody.innerHTML = ""

  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-gray-500">
          <i class="fas fa-info-circle mr-2"></i>
          Nenhum produto registrado para este período
        </td>
      </tr>
    `
    return
  }

  let totalValue = 0

  products.forEach((product) => {
    const row = document.createElement("tr")

    // Determine payment method icon and background
    let methodIcon, methodBg
    if (product.payment_method_details.includes("TPA") && product.payment_method_details.includes("CASH")) {
      methodIcon = '<i class="fas fa-money-bill-wave"></i>'
      methodBg = "bg-gray-100 text-gray-600"
    } else if (product.payment_method_details.includes("TPA")) {
      methodIcon = '<i class="fas fa-credit-card"></i>'
      methodBg = "bg-purple-100 text-purple-600"
    } else {
      methodIcon = '<i class="fas fa-money-bill-alt"></i>'
      methodBg = "bg-green-100 text-green-600"
    }

    row.innerHTML = `
      <td class="font-medium">${product.product_name}</td>
      <td>${Number.parseFloat(product.value).toLocaleString()} KZ</td>
      <td>
        <span class="flex items-center">
          <div class="payment-method-icon ${methodBg}">
            ${methodIcon}
          </div>
          ${product.payment_method_details}
        </span>
      </td>
      <td>
        <span class="badge badge-success">${product.category}</span>
      </td>
      <td class="no-print">
        <div class="flex space-x-2">
          <button class="text-blue-500 hover:text-blue-700" onclick="editProduct(${product.sale_id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700" onclick="deleteProduct(${product.sale_id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `

    tableBody.appendChild(row)
    totalValue += Number.parseFloat(product.value)
  })

  // Update total
  document.getElementById("product-total").textContent = `${totalValue.toLocaleString()} KZ`
}

// Render interactions table
function renderInteractionsTable(interactions) {
  const tableBody = document.querySelector("#interactions-table tbody")
  tableBody.innerHTML = ""

  if (interactions.length === 0) {
    tableBody.innerHTML = `
      <tr class="border-b">
        <td colspan="5" class="text-center py-4 text-gray-500">
          <i class="fas fa-info-circle mr-2"></i>
          Nenhuma ligação registrada para este período
        </td>
      </tr>
    `
    return
  }

  interactions.forEach((interaction) => {
    const row = document.createElement("tr")

    // Format interaction timestamp
    const interactionTime = new Date(interaction.interaction_timestamp).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    })

    row.innerHTML = `
      <td class="font-medium">${interaction.client_name}</td>
      <td>${interaction.interaction_type === "Reclamação" ? "Sim" : "Não"}</td>
      <td>${interaction.interaction_type === "Levantamento" ? "Sim" : "Não"}</td>
      <td>${interactionTime}</td>
      <td class="no-print">
        <div class="flex space-x-2">
          <button class="text-blue-500 hover:text-blue-700" onclick="editInteraction(${interaction.interaction_id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-500 hover:text-red-700" onclick="deleteInteraction(${interaction.interaction_id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `

    tableBody.appendChild(row)
  })
}

// Update charts
function updateCharts(reportData) {
  // Payment methods chart
  updatePaymentMethodsChart(reportData.stats.paymentMethods)

  // Products chart
  updateProductsChart(reportData.stats.productBreakdown)

  // Timeline chart
  updateTimelineChart(reportData.timelineData)

  // Payment method distribution chart
  updatePaymentMethodDistributionChart(reportData.stats.paymentMethods)

  // Sales by category chart
  window.updateSalesByCategoryChart(reportData.stats.summary)

  // Revenue distribution chart
  window.updateRevenueDistributionChart(reportData.stats.summary)
}

// Initialize charts (this would use Chart.js as in your original HTML)
function initializeCharts() {
  // This would initialize all the Chart.js instances
  // Similar to what you had in your original HTML
}

// Call initializeCharts when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeCharts()

  // Mock chart functions to avoid errors
  window.updatePaymentMethodsChart = () => {}
  window.updateProductsChart = () => {}
  window.updateTimelineChart = () => {}
  window.updatePaymentMethodDistributionChart = () => {}
  window.updateSalesByCategoryChart = () => {}
  window.updateRevenueDistributionChart = () => {}
})
