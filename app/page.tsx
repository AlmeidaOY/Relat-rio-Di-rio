"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSignIcon as Money,
  ShoppingCart,
  CreditCard,
  ArrowUpDown,
  Search,
  Plus,
  Edit,
  Trash,
  University,
  Phone,
  PieChart,
  BarChart,
  LineChart,
  Percent,
  FileText,
  ChevronUp,
} from "lucide-react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from "chart.js"
import { Doughnut, Pie, Line, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("payments")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [paymentSearch, setPaymentSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [interactionSearch, setInteractionSearch] = useState("")

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Filter payments based on search
  const filteredPayments = payments.filter(
    (payment) =>
      payment.name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      payment.paymentMethod.toLowerCase().includes(paymentSearch.toLowerCase()),
  )

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  )

  return (
    <div className="bg-[#f5f7fa] min-h-screen">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#0056b3] to-[#4a90e2] py-6 mb-8 print:mb-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/placeholder.svg?height=64&width=200" alt="ANGUBU, LDA Logo" className="h-16 mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Relatório Diário</h1>
              <p className="text-white opacity-90">Terça-feira - 13/05/2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg">
              <i className="far fa-calendar-alt mr-2"></i>
              <span id="current-date">13/05/2025</span>
            </span>
            <Button variant="secondary" className="text-primary">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Atualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Payments */}
          <StatCard
            title="Total Pagamentos"
            value="188.400 KZ"
            subtitle="7 clientes"
            icon={<Money />}
            color="from-blue-500 to-blue-700"
          />

          {/* Total Products */}
          <StatCard
            title="Total Produtos"
            value="74.300 KZ"
            subtitle="3 produtos"
            icon={<ShoppingCart />}
            color="from-green-500 to-green-700"
          />

          {/* TPA Transactions */}
          <StatCard
            title="Total TPA"
            value="128.750 KZ"
            subtitle="68% das transações"
            icon={<CreditCard />}
            color="from-purple-500 to-purple-700"
          />

          {/* Cash & Transfer */}
          <StatCard
            title="Cash & Transferência"
            value="133.950 KZ"
            subtitle="32% das transações"
            icon={<ArrowUpDown />}
            color="from-orange-400 to-orange-600"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="payments">
              <Money className="mr-2 h-4 w-4" /> Pagamentos
            </TabsTrigger>
            <TabsTrigger value="products">
              <ShoppingCart className="mr-2 h-4 w-4" /> Produtos
            </TabsTrigger>
            <TabsTrigger value="interactions">
              <Phone className="mr-2 h-4 w-4" /> Ligações
            </TabsTrigger>
            <TabsTrigger value="charts">
              <PieChart className="mr-2 h-4 w-4" /> Análise
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        <Money className="inline-block text-green-500 mr-2 h-5 w-5" />
                        Pagamentos Referente ao NET
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Pesquisar..."
                            className="pl-10"
                            value={paymentSearch}
                            onChange={(e) => setPaymentSearch(e.target.value)}
                          />
                        </div>
                        <Button size="icon" className="bg-green-500 hover:bg-green-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#0056b3] text-white">
                            <th className="p-4 text-left">Nome</th>
                            <th className="p-4 text-left">Valor</th>
                            <th className="p-4 text-left">Modo de Pagamento</th>
                            <th className="p-4 text-left">Hora</th>
                            <th className="p-4 text-left">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPayments.map((payment, index) => (
                            <tr key={index} className={index % 2 === 1 ? "bg-blue-50/30" : ""}>
                              <td className="p-4 font-medium">{payment.name}</td>
                              <td className="p-4">{payment.amount}</td>
                              <td className="p-4">
                                <span className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${payment.methodBg}`}
                                  >
                                    {payment.methodIcon}
                                  </div>
                                  {payment.paymentMethod}
                                </span>
                              </td>
                              <td className="p-4">{payment.time}</td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td className="p-4 font-semibold">Total</td>
                            <td className="p-4 font-semibold">188.400 KZ</td>
                            <td colSpan={3}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      <BarChart className="inline-block text-blue-500 mr-2 h-5 w-5" />
                      Resumo dos Pagamentos
                    </h3>
                    <div className="mb-6 h-[200px]">
                      <Doughnut data={paymentMethodsChartData} options={doughnutOptions} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>Transferência</span>
                        </div>
                        <span className="font-medium">96.900 KZ</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span>TPA</span>
                        </div>
                        <span className="font-medium">66.500 KZ</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>CASH</span>
                        </div>
                        <span className="font-medium">25.500 KZ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        <ShoppingCart className="inline-block text-orange-500 mr-2 h-5 w-5" />
                        Produtos da Loja (ENTRADAS)
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Pesquisar..."
                            className="pl-10"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                          />
                        </div>
                        <Button size="icon" className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#0056b3] text-white">
                            <th className="p-4 text-left">Produto</th>
                            <th className="p-4 text-left">Valor</th>
                            <th className="p-4 text-left">Modo de Pagamento</th>
                            <th className="p-4 text-left">Categoria</th>
                            <th className="p-4 text-left">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, index) => (
                            <tr key={index} className={index % 2 === 1 ? "bg-blue-50/30" : ""}>
                              <td className="p-4 font-medium">{product.name}</td>
                              <td className="p-4">{product.amount}</td>
                              <td className="p-4">
                                <span className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${product.methodBg}`}
                                  >
                                    {product.methodIcon}
                                  </div>
                                  {product.paymentMethod}
                                </span>
                              </td>
                              <td className="p-4">
                                <Badge variant="success" className="bg-green-500">
                                  ENTRADA
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td className="p-4 font-semibold">Total</td>
                            <td className="p-4 font-semibold">74.300 KZ</td>
                            <td colSpan={3}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      <PieChart className="inline-block text-orange-500 mr-2 h-5 w-5" />
                      Distribuição de Produtos
                    </h3>
                    <div className="mb-6 h-[200px]">
                      <Doughnut data={productsChartData} options={doughnutOptions} />
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>TINTEIRO HP preto</span>
                        </div>
                        <span className="font-medium">26.8%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span>Caixa de Resma</span>
                        </div>
                        <span className="font-medium">24.0%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Par de tinteiro 123</span>
                        </div>
                        <span className="font-medium">49.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Interactions Tab */}
          <TabsContent value="interactions">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    <Phone className="inline-block text-indigo-500 mr-2 h-5 w-5" />
                    Ligações (Intervenção, reclamação e levantamento)
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Pesquisar..."
                        className="pl-10"
                        value={interactionSearch}
                        onChange={(e) => setInteractionSearch(e.target.value)}
                      />
                    </div>
                    <Button size="icon" className="bg-indigo-500 hover:bg-indigo-600">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0056b3] text-white">
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">Reclamações</th>
                        <th className="p-4 text-left">Levantamentos</th>
                        <th className="p-4 text-left">Hora</th>
                        <th className="p-4 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          <i className="fas fa-info-circle mr-2"></i>
                          Nenhuma ligação registrada para este dia
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Nova Ligação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <LineChart className="inline-block text-blue-500 mr-2 h-5 w-5" />
                  Evolução dos Pagamentos (13/05/2025)
                </h3>
                <div className="h-[250px]">
                  <Line data={timelineChartData} options={lineChartOptions} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <PieChart className="inline-block text-purple-500 mr-2 h-5 w-5" />
                  Total por Método de Pagamento
                </h3>
                <div className="h-[250px]">
                  <Bar data={paymentMethodDistributionData} options={barChartOptions} />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <BarChart className="inline-block text-green-500 mr-2 h-5 w-5" />
                  Vendas por Categoria
                </h3>
                <div className="h-[250px]">
                  <Bar data={salesByCategoryData} options={barChartOptions} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <Percent className="inline-block text-red-500 mr-2 h-5 w-5" />
                  Distribuição de Receita
                </h3>
                <div className="flex justify-center h-[250px]">
                  <div className="w-[300px]">
                    <Pie data={revenueDistributionData} options={pieChartOptions} />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FileText className="inline-block text-indigo-500 mr-2 h-5 w-5" />
                Resumo Diário - 13/05/2025
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Transações</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Total de Pagamentos NET:</span>
                      <span className="font-medium">7</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total de Produtos Vendidos:</span>
                      <span className="font-medium">3</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Transações por TPA:</span>
                      <span className="font-medium">5</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Transações em CASH:</span>
                      <span className="font-medium">1</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Transferências:</span>
                      <span className="font-medium">3</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Valores</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Total Pagamento NET:</span>
                      <span className="font-medium">188.400 KZ</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total Produtos da Loja:</span>
                      <span className="font-medium">74.300 KZ</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total Geral:</span>
                      <span className="font-medium text-green-600">262.700 KZ</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Valor Médio por Transação:</span>
                      <span className="font-medium">26.270 KZ</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Valor Máximo:</span>
                      <span className="font-medium">45.900 KZ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="/placeholder.svg?height=48&width=200" alt="ANGUBU, LDA Logo" className="h-12 mb-2" />
              <p className="text-sm text-gray-300">Relatório gerado em 13/05/2025 às 23:59</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
              <div>
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider text-gray-400">Contactos</h4>
                <div className="space-y-1">
                  <p className="flex items-center justify-center md:justify-start">
                    <i className="fas fa-envelope mr-2 text-gray-400"></i>
                    <a href="mailto:info@grupoangbu.com" className="hover:text-blue-300 transition-colors">
                      info@grupoangbu.com
                    </a>
                  </p>
                  <p className="flex items-center justify-center md:justify-start">
                    <i className="fas fa-phone mr-2 text-gray-400"></i>
                    <a href="tel:+27449465037010" className="hover:text-blue-300 transition-colors">
                      +2744946 503 710
                    </a>
                  </p>
                  <p className="flex items-center justify-center md:justify-start">
                    <i className="fas fa-phone mr-2 text-gray-400"></i>
                    <a href="tel:+27449132266084" className="hover:text-blue-300 transition-colors">
                      +2744913 226 684
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider text-gray-400">Endereço</h4>
                <p className="flex items-center justify-center md:justify-start">
                  <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                  Bairro Deolinda Rodrigues, Cabinda
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-center text-gray-400">
            <p>© 2025 ANGUBU, LDA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-[#0056b3] text-white flex items-center justify-center shadow-lg z-50 transition-opacity"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <Card className={`bg-gradient-to-br ${color} text-white p-6 relative overflow-hidden`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm text-white text-opacity-80">{subtitle}</div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-white bg-opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white bg-opacity-5 translate-x-1/3 translate-y-1/3"></div>
    </Card>
  )
}

