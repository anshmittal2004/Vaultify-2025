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
  { id: "tron", name: "Tron", symbol: "TRX" },
  // Popular coins added below
  { id: "litecoin", name: "Litecoin", symbol: "LTC" }, // Litecoin
  { id: "uniswap", name: "Uniswap", symbol: "UNI" }, // Uniswap
  { id: "binance-usd", name: "Binance USD", symbol: "BUSD" }, // Binance USD
  { id: "stellar", name: "Stellar", symbol: "XLM" }, // Stellar
  { id: "wrapped-bitcoin", name: "Wrapped Bitcoin", symbol: "WBTC" }, // Wrapped Bitcoin
  { id: "tezos", name: "Tezos", symbol: "XTZ" }, // Tezos
];

export default function LivePricesTable() {
  const [prices, setPrices] = useState<Record<string, { inr: number; usd: number }>>({})
  const [fluctuations, setFluctuations] = useState<Record<string, { inr: number; usd: number }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = coins.map(c => c.id).join(",")
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd`
        )
        if (!res.ok) throw new Error("Failed to fetch prices")
        const data = await res.json()
        setPrices(data)

        // Simulate fluctuations with explicit typing
        const newFluctuations: Record<string, { inr: number; usd: number }> = {}
        coins.forEach(coin => {
          newFluctuations[coin.id] = {
            inr: (Math.random() - 0.5) * 100,
            usd: (Math.random() - 0.5) * 10
          }
        })
        setFluctuations(newFluctuations)
        setError(null)
      } catch (error) {
        setError("Error fetching prices: " + (error as Error).message)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4 rounded-xl bg-gray-900 text-white">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map(coin => (
            <TableRow key={coin.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img src={`https://cryptologos.cc/logos/${coin.symbol.toLowerCase()}-logo.png`} alt={coin.name} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{(prices[coin.id]?.inr + (fluctuations[coin.id]?.inr || 0)).toLocaleString()} / ${(prices[coin.id]?.usd + (fluctuations[coin.id]?.usd || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{`+$${Math.random() * 1000}`}</TableCell>
              <TableCell>{`$${Math.random() * 10000}`}</TableCell>
              <TableCell>{`${(Math.random() * 10).toFixed(2)}%`}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-500/10 text-green-500">
                  Flexible
                </span>
              </TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`h-1.5 w-3 rounded-full ${i < 2 ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
