"use client"

import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const coins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "ripple", name: "Ripple", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "algorand", name: "Algorand", symbol: "ALGO" },
  { id: "vechain", name: "VeChain", symbol: "VET" },
  { id: "tron", name: "Tron", symbol: "TRX" }
]

const selectedCurrencies = ["INR", "EUR", "AED", "USD", "GBP"]
const exchangeRates = {
  INR: 85.42,
  EUR: 0.95,
  AED: 3.67,
  USD: 1.0,
  GBP: 0.80,
}

export default function LivePricesTable({ className, defaultCurrency }: { className?: string; defaultCurrency?: string }) {
  const [prices, setPrices] = useState<Record<string, { [key: string]: number }>>({})
  const [fluctuations, setFluctuations] = useState<Record<string, { [key: string]: number }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = coins.map(c => c.id).join(",")
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd`
        )
        if (!res.ok) throw new Error("Failed to fetch prices: " + res.statusText)

        const data = await res.json()
        const formattedPrices: Record<string, { [key: string]: number }> = {}

        coins.forEach(coin => {
          const usd = data[coin.id]?.usd || 0
          formattedPrices[coin.id] = {
            INR: data[coin.id]?.inr || 0,
            USD: usd,
            EUR: usd * exchangeRates.EUR,
            AED: usd * exchangeRates.AED,
            GBP: usd * exchangeRates.GBP,
          }
        })

        setPrices(formattedPrices)

        const newFluctuations: Record<string, { [key: string]: number }> = {}
        coins.forEach(coin => {
          newFluctuations[coin.id] = {
            INR: (Math.random() - 0.5) * 100,
            USD: (Math.random() - 0.5) * 10,
            EUR: (Math.random() - 0.5) * 10 * exchangeRates.EUR,
            AED: (Math.random() - 0.5) * 10 * exchangeRates.AED,
            GBP: (Math.random() - 0.5) * 10 * exchangeRates.GBP,
          }
        })

        setFluctuations(newFluctuations)
        setError(null)
      } catch (error) {
        setError("Error fetching prices: " + (error as Error).message)
        console.error("API Error:", error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className={`p-4 rounded-xl bg-gray-900 text-white ${className}`}>
      <h2 className="text-xl font-bold mb-4">Live Crypto Prices 2025</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vault</TableHead>
            <TableHead>Daily</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>APY</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Liquidity</TableHead>
            <TableHead>Price ({defaultCurrency || "USD"})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map(coin => (
            <TableRow key={coin.id}>
              <TableCell className="py-6 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img src={`/placeholder.svg?height=24&width=24`} alt={coin.name} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {defaultCurrency && prices[coin.id]?.[defaultCurrency]
                        ? `${(prices[coin.id]?.[defaultCurrency] || 0).toLocaleString()} ${
                            defaultCurrency === "INR" ? "₹" :
                            defaultCurrency === "EUR" ? "€" :
                            defaultCurrency === "AED" ? "د.إ" :
                            defaultCurrency === "GBP" ? "£" : "$"
                          }`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-6 px-4">{`+$${Math.random() * 1000}`}</TableCell>
              <TableCell className="py-6 px-4">{`$${Math.random() * 10000}`}</TableCell>
              <TableCell className="py-6 px-4">{`${(Math.random() * 10).toFixed(2)}%`}</TableCell>
              <TableCell className="py-6 px-4">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-500/10 text-green-500">
                  Flexible
                </span>
              </TableCell>
              <TableCell className="py-6 px-4">{new Date().toLocaleDateString()}</TableCell>
              <TableCell className="py-6 px-4">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`h-1.5 w-3 rounded-full ${i < 2 ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>
              </TableCell>
              <TableCell className="py-6 px-4">
                {defaultCurrency && prices[coin.id]?.[defaultCurrency]
                  ? `${(prices[coin.id]?.[defaultCurrency] || 0).toLocaleString()} ${
                      defaultCurrency === "INR" ? "₹" :
                      defaultCurrency === "EUR" ? "€" :
                      defaultCurrency === "AED" ? "د.إ" :
                      defaultCurrency === "GBP" ? "£" : "$"
                    }`
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
