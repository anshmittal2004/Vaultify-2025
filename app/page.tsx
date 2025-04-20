"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { VaultTable } from "@/components/vault-table"
import { BarChart3, ChevronDown, Globe, Home, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import LivePricesTable from "@/components/live_prices-table"
import { useState, useEffect, useRef } from "react"
import { ThemeProvider } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Chart from "chart.js/auto"

const StatsChart = ({ timeRange }: { timeRange: string }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const [chartInstance, setChartInstance] = useState<Chart | null>(null)
  const [marketData, setMarketData] = useState<Record<string, number[]>>({
    "Dow Jones": [],
    "S&P 500": [],
    "Nasdaq": [],
    "Nifty 50": [],
    "Sensex": [],
    "Nikkei 225": [],
    "Japan Market": [],
    "Hang Seng": [],
  })

  const initialValues = {
    "Dow Jones": 39142.23,
    "S&P 500": 5282.70,
    "Nasdaq": 16286.45,
    "Nifty 50": 23851.65,
    "Sensex": 78553.20,
    "Nikkei 225": 34730.28,
    "Japan Market": 2559.15,
    "Hang Seng": 21395.14,
  }

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d")
    if (!ctx || chartInstance) return

    const datasets = Object.entries(initialValues).map(([market, value]) => ({
      label: market,
      data: Array(getDataPoints()).fill(value),
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
            ticks: { 
              callback: (value) => `${typeof value === 'number' ? value.toLocaleString() : '0'}` 
            },
          },
        },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 10, padding: 10 } },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: { 
              label: (context) => `${context.dataset.label}: $${typeof context.parsed.y === 'number' ? context.parsed.y.toLocaleString() : '0'}` 
            },
          },
        },
        animation: { duration: 0 },
      },
    })
    setChartInstance(newChart)
    initializeData()

    const interval = setInterval(() => updateLiveData(), getUpdateInterval())
    return () => {
      clearInterval(interval)
      if (newChart) newChart.destroy()
    }
  }, [timeRange])

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

  const initializeData = () => {
    setMarketData((prev) => {
      const newData = { ...prev }
      Object.keys(initialValues).forEach((market) => {
        newData[market] = Array(getDataPoints()).fill(initialValues[market as keyof typeof initialValues])
      })
      return newData
    })
  }

  const updateLiveData = () => {
    setMarketData((prev) => {
      const newData = { ...prev }
      Object.keys(initialValues).forEach((market) => {
        const currentData = newData[market] || Array(getDataPoints()).fill(initialValues[market as keyof typeof initialValues])
        const lastValue = currentData[currentData.length - 1] || initialValues[market as keyof typeof initialValues]
        const fluctuation = (Math.random() - 0.5) * 100
        const newValue = Math.max(0, lastValue + fluctuation)
        newData[market] = [...currentData.slice(-getDataPoints() + 1), newValue].slice(-getDataPoints())
      })
      if (chartInstance) {
        chartInstance.data.datasets.forEach((dataset, index) => {
          const market = Object.keys(initialValues)[index]
          dataset.data = newData[market] || []
        })
        chartInstance.update()
      }
      return newData
    })
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

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

  const dowJonesRef = useRef<HTMLCanvasElement | null>(null)
  const sp500Ref = useRef<HTMLCanvasElement | null>(null)
  const nasdaqRef = useRef<HTMLCanvasElement | null>(null)
  const nifty50Ref = useRef<HTMLCanvasElement | null>(null)
  const sensexRef = useRef<HTMLCanvasElement | null>(null)
  const nikkei225Ref = useRef<HTMLCanvasElement | null>(null)
  const japanMarketRef = useRef<HTMLCanvasElement | null>(null)
  const hangSengRef = useRef<HTMLCanvasElement | null>(null)

  const [chartInstances, setChartInstances] = useState<Record<string, Chart | null>>({})
  const [isChartsInitialized, setIsChartsInitialized] = useState(false)

  useEffect(() => {
    const audioInstance = new Audio("https://www.soundjay.com/buttons/button-1a.mp3")
    audioInstance.volume = 0.3
    setAudio(audioInstance)

    setLastUpdated(new Date().toLocaleString())
    setCurrentTime(new Date().toLocaleTimeString()) // Initialize client-side time

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
      ].sort(() => Math.random() - 0.5)
      setNews(newNews)
      if (soundEnabled && audioInstance) audioInstance.play().catch((err) => console.error("Audio play failed:", err))
    }
    fetchNews()
    const newsInterval = setInterval(fetchNews, 10000)

    const fetchCommodities = () => {
      const newCommodities = [
        { name: "Gold", price: Math.random() * 50 + 1800, change: (Math.random() - 0.5) * 2, lastUpdated: new Date().toLocaleTimeString() },
        { name: "Silver", price: Math.random() * 2 + 25, change: (Math.random() - 0.5) * 0.5, lastUpdated: new Date().toLocaleTimeString() },
      ]
      setCommodities(newCommodities)
    }
    fetchCommodities()
    const commodityInterval = setInterval(fetchCommodities, 15000)

    const initializeCharts = () => {
      const refs = { 
        "Dow Jones": dowJonesRef, 
        "S&P 500": sp500Ref, 
        "Nasdaq": nasdaqRef, 
        "Nifty 50": nifty50Ref, 
        "Sensex": sensexRef, 
        "Nikkei 225": nikkei225Ref, 
        "Japan Market": japanMarketRef, 
        "Hang Seng": hangSengRef 
      }
      
      if (!isChartsInitialized) {
        Object.entries(refs).forEach(([market, ref]) => {
          const ctx = ref.current?.getContext("2d")
          if (ctx) {
            if (chartInstances[market]) chartInstances[market]?.destroy()
            const newChart = new Chart(ctx, {
              type: "line",
              data: { 
                labels: Array(10).fill(""), 
                datasets: [{ 
                  label: market, 
                  data: Array(10).fill(0), 
                  borderColor: getRandomColor(), 
                  fill: false, 
                  tension: 0.4, 
                  pointRadius: 0 
                }] 
              },
              options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                  y: { 
                    beginAtZero: false, 
                    ticks: { 
                      callback: (value) => {
                        if (typeof value === 'number') {
                          return value.toLocaleString();
                        }
                        return '0';
                      }
                    }
                  } 
                }, 
                plugins: { 
                  legend: { 
                    position: "top", 
                    labels: { 
                      boxWidth: 10, 
                      padding: 10 
                    } 
                  }, 
                  tooltip: { 
                    mode: "index", 
                    intersect: false, 
                    callbacks: { 
                      label: (context) => {
                        if (typeof context.parsed.y === 'number') {
                          return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                        return `${context.dataset.label}: $0`;
                      }
                    } 
                  } 
                }, 
                animation: { duration: 0 } 
              },
            })
            setChartInstances((prev) => ({ ...prev, [market]: newChart }))
          }
        })
        setIsChartsInitialized(true)
      }
    }
    initializeCharts()

    const marketInterval = setInterval(() => {
      setChartInstances((prev) => {
        const updated = { ...prev }
        Object.entries(updated).forEach(([market, instance]) => {
          if (instance) {
            const data = instance.data.datasets[0].data;
            const lastValue = typeof data[data.length - 1] === 'number' ? data[data.length - 1] as number : 0;
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

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000) // Update time every second

    return () => {
      clearInterval(newsInterval)
      clearInterval(commodityInterval)
      clearInterval(marketInterval)
      clearInterval(timeInterval)
      Object.values(chartInstances).forEach((instance) => instance?.destroy())
      if (audioInstance) audioInstance.pause()
    }
  }, [soundEnabled])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleSettings = () => setSettingsOpen(!settingsOpen)
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (audio) {
      if (!soundEnabled) audio.play().catch((err) => console.error("Audio play failed:", err))
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

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
    return color
  }

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
              <div className="overflow-hidden h-[18rem] whitespace-nowrap bg-gray-800 rounded-lg">
                <div className="animate-marquee inline-block text-yellow-300">
                  {news.map((item, index) => <span key={index} className="mx-4 inline-block">{item}</span>)}
                </div>
              </div>
              <div className="mt-4 text-center"><Button variant="outline" onClick={handleMoreNews} className="text-blue-400 hover:scale-105 hover:shadow-lg transition-transform duration-300">More Live News</Button></div>
            </Card>
            <Card className="mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Market Indices Fluctuations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative w-full h-48"><canvas ref={dowJonesRef} id="dow-jones-chart" />{!chartInstances["Dow Jones"] && <p className="text-red-500">Chart failed to load for Dow Jones.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={sp500Ref} id="sp500-chart" />{!chartInstances["S&P 500"] && <p className="text-red-500">Chart failed to load for S&P 500.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={nasdaqRef} id="nasdaq-chart" />{!chartInstances["Nasdaq"] && <p className="text-red-500">Chart failed to load for Nasdaq.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={nifty50Ref} id="nifty50-chart" />{!chartInstances["Nifty 50"] && <p className="text-red-500">Chart failed to load for Nifty 50.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={sensexRef} id="sensex-chart" />{!chartInstances["Sensex"] && <p className="text-red-500">Chart failed to load for Sensex.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={nikkei225Ref} id="nikkei225-chart" />{!chartInstances["Nikkei 225"] && <p className="text-red-500">Chart failed to load for Nikkei 225.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={japanMarketRef} id="japan-market-chart" />{!chartInstances["Japan Market"] && <p className="text-red-500">Chart failed to load for Japan Market.</p>}</div>
                <div className="relative w-full h-48"><canvas ref={hangSengRef} id="hang-seng-chart" />{!chartInstances["Hang Seng"] && <p className="text-red-500">Chart failed to load for Hang Seng.</p>}</div>
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
