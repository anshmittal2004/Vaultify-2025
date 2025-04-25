"use client"

import { useEffect, useState } from "react"

const coins = [
  "bitcoin", "ethereum", "binancecoin", "ripple", "cardano", "solana", "polkadot", "dogecoin",
  "avalanche-2", "shiba-inu", "polygon", "cosmos", "chainlink", "algorand", "vechain", "tron"
]

export default function LivePrices() {
  const [prices, setPrices] = useState<Record<string, { inr: number; usd: number }>>({})
  const [fluctuations, setFluctuations] = useState<Record<string, { inr: number; usd: number }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = coins.join(",")
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd`
        )
        if (!res.ok) throw new Error("Failed to fetch prices")
        const data = await res.json()
        setPrices(data)

        // Simulate fluctuations with explicit typing
        const newFluctuations: Record<string, { inr: number; usd: number }> = {}
        for (const coin of coins) {
          newFluctuations[coin] = {
            inr: (Math.random() - 0.5) * 100,
            usd: (Math.random() - 0.5) * 10
          }
        }
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
    <div className="p-4 rounded-xl bg-gray-900 text-white space-y-2">
      <h2 className="text-xl font-bold">Live Crypto Prices 2025</h2>
      {prices && Object.keys(prices).length > 0 ? (
        <div className="space-y-2 animate-pulse">
          {coins.map(coin => (
            <div key={coin} className="transition-all duration-500">
              {coin.charAt(0).toUpperCase() + coin.slice(1)}: 
              ₹{(prices[coin]?.inr + (fluctuations[coin]?.inr || 0)).toLocaleString()} / 
              ${(prices[coin]?.usd + (fluctuations[coin]?.usd || 0)).toLocaleString()}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading prices...</p>
      )}
    </div>
  )
}
