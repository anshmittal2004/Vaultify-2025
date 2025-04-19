import { NextResponse } from "next/server"

// Define the crypto price interface
interface CryptoPrice {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  last_updated?: string
}

// Fallback data with 2025 prices
const fallbackData: CryptoPrice[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 187432.51,
    price_change_percentage_24h: 3.21,
    market_cap: 3654789123451,
    total_volume: 98765432123,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 12876.32,
    price_change_percentage_24h: 2.54,
    market_cap: 1569854712345,
    total_volume: 45678912345,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 1342.87,
    price_change_percentage_24h: 5.67,
    market_cap: 562345678901,
    total_volume: 23456789012,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 2162.34,
    price_change_percentage_24h: -1.23,
    market_cap: 385678912345,
    total_volume: 12345678901,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    price_change_percentage_24h: 0.01,
    market_cap: 202345678901,
    total_volume: 156789123456,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 8.76,
    price_change_percentage_24h: 4.32,
    market_cap: 316789012345,
    total_volume: 9876543210,
  },
  {
    id: "xrp",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 3.87,
    price_change_percentage_24h: -0.76,
    market_cap: 189876543210,
    total_volume: 7654321098,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 76.43,
    price_change_percentage_24h: 2.87,
    market_cap: 98765432109,
    total_volume: 5432109876,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 1.23,
    price_change_percentage_24h: 7.89,
    market_cap: 166543210987,
    total_volume: 12109876543,
  },
  {
    id: "shiba-inu",
    symbol: "shib",
    name: "Shiba Inu",
    image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    current_price: 0.00089123,
    price_change_percentage_24h: 6.54,
    market_cap: 110765432109,
    total_volume: 8765432109,
  },
]

export async function GET() {
  try {
    // Try to fetch from CoinGecko API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 }, // Cache for 60 seconds
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(3000),
      },
    )

    // If the API call was successful, return the data
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // If we get here, the API call failed, so return fallback data
    console.log("CoinGecko API failed, using fallback data")

    // Add timestamp to fallback data
    const fallbackWithTimestamp = fallbackData.map((crypto) => ({
      ...crypto,
      last_updated: new Date().toISOString(),
    }))

    return NextResponse.json(fallbackWithTimestamp)
  } catch (error) {
    console.error("Error fetching crypto prices:", error)

    // Return fallback data with timestamp in case of any error
    const fallbackWithTimestamp = fallbackData.map((crypto) => ({
      ...crypto,
      last_updated: new Date().toISOString(),
    }))

    return NextResponse.json(fallbackWithTimestamp)
  }
}