// Sample data
const payments = [
  {
    name: "André Patrício",
    amount: "25.500 KZ",
    paymentMethod: "Transferência",
    methodIcon: <University className="h-4 w-4" />,
    methodBg: "bg-blue-100 text-blue-600",
    time: "9:21",
  },
  {
    name: "Mesquita Yoel Mellake",
    amount: "25.500 KZ",
    paymentMethod: "CASH",
    methodIcon: <Money className="h-4 w-4" />,
    methodBg: "bg-green-100 text-green-600",
    time: "9:25",
  },
  {
    name: "Organizações Dembi",
    amount: "25.500 KZ",
    paymentMethod: "Transferência",
    methodIcon: <University className="h-4 w-4" />,
    methodBg: "bg-blue-100 text-blue-600",
    time: "9:40",
  },
  {
    name: "Frederico Zinga Chincócolo",
    amount: "25.500 KZ",
    paymentMethod: "TPA",
    methodIcon: <CreditCard className="h-4 w-4" />,
    methodBg: "bg-purple-100 text-purple-600",
    time: "13:27",
  },
  {
    name: "Joaquim Afonso",
    amount: "25.500 KZ",
    paymentMethod: "TPA",
    methodIcon: <CreditCard className="h-4 w-4" />,
    methodBg: "bg-purple-100 text-purple-600",
    time: "14:02",
  },
  {
    name: "Tan Chuntai",
    amount: "45.900 KZ",
    paymentMethod: "Transferência",
    methodIcon: <University className="h-4 w-4" />,
    methodBg: "bg-blue-100 text-blue-600",
    time: "14:17",
  },
  {
    name: "Rose Maria da Costa",
    amount: "15.000 KZ",
    paymentMethod: "TPA",
    methodIcon: <CreditCard className="h-4 w-4" />,
    methodBg: "bg-purple-100 text-purple-600",
    time: "16:18",
  },
]

