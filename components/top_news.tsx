"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const simulateNews = () => [
  { id: 1, title: `Bitcoin Hits $85,500 in Early Trading - ${new Date().toLocaleTimeString()}`, source: "CryptoDaily" },
  { id: 2, title: `Ethereum ETF Approval Rumors Boost Price - ${new Date().toLocaleTimeString()}`, source: "Coinpedia" },
  { id: 3, title: `Binance Faces Regulatory Scrutiny - ${new Date().toLocaleTimeString()}`, source: "Bloomberg" },
  { id: 4, title: `XRP Ledger Upgrades Enhance Speed - ${new Date().toLocaleTimeString()}`, source: "Investopedia" },
  { id: 5, title: `Cardano’s New Staking Protocol Live - ${new Date().toLocaleTimeString()}`, source: "ZebPay" },
  { id: 6, title: `Solana Network Handles 10K TPS - ${new Date().toLocaleTimeString()}`, source: "CNBC" },
  { id: 7, title: `Polkadot’s Cross-Chain Success - ${new Date().toLocaleTimeString()}`, source: "CoinDesk" },
  { id: 8, title: `Dogecoin Community Donates $1M - ${new Date().toLocaleTimeString()}`, source: "Yahoo Finance" },
  { id: 9, title: `Avalanche Subnet Launch Imminent - ${new Date().toLocaleTimeString()}`, source: "Business Standard" },
  { id: 10, title: `Shiba Inu Burns 100B Tokens - ${new Date().toLocaleTimeString()}`, source: "LiveMint" },
]

export default function TopNews() {
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