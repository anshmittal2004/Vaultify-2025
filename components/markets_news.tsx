"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const simulateNews = () => [
  { id: 1, title: `Bitcoin Surges to $85,000 Amid Tariff Pause - ${new Date().toLocaleTimeString()}`, source: "CryptoDaily" },
  { id: 2, title: `Ethereum Gains 3% as DeFi Adoption Rises - ${new Date().toLocaleTimeString()}`, source: "Coinpedia" },
  { id: 3, title: `Binance Coin Hits New High on Exchange Volume - ${new Date().toLocaleTimeString()}`, source: "Bloomberg" },
  { id: 4, title: `Ripple XRP Up 5% on Legal Clarity Hopes - ${new Date().toLocaleTimeString()}`, source: "Investopedia" },
  { id: 5, title: `Cardano ADA Sees Bullish Trend in 2025 - ${new Date().toLocaleTimeString()}`, source: "ZebPay" },
  { id: 6, title: `Solana SOL Outpaces Ethereum in Transactions - ${new Date().toLocaleTimeString()}`, source: "CNBC" },
  { id: 7, title: `Polkadot DOT Integrates New Parachain - ${new Date().toLocaleTimeString()}`, source: "CoinDesk" },
  { id: 8, title: `Dogecoin DOGE Spikes on Social Media Buzz - ${new Date().toLocaleTimeString()}`, source: "Yahoo Finance" },
  { id: 9, title: `Avalanche AVAX Leads Layer-1 Growth - ${new Date().toLocaleTimeString()}`, source: "Business Standard" },
  { id: 10, title: `Shiba Inu SHIB Sees Whale Activity - ${new Date().toLocaleTimeString()}`, source: "LiveMint" },
]

export default function MarketsNews() {
  const [news, setNews] = useState(simulateNews())

  useEffect(() => {
    const interval = setInterval(() => {
      setNews(simulateNews())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Top 10 Crypto Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {news.slice(0, 10).map((item) => (
              <li key={item.id} className="border-b border-gray-700 pb-2">
                <strong>{item.title}</strong> <span className="text-sm text-gray-400">({item.source})</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}