const products = [
  {
    name: "TINTEIRO HP preto",
    amount: "19.950 KZ",
    paymentMethod: "(13.950 TPA) - 6.000 CASH",
    methodIcon: <Money className="h-4 w-4" />,
    methodBg: "bg-gray-100 text-gray-600",
  },
  {
    name: "Caixa de Resma",
    amount: "17.800 KZ",
    paymentMethod: "TPA",
    methodIcon: <CreditCard className="h-4 w-4" />,
    methodBg: "bg-purple-100 text-purple-600",
  },
  {
    name: "Par de tinteiro 123",
    amount: "36.550 KZ",
    paymentMethod: "TPA",
    methodIcon: <CreditCard className="h-4 w-4" />,
    methodBg: "bg-purple-100 text-purple-600",
  },
]

// Chart data
const paymentMethodsChartData = {
  labels: ["Transferência", "TPA", "CASH"],
  datasets: [
    {
      data: [96900, 66500, 25000],
      backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981"],
      hoverBackgroundColor: ["#2563eb", "#7c3aed", "#059669"],
      borderWidth: 0,
    },
  ],
}

const productsChartData = {
  labels: ["TINTEIRO HP preto", "Caixa de Resma", "Par de tinteiro 123"],
  datasets: [
    {
      data: [19950, 17800, 36550],
      backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981"],
      hoverBackgroundColor: ["#2563eb", "#7c3aed", "#059669"],
      borderWidth: 0,
    },
  ],
}

