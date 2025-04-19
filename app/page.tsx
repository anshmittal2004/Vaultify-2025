"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { VaultTable } from "@/components/vault-table"
import { BarChart3, ChevronDown, Globe, Home, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import LivePricesTable from "@/components/live_prices-table"
import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dashboardChart, setDashboardChart] = useState(false)
  const [statsIncome, setStatsIncome] = useState(false)
  const [marketTrend, setMarketTrend] = useState(false)
  const [vaultDetails, setVaultDetails] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [profitInput, setProfitInput] = useState("")
  const [news, setNews] = useState<string[]>([])
  const [commodities, setCommodities] = useState<{ name: string; price: number; change: number; lastUpdated: string }[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audio] = useState(new Audio("https://www.soundjay.com/buttons/button-1a.mp3")) // Soft touch sound
  const [selectedCurrencies] = useState(["INR", "EUR", "AED", "USD", "GBP"])
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const exchangeRates = {
    INR: 85.42, // Approx USD to INR rate
    EUR: 0.95,  // Approx USD to EUR rate
    AED: 3.67,  // Approx USD to AED rate
    USD: 1.0,   // Base currency
    GBP: 0.80,  // Approx USD to GBP rate
  }

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleSettings = () => setSettingsOpen(!settingsOpen)
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) audio.play().catch(() => {})
    else audio.pause()
  }
  const calculateProfit = () => {
    const amount = parseFloat(profitInput) || 0
    const apy = 0.05
    const profit = amount * apy
    alert(`Estimated Profit for ${profitInput} at 5% APY: $${profit.toFixed(2)}`)
  }

  useEffect(() => {
    const fetchNews = () => {
      const newNews = [
        `Bitcoin hits $${(Math.random() * 10000 + 50000).toFixed(2)} - ${new Date().toLocaleTimeString()}`,
        `Ethereum surges ${Math.random() * 5}% - ${new Date().toLocaleTimeString()}`,
        `Binance Coin up on volume - ${new Date().toLocaleTimeString()}`,
        `Ripple sees ${Math.random() * 3}% dip - ${new Date().toLocaleTimeString()}`,
        `Cardano announces new upgrade - ${new Date().toLocaleTimeString()}`,
        `Solana network hits record TPS - ${new Date().toLocaleTimeString()}`,
        `Polkadot parachain auction ends - ${new Date().toLocaleTimeString()}`,
        `Dogecoin pumps after tweet - ${new Date().toLocaleTimeString()}`,
        `Avalanche ecosystem grows 10% - ${new Date().toLocaleTimeString()}`,
        `Shiba Inu burns ${Math.random() * 100}M tokens - ${new Date().toLocaleTimeString()}`,
        `Polygon zkEVM live on mainnet - ${new Date().toLocaleTimeString()}`,
        `Cosmos IBC volume spikes - ${new Date().toLocaleTimeString()}`,
        `Chainlink price oracle updated - ${new Date().toLocaleTimeString()}`,
        `Algorand governance vote underway - ${new Date().toLocaleTimeString()}`,
        `VeChain supply chain deal signed - ${new Date().toLocaleTimeString()}`,
        `Tron TRX hits new ATH - ${new Date().toLocaleTimeString()}`,
      ].sort(() => Math.random() - 0.5)
      setNews(newNews)
      if (soundEnabled) audio.play().catch(() => {}) // Play touch sound on update
    }
    fetchNews()
    const interval = setInterval(fetchNews, 10000)
    audio.volume = 0.3 // Moderate volume for touch sound

    const fetchCommodities = () => {
      const newCommodities = [
        {
          name: "Gold",
          price: Math.random() * 50 + 1800, // Random base price in USD per ounce
          change: (Math.random() - 0.5) * 2,
          lastUpdated: new Date().toLocaleTimeString(),
        },
        {
          name: "Silver",
          price: Math.random() * 2 + 25, // Random base price in USD per ounce
          change: (Math.random() - 0.5) * 0.5,
          lastUpdated: new Date().toLocaleTimeString(),
        },
      ]
      setCommodities(newCommodities)
    }
    fetchCommodities()
    const commodityInterval = setInterval(fetchCommodities, 15000) // Update every 15 seconds
    return () => {
      clearInterval(interval)
      clearInterval(commodityInterval)
    }
  }, [audio, soundEnabled])

  // Dashboard functionality
  const handleDashboard = () => {
    setDashboardChart(!dashboardChart)
    alert("Dashboard toggled! Showing pie chart data.")
  }

  // Stats & Income functionality
  const handleStatsIncome = () => {
    setStatsIncome(!statsIncome)
    alert("Stats & Income report generated!")
  }

  // Market Trends functionality
  const handleMarketTrend = () => {
    setMarketTrend(!marketTrend)
    alert("Market trends heatmap updated!")
  }

  // Yield Vaults functionality
  const handleVaultDetails = () => {
    setVaultDetails(!vaultDetails)
    alert("Vault details for Bitcoin, USDT, Ethereum loaded!")
  }

  // Support functionality
  const handleSupport = () => {
    setSupportOpen(!supportOpen)
    alert("Support chat opened! Contact us at support@vaultify.com")
  }

  const handleMoreNews = () => {
    alert("More Live News coming soon! Check https://coinmarketcap.com/news/ for updates.")
  }

  const handleExploreMore = () => {
    window.location.href = "https://www.binance.com"
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme={theme}>
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans transition-all duration-500 ${theme === "light" ? "bg-gradient-to-br from-white to-gray-200 text-gray-900" : ""} overflow-x-hidden`}>
        <div className="relative">
          <div className="absolute top-4 left-4 animate-pulse">
            <Wallet className="h-12 w-12 text-blue-400 transition-transform duration-1000 ease-in-out hover:scale-110" />
          </div>
        </div>
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 p-4 max-w-7xl mx-auto">
          <aside className="border-r bg-background/50 backdrop-blur h-screen sticky top-0 min-h-[calc(100vh-2rem)]">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <span className="font-bold text-2xl">Vaultify 2025</span>
            </div>
            <div className="px-4 py-4">
              <Input placeholder="Search" className="bg-background/50 w-full" />
            </div>
            <nav className="space-y-2 px-2 flex-1 overflow-y-auto">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleDashboard}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleStatsIncome}>
                <BarChart3 className="h-4 w-4" />
                Stats & Income
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleMarketTrend}>
                <Globe className="h-4 w-4" />
                Market Trends
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleVaultDetails}>
                <Wallet className="h-4 w-4" />
                Yield Vaults
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={toggleSettings}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSupport}>
                <LifeBuoy className="h-4 w-4" />
                Support
              </Button>
            </nav>
            {dashboardChart && <div className="p-4 bg-gray-800 rounded">Pie Chart Placeholder</div>}
            {statsIncome && <div className="p-4 bg-gray-800 rounded">Income Report Placeholder</div>}
            {marketTrend && (
              <div className="p-4 bg-gray-800 rounded">
                <div className="h-32 bg-gradient-to-r from-green-400 to-red-500 rounded animate-pulse" />
                Market Heatmap
              </div>
            )}
            {vaultDetails && (
              <div className="p-4 bg-gray-800 rounded">Vault Details: Bitcoin, USDT, Ethereum</div>
            )}
            {supportOpen && (
              <div className="p-4 bg-gray-800 rounded">
                Support: Contact us at support@vaultify.com
              </div>
            )}
            {profitInput && (
              <div className="p-4">
                <Input placeholder="Enter investment amount" value={profitInput} onChange={(e) => setProfitInput(e.target.value)} />
                <Button className="mt-2 w-full" onClick={calculateProfit}>Calculate Profit</Button>
              </div>
            )}
            {settingsOpen && (
              <div className="p-4 space-y-2">
                <Button variant="ghost" className="w-full" onClick={toggleTheme}>
                  {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={toggleSound}>
                  Sound: {soundEnabled ? "On" : "Off"}
                </Button>
                <Button variant="ghost" className="w-full">Version 2.1.0</Button>
              </div>
            )}
          </aside>
          <main className="p-4 flex-1 overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold animate-pulse">Vaultify Overview</h1>
                <p className="text-sm text-muted-foreground">Updated: {new Date().toLocaleString()}</p>
              </div>
              <Button variant="outline" className="gap-2">
                Ethereum Network
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
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
                <h2 className="text-lg font-semibold">Market Pulse</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">1H</Button>
                  <Button size="sm" variant="ghost">24H</Button>
                  <Button size="sm" variant="ghost">7D</Button>
                </div>
              </div>
              <StatsChart />
            </Card>
            <div className="mt-6">
              <div className="mb-4">
                <Select onValueChange={setDefaultCurrency} defaultValue="USD">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency} {currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "AED" ? "د.إ" : currency === "GBP" ? "£" : "$"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <LivePricesTable className="max-h-[40vh] overflow-y-auto" defaultCurrency={defaultCurrency} />
              <Button
                className="mt-4 bg-orange-500 text-white hover:scale-105 hover:shadow-lg transition-transform duration-300"
                onClick={handleExploreMore}
              >
                Explore More
              </Button>
            </div>
            <Card className="mt-6 p-6 min-h-[20rem] max-h-[30rem]">
              <h3 className="text-lg font-semibold mb-2">Live News Dashboard</h3>
              <div className="overflow-hidden h-[18rem] whitespace-nowrap bg-gray-800 rounded-lg">
                <div className="animate-marquee inline-block text-yellow-300">
                  {news.map((item, index) => (
                    <span key={index} className="mx-4 inline-block">{item}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={handleMoreNews}
                  className="text-blue-400 hover:scale-105 hover:shadow-lg transition-transform duration-300"
                >
                  More Live News
                </Button>
              </div>
            </Card>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <Card className="p-4 bg-gray-800">
                <h4 className="text-md font-semibold mb-2">Market Trends Chart</h4>
                <div className="h-32 bg-gradient-to-r from-green-400 to-red-500 rounded animate-pulse" />
              </Card>
              {/* News Tiles */}
              <Card className="p-4 bg-gray-800">
                <h4 className="text-md font-semibold mb-2">Latest Headline</h4>
                <p className="text-sm">Crypto market sees volatility spike - {new Date().toLocaleTimeString()}</p>
              </Card>
              <Card className="p-4 bg-gray-800">
                <h4 className="text-md font-semibold mb-2">Market Insight</h4>
                <p className="text-sm">Analysts predict bullish trend - {new Date().toLocaleTimeString()}</p>
              </Card>
            </div>
            <Card className="mt-6 p-6 bg-gradient-to-br from-teal-900 to-teal-600 text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Market Updates</h3>
              <ul className="space-y-2">
                <li>Bitcoin network upgrades enhance security - {new Date().toLocaleTimeString()}</li>
                <li>Ethereum gas fees drop by 15% - {new Date().toLocaleTimeString()}</li>
                <li>Binance launches new staking rewards - {new Date().toLocaleTimeString()}</li>
                <li>Ripple XRP gains legal clarity - {new Date().toLocaleTimeString()}</li>
                <li>Cardano ADA staking yields increase - {new Date().toLocaleTimeString()}</li>
                <li>Solana SOL outperforms in DeFi - {new Date().toLocaleTimeString()}</li>
                <li>Polkadot DOT interoperability improves - {new Date().toLocaleTimeString()}</li>
                <li>Dogecoin community donates $1M - {new Date().toLocaleTimeString()}</li>
              </ul>
            </Card>
            <Card className="mt-6 p-6 bg-gray-800">
              <h3 className="text-lg font-semibold mb-4">Live Commodities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commodities.map((commodity) => (
                  <div key={commodity.name} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-md font-semibold">{commodity.name}</h4>
                    <p>Last Updated: {commodity.lastUpdated}</p>
                    {selectedCurrencies.map((currency) => (
                      <div key={`${commodity.name}-${currency}`} className="text-sm">
                        {currency}: {((commodity.price * (exchangeRates[currency as keyof typeof exchangeRates] || 1)).toFixed(2))} {currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "AED" ? "د.إ" : currency === "GBP" ? "£" : "$"}
                      </div>
                    ))}
                    <p className={`text-sm ${commodity.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      Change: {commodity.change >= 0 ? "+" : ""}{commodity.change.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <div className="mt-6">
              <VaultTable />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
