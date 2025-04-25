"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { VaultTable } from "@/components/vault-table"
import { BarChart3, ChevronDown, Globe, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import LivePricesTable from "@/components/live_prices-table"
import { useState, useEffect, useRef } from "react"
import { ThemeProvider } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Chart from "chart.js/auto"

// Define initialValues globally with explicit type
const initialValues: Record<string, number> = {
  "Dow Jones": 39142.23,
  "S&P 500": 5282.70,
  "Nasdaq": 16286.45,
  "Nifty 50": 23851.65,
  "Sensex": 78553.20,
  "Nikkei 225": 34730.28,
  "Euro STOXX 50": 2559.15,
  "Hang Seng": 21395.14,
}

const StatsChart = ({ timeRange }: { timeRange: string }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [marketData, setMarketData] = useState<Record<string, number[]>>({
    "Dow Jones": [], "S&P 500": [], "Nasdaq": [], "Nifty 50": [], "Sensex": [],
    "Nikkei 225": [], "Euro STOXX 50": [], "Hang Seng": [],
  })

  const getDataPoints = () => {
    switch (timeRange) {
      case "1H": return 60
      case "24H": return 1440
      case "7D": return 10080
      default: return 1440
    }
  }

  const getUpdateInterval = () => {
    switch (timeRange) {
      case "1H": return 1000
      case "24H": return 60000
      case "7D": return 3600000
      default: return 60000
    }
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
    return color
  }

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Destroy existing chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
      chartInstanceRef.current = null
    }

    // Initialize data
    const newData = Object.keys(initialValues).reduce((acc, market) => {
      acc[market] = Array(getDataPoints()).fill(initialValues[market] ?? 0)
      return acc
    }, {} as Record<string, number[]>)
    setMarketData(newData)

    // Create new chart
    const datasets = Object.entries(initialValues).map(([market, value]) => ({
      label: market,
      data: newData[market] || [],
      borderColor: getRandomColor(),
      fill: false,
      tension: 0.4,
      pointRadius: 0,
    }))

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array(getDataPoints()).fill(""),
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: {
            beginAtZero: false,
            ticks: { callback: (value) => `${Number(value).toLocaleString()}` },
          },
        },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 10, padding: 10 } },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: { label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toLocaleString()}` },
          },
        },
        animation: { duration: 0 },
      },
    })
    chartInstanceRef.current = newChart

    // Update live data
    const interval = setInterval(() => {
      setMarketData((prev) => {
        const updated = { ...prev }
        Object.keys(initialValues).forEach((market: keyof typeof initialValues) => {
          let currentData = updated[market] ?? Array(getDataPoints()).fill(initialValues[market] ?? 0)
          if (!Array.isArray(currentData)) {
            console.warn(`Invalid data for ${market}, resetting`)
            currentData = Array(getDataPoints()).fill(initialValues[market] ?? 0)
          }
          const lastValue = currentData.length > 0 ? Number(currentData[currentData.length - 1]) || (initialValues[market] ?? 0) : (initialValues[market] ?? 0)
          const fluctuation = (Math.random() - 0.5) * 100
          const newValue = Math.max(0, lastValue + fluctuation)
          updated[market] = [...currentData.slice(-getDataPoints() + 1), newValue].slice(-getDataPoints())
        })
        if (chartInstanceRef.current) {
          chartInstanceRef.current.data.datasets.forEach((dataset, index) => {
            const market = Object.keys(initialValues)[index] as keyof typeof initialValues
            dataset.data = updated[market] ?? []
          })
          chartInstanceRef.current.update()
        }
        return updated
      })
    }, getUpdateInterval())

    return () => {
      clearInterval(interval)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [timeRange])

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} />
    </div>
  )
}

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [selectedCurrencies] = useState(["INR", "EUR", "AED", "USD", "GBP"])
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [timeRange, setTimeRange] = useState("24H")
  const [currentTime, setCurrentTime] = useState<string>("")

  const exchangeRates = { INR: 85.42, EUR: 0.95, AED: 3.67, USD: 1.0, GBP: 0.80 }

  const chartRefs = {
    "Dow Jones": useRef<HTMLCanvasElement | null>(null),
    "S&P 500": useRef<HTMLCanvasElement | null>(null),
    "Nasdaq": useRef<HTMLCanvasElement | null>(null),
    "Nifty 50": useRef<HTMLCanvasElement | null>(null),
    "Sensex": useRef<HTMLCanvasElement | null>(null),
    "Nikkei 225": useRef<HTMLCanvasElement | null>(null),
    "Euro STOXX 50": useRef<HTMLCanvasElement | null>(null),
    "Hang Seng": useRef<HTMLCanvasElement | null>(null),
  }

  const [chartInstances, setChartInstances] = useState<Record<string, Chart | null>>({})

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
    return color
  }

  useEffect(() => {
    // Initialize audio with error handling
    const audioInstance = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_5b3b7f1b1e.mp3")
    audioInstance.volume = 0.3
    setAudio(audioInstance)

    // Initialize static data
    setLastUpdated(new Date().toLocaleString())
    setCurrentTime(new Date().toLocaleTimeString())
    setNews([
      `Bitcoin hits $50000 - ${new Date().toLocaleTimeString()}`,
      `Ethereum surges 2% - ${new Date().toLocaleTimeString()}`,
    ])
    setCommodities([
      { name: "Gold", price: 1800, change: 0.5, lastUpdated: new Date().toLocaleTimeString() },
      { name: "Silver", price: 25, change: -0.2, lastUpdated: new Date().toLocaleTimeString() },
    ])

    // Initialize charts
    const newChartInstances: Record<string, Chart | null> = {}
    Object.entries(chartRefs).forEach(([market, ref]) => {
      const ctx = ref.current?.getContext("2d")
      if (ctx && market in initialValues) {
        if (chartInstances[market]) chartInstances[market]?.destroy()
        const newChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: Array(10).fill(""),
            datasets: [{
              label: market,
              data: Array(10).fill(initialValues[market] ?? 0),
              borderColor: getRandomColor(),
              fill: false,
              tension: 0.4,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, ticks: { callback: (value) => `${Number(value).toLocaleString()}` } } },
            plugins: {
              legend: { position: "top", labels: { boxWidth: 10, padding: 10 } },
              tooltip: { mode: "index", intersect: false, callbacks: { label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toLocaleString()}` } },
            },
            animation: { duration: 0 },
          },
        })
        newChartInstances[market] = newChart
      }
    })
    setChartInstances(newChartInstances)

    // Update news
    const newsInterval = setInterval(() => {
      setNews((prev) => [
        `Bitcoin hits $${(Math.random() * 10000 + 50000).toFixed(2)} - ${new Date().toLocaleTimeString()}`,
        `Ethereum surges ${Math.random() * 5}% - ${new Date().toLocaleTimeString()}`,
        ...prev.slice(0, 6),
      ])
      if (soundEnabled && audioInstance) {
        audioInstance.play().catch(() => console.log("Audio play failed"))
      }
    }, 10000)

    // Update commodities
    const commodityInterval = setInterval(() => {
      setCommodities([
        { name: "Gold", price: Math.random() * 50 + 1800, change: (Math.random() - 0.5) * 2, lastUpdated: new Date().toLocaleTimeString() },
        { name: "Silver", price: Math.random() * 2 + 25, change: (Math.random() - 0.5) * 0.5, lastUpdated: new Date().toLocaleTimeString() },
      ])
    }, 15000)

    // Update charts
    const marketInterval = setInterval(() => {
      setChartInstances((prev) => {
        const updated = { ...prev }
        Object.entries(updated).forEach(([market, instance]) => {
          if (instance && market in initialValues) {
            const lastValue = Number(instance.data.datasets[0].data[instance.data.datasets[0].data.length - 1]) || (initialValues[market] ?? 0)
            const fluctuation = (Math.random() - 0.5) * 100
            const newValue = Math.max(0, lastValue + fluctuation)
            instance.data.datasets[0].data.shift()
            instance.data.datasets[0].data.push(newValue)
            instance.update()
          }
        })
        return updated
      })
    }, 5000)

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => {
      clearInterval(newsInterval)
      clearInterval(commodityInterval)
      clearInterval(marketInterval)
      clearInterval(timeInterval)
      Object.values(newChartInstances).forEach((instance) => instance?.destroy())
      if (audioInstance) audioInstance.pause()
    }
  }, [soundEnabled])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleSettings = () => setSettingsOpen(!settingsOpen)
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (audio) {
      if (!soundEnabled) audio.play().catch(() => console.log("Audio play failed"))
      else audio.pause()
    }
  }
  const calculateProfit = () => {
    const amount = parseFloat(profitInput) || 0
    const apy = 0.05
    const profit = amount * apy
    alert(`Estimated Profit for ${profitInput} at 5% APY: $${profit.toFixed(2)}`)
  }

  const handleDashboard = () => { setDashboardChart(!dashboardChart); alert("Dashboard toggled! Showing pie chart data.") }
  const handleStatsIncome = () => { setStatsIncome(!statsIncome); alert("Stats & Income report generated!") }
  const handleMarketTrend = () => { setMarketTrend(!marketTrend); alert("Market trends heatmap updated!") }
  const handleVaultDetails = () => { setVaultDetails(!vaultDetails); alert("Vault details for Bitcoin, USDT, Ethereum loaded!") }
  const handleSupport = () => { setSupportOpen(!supportOpen); alert("Support chat opened! Contact us at support@vaultify.com") }
  const handleMoreNews = () => alert("More Live News coming soon! Check https://coinmarketcap.com/news/ for updates.")
  const handleExploreMore = () => (window.location.href = "https://www.binance.com")

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme={theme}>
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans transition-all duration-500 ${theme === "light" ? "bg-gradient-to-br from-white to-gray-200 text-gray-900" : ""} overflow-x-hidden`}>
        <div className="relative">
          <div className="absolute top-4 left-4 animate-pulse"><Wallet className="h-12 w-12 text-blue-400 transition-transform duration-1000 ease-in-out hover:scale-110" /></div>
        </div>
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 p-4 max-w-7xl mx-auto">
          <aside className="border-r bg-background/50 backdrop-blur h-screen sticky top-0 min-h-[calc(100vh-2rem)]">
            <div className="flex h-16 items-center gap-2 border-b px-6"><span className="font-bold text-2xl">Vaultify 2025</span></div>
            <div className="px-4 py-4"><Input placeholder="Search" className="bg-background/50 w-full" /></div>
            <nav className="space-y-2 px-2 flex-1 overflow-y-auto">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleDashboard}><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleStatsIncome}><BarChart3 className="h-4 w-4" />Stats & Income</Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleMarketTrend}><Globe className="h-4 w-4" />Market Trends</Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleVaultDetails}><Wallet className="h-4 w-4" />Yield Vaults<ChevronDown className="ml-auto h-4 w-4" /></Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={toggleSettings}><Settings className="h-4 w-4" />Settings</Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSupport}><LifeBuoy className="h-4 w-4" />Support</Button>
            </nav>
            {dashboardChart && <div className="p-4 bg-gray-800 rounded">Pie Chart Placeholder</div>}
            {statsIncome && <div className="p-4 bg-gray-800 rounded">Income Report Placeholder</div>}
            {marketTrend && <div className="p-4 bg-gray-800 rounded"><div className="h-32 bg-gradient-to-r from-green-400 to-red-500 rounded animate-pulse" />Market Heatmap</div>}
            {vaultDetails && <div className="p-4 bg-gray-800 rounded">Vault Details: Bitcoin, USDT, Ethereum</div>}
            {supportOpen && <div className="p-4 bg-gray-800 rounded">Support: Contact us at support@vaultify.com</div>}
            {profitInput && <div className="p-4"><Input placeholder="Enter investment amount" value={profitInput} onChange={(e) => setProfitInput(e.target.value)} /><Button className="mt-2 w-full" onClick={calculateProfit}>Calculate Profit</Button></div>}
            {settingsOpen && <div className="p-4 space-y-2"><Button variant="ghost" className="w-full" onClick={toggleTheme}>{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</Button><Button variant="ghost" className="w-full" onClick={toggleSound}>Sound: {soundEnabled ? "On" : "Off"}</Button><Button variant="ghost" className="w-full">Version 2.1.0</Button></div>}
          </aside>
          <main className="p-4 flex-1 overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1"><h1 className="text-3xl font-bold animate-pulse">Vaultify Overview</h1><p className="text-sm text-muted-foreground">Updated: {lastUpdated}</p></div>
              <Button variant="outline" className="gap-2">Ethereum Network<ChevronDown className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricsCard title="Your Balance" value="$74,892" change={{ value: "$1,340", percentage: "-2.1%", isPositive: false }} />
              <MetricsCard title="Your Deposits" value="$54,892" change={{ value: "$1,340", percentage: "+13.2%", isPositive: true }} />
              <MetricsCard title="Accrued Yield" value="$20,892" change={{ value: "$1,340", percentage: "+1.2%", isPositive: true }} />
            </div>
            <Card className="mt-6 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market Pulse</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setTimeRange("1H")}>1H</Button>
                  <Button size="sm" variant="ghost" onClick={() => setTimeRange("24H")}>24H</Button>
                  <Button size="sm" variant="ghost" onClick={() => setTimeRange("7D")}>7D</Button>
                </div>
              </div>
              <StatsChart timeRange={timeRange} />
            </Card>
            <div className="mt-6">
              <div className="mb-4">
                <Select onValueChange={setDefaultCurrency} defaultValue="USD">
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                  <SelectContent>{selectedCurrencies.map((currency) => <SelectItem key={currency} value={currency}>{currency} {currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "AED" ? "د.إ" : currency === "GBP" ? "£" : "$"}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <LivePricesTable className="max-h-[40vh] overflow-y-auto" defaultCurrency={defaultCurrency} />
              <Button className="mt-4 bg-orange-500 text-white hover:scale-105 hover:shadow-lg transition-transform duration-300" onClick={handleExploreMore}>Explore More</Button>
            </div>
            <Card className="mt-6 p-6 min-h-[20rem] max-h-[30rem]">
              <h3 className="text-lg font-semibold mb-2">Live News Dashboard</h3>
              <div className="overflow-hidden h-[18rem] whitespace-nowrap bg-gray-800 rounded-lg"><div className="animate-marquee inline-block text-yellow-300">{news.map((item, index) => <span key={index} className="mx-4 inline-block">{item}</span>)}</div></div>
              <div className="mt-4 text-center"><Button variant="outline" onClick={handleMoreNews} className="text-blue-400 hover:scale-105 hover:shadow-lg transition-transform duration-300">More Live News</Button></div>
            </Card>
            <Card className="mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Market Indices Fluctuations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(chartRefs).map(([market, ref]) => (
                  <div key={market} className="relative w-full h-48">
                    <canvas ref={ref} id={`${market.toLowerCase().replace(" ", "-")}-chart`} />
                    {!chartInstances[market] && <p className="text-red-500">Chart failed to load for {market}.</p>}
                  </div>
                ))}
              </div>
            </Card>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-4 bg-gray-800"><h4 className="text-md font-semibold mb-2">Market Trends Chart</h4><div className="h-32 bg-gradient-to-r from-green-400 to-red-500 rounded animate-pulse" /></Card>
              <Card className="p-4 bg-gray-800"><h4 className="text-md font-semibold mb-2">Latest Headline</h4><p className="text-sm">Crypto market sees volatility spike - {currentTime}</p></Card>
              <Card className="p-4 bg-gray-800"><h4 className="text-md font-semibold mb-2">Market Insight</h4><p className="text-sm">Analysts predict bullish trend - {currentTime}</p></Card>
            </div>
            <Card className="mt-6 p-6 bg-gradient-to-br from-teal-900 to-teal-600 text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Market Updates</h3>
              <ul className="space-y-2">
                <li>Bitcoin network upgrades enhance security - {currentTime}</li>
                <li>Ethereum gas fees drop by 15% - {currentTime}</li>
                <li>Binance launches new staking rewards - {currentTime}</li>
                <li>Ripple XRP gains legal clarity - {currentTime}</li>
                <li>Cardano ADA staking yields increase - {currentTime}</li>
                <li>Solana SOL outperforms in DeFi - {currentTime}</li>
                <li>Polkadot DOT interoperability improves - {currentTime}</li>
                <li>Dogecoin community donates $1M - {currentTime}</li>
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
            <div className="mt-6"><VaultTable /></div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