const timelineChartData = {
  labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  datasets: [
    {
      label: "Pagamentos",
      data: [51000, 25500, 0, 0, 25500, 71400, 0, 15000, 0],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
}

const paymentMethodDistributionData = {
  labels: ["Transferência", "TPA", "CASH"],
  datasets: [
    {
      label: "Valor Total",
      data: [96900, 66500, 25000],
      backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(139, 92, 246, 0.7)", "rgba(16, 185, 129, 0.7)"],
      borderColor: ["#3b82f6", "#8b5cf6", "#10b981"],
      borderWidth: 1,
    },
  ],
}

const salesByCategoryData = {
  labels: ["Pagamento NET", "Produtos da Loja"],
  datasets: [
    {
      label: "Valor Total",
      data: [188400, 74300],
      backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(245, 158, 11, 0.7)"],
      borderColor: ["#3b82f6", "#f59e0b"],
      borderWidth: 1,
    },
  ],
}

const revenueDistributionData = {
  labels: ["Pagamento NET", "Produtos da Loja"],
  datasets: [
    {
      data: [71.7, 28.3],
      backgroundColor: ["#3b82f6", "#f59e0b"],
      hoverBackgroundColor: ["#2563eb", "#d97706"],
      borderWidth: 0,
    },
  ],
}

// Chart options
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${context.label}: ${value.toLocaleString()} KZ (${percentage}%)`
        },
      },
    },
  },
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}%`,
      },
    },
  },
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} KZ`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString() + " KZ",
      },
    },
  },
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} KZ`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString() + " KZ",
      },
    },
  },
}
