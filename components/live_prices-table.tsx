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
const exchangeRates: Record<string, number> = {
  INR: 85.42,
  EUR: 0.95,
  AED: 3.67,
  USD: 1.0,
  GBP: 0.80,
}

interface LivePricesTableProps {
  className?: string;
  defaultCurrency?: string;
}

export default function LivePricesTable({ className, defaultCurrency = "USD" }: LivePricesTableProps) {
  const [prices, setPrices] = useState<Record<string, { [key: string]: number }>>({})
  const [fluctuations, setFluctuations] = useState<Record<string, { [key: string]: number }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateMockPrices = () => {
      try {
        const formattedPrices: Record<string, { [key: string]: number }> = {}

        coins.forEach(coin => {
          // Generate a base USD price based on coin
          let baseUsd = 0
          switch(coin.id) {
            case "bitcoin":
              baseUsd = Math.random() * 1000 + 60000
              break
            case "ethereum":
              baseUsd = Math.random() * 500 + 3500
              break
            case "binancecoin":
              baseUsd = Math.random() * 50 + 300
              break
            default:
              // Random price based on coin name length as a simple deterministic factor
              baseUsd = Math.random() * 100 + (coin.name.length * 10)
          }

          formattedPrices[coin.id] = {
            USD: baseUsd,
            INR: baseUsd * exchangeRates.INR,
            EUR: baseUsd * exchangeRates.EUR,
            AED: baseUsd * exchangeRates.AED,
            GBP: baseUsd * exchangeRates.GBP,
          }
        })

        setPrices(formattedPrices)

        const newFluctuations: Record<string, { [key: string]: number }> = {}
        coins.forEach(coin => {
          const baseFluctuation = (Math.random() - 0.5) * 10 // Between -5% and +5%
          newFluctuations[coin.id] = {
            USD: baseFluctuation,
            INR: baseFluctuation,
            EUR: baseFluctuation,
            AED: baseFluctuation,
            GBP: baseFluctuation,
          }
        })

        setFluctuations(newFluctuations)
        setError(null)
      } catch (error) {
        setError("Error generating mock prices: " + (error as Error).message)
        console.error("Error:", error)
      }
    }

    // Generate prices immediately and then every 10 seconds
    generateMockPrices()
    const interval = setInterval(generateMockPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  if (error) return <div className="p-4 text-red-500">{error}</div>

  const getCurrencySymbol = (currency: string) => {
    switch(currency) {
      case "INR": return "₹"
      case "EUR": return "€"
      case "AED": return "د.إ"
      case "GBP": return "£"
      default: return "$"
    }
  }

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
            <TableHead>Price ({defaultCurrency})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map(coin => (
            <TableRow key={coin.id}>
              <TableCell className="py-6 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img src={`/api/placeholder/24/24`} alt={coin.name} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {prices[coin.id]?.[defaultCurrency]
                        ? `${(prices[coin.id]?.[defaultCurrency] || 0).toLocaleString(undefined, {maximumFractionDigits: 2})} ${getCurrencySymbol(defaultCurrency)}`
                        : "Loading..."}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-6 px-4">{`+$${(Math.random() * 1000).toFixed(2)}`}</TableCell>
              <TableCell className="py-6 px-4">{`$${(Math.random() * 10000).toFixed(2)}`}</TableCell>
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
                {prices[coin.id]?.[defaultCurrency]
                  ? `${(prices[coin.id]?.[defaultCurrency] || 0).toLocaleString(undefined, {maximumFractionDigits: 2})} ${getCurrencySymbol(defaultCurrency)}`
                  : "Loading..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
