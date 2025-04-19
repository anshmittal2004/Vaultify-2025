"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { VaultTable } from "@/components/vault-table"
import { BarChart3, ChevronDown, Globe, Home, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import LivePricesTable from "@/components/live_prices-table"
import TopNews from "@/components/top_news"
import MarketsNews from "@/components/markets_news"
import { useState } from "react"
import { ThemeProvider } from "next-themes" // Adjusted import for next-themes

export default function Page() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dashboardChart, setDashboardChart] = useState(false)
  const [marketTrend, setMarketTrend] = useState(false)
  const [vaultDetails, setVaultDetails] = useState(false)
  const [statsIncome, setStatsIncome] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("en")
  const [notifications, setNotifications] = useState(true)
  const [profitInput, setProfitInput] = useState("")
  const [topNews, setTopNews] = useState(false) // Added missing state

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleLanguage = () => setLanguage(language === "en" ? "hi" : "en")
  const toggleNotifications = () => setNotifications(!notifications)
  const calculateProfit = () => {
    const amount = parseFloat(profitInput) || 0
    const apy = 0.05
    const profit = amount * apy
    alert(`Estimated Profit for ${profitInput} at 5% APY: $${profit.toFixed(2)}`)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme={theme}>
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans transition-colors duration-300 ${theme === "light" ? "bg-gradient-to-br from-white to-gray-200 text-gray-900" : ""}`}>
        <div className="relative">
          <div className="absolute top-4 left-4 animate-spin-slow">
            <Wallet className="h-12 w-12 text-blue-400" />
          </div>
        </div>
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 pt-16">
          <aside className="border-r bg-background/50 backdrop-blur">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <span className="font-bold text-2xl">Vaultify 2025</span>
            </div>
            <div className="px-4 py-4">
              <Input placeholder="Search" className="bg-background/50" />
            </div>
            <nav className="space-y-2 px-2">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setDashboardChart(!dashboardChart)}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setStatsIncome(!statsIncome)}>
                <BarChart3 className="h-4 w-4" />
                Statistics & Income
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMarketTrend(!marketTrend)}>
                <Globe className="h-4 w-4" />
                Markets
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setTopNews(!topNews)}>
                <Home className="h-4 w-4" />
                Top News
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setVaultDetails(!vaultDetails)}>
                <Wallet className="h-4 w-4" />
                Yield Vaults
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSettingsOpen(!settingsOpen)}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LifeBuoy className="h-4 w-4" />
                Support
              </Button>
            </nav>
            {settingsOpen && (
              <div className="p-4">
                <Button variant="ghost" className="w-full mb-2" onClick={toggleTheme}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button variant="ghost" className="w-full mb-2" onClick={toggleLanguage}>
                  Language: {language === "en" ? "Hindi" : "English"}
                </Button>
                <Button variant="ghost" className="w-full mb-2" onClick={toggleNotifications}>
                  Notifications: {notifications ? "On" : "Off"}
                </Button>
                <Button variant="ghost" className="w-full">Version 2.1.0</Button>
              </div>
            )}
            {dashboardChart && <div className="p-4 bg-gray-800 rounded">Pie Chart Placeholder</div>}
            {statsIncome && <div className="p-4 bg-gray-800 rounded">Income Report Placeholder</div>}
            {marketTrend && <MarketsNews />}
            {topNews && <TopNews />}
            {vaultDetails && (
              <div className="p-4 bg-gray-800 rounded">Vault Details: Bitcoin, USDT, Ethereum</div>
            )}
            {profitInput && (
              <div className="p-4">
                <Input placeholder="Enter investment amount" value={profitInput} onChange={(e) => setProfitInput(e.target.value)} />
                <Button className="mt-2" onClick={calculateProfit}>Calculate Profit</Button>
              </div>
            )}
          </aside>
          <main className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Overview</h1>
                <div className="text-sm text-muted-foreground">Aug 13, 2025 - Aug 18, 2025</div>
              </div>
              <Button variant="outline" className="gap-2">
                Ethereum Network
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <MetricsCard
                title="Your Balance"
                value="$74,892"
                change={{ value: "$1,340", percentage: "-2.1%", isPositive: false }}
              />
              <MetricsCard
                title="Your Deposits"
                value="$54,892"
                change={{ value: "$1,340", percentage: "+13.2%", isPositive: true }}
              />
              <MetricsCard
                title="Accrued Yield"
                value="$20,892"
                change={{ value: "$1,340", percentage: "+1.2%", isPositive: true }}
              />
            </div>
            <Card className="mt-6 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">General Statistics</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">Today</Button>
                  <Button size="sm" variant="ghost">Last week</Button>
                  <Button size="sm" variant="ghost">Last month</Button>
                  <Button size="sm" variant="ghost">Last 6 month</Button>
                  <Button size="sm" variant="ghost">Year</Button>
                </div>
              </div>
              <StatsChart />
            </Card>
            <div className="mt-6">
              <LivePricesTable />
              <Button className="mt-4" onClick={() => window.location.href = "https://www.binance.com"}>More</Button>
            </div>
            <div className="mt-6">
              <VaultTable />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}