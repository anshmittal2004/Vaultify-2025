// components/live_prices-table.tsx
"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define types for better type safety
type Cryptocurrency = {
  name: string;
  price: number;
  change: number;
  marketCap: number;
  weekHigh52: number;
}

type SupportedCurrency = "INR" | "EUR" | "AED" | "USD" | "GBP";

// Exchange rates and currency symbols defined outside component
const exchangeRates = {
  INR: 85.42,
  EUR: 0.95,
  AED: 3.67,
  USD: 1.0,
  GBP: 0.80,
};

const currencySymbols = {
  INR: "₹",
  EUR: "€",
  AED: "د.إ",
  GBP: "£",
  USD: "$"
};

export default function LivePricesTable({ 
  defaultCurrency, 
  className 
}: { 
  defaultCurrency: string; 
  className?: string 
}) {
  const [prices, setPrices] = useState<Cryptocurrency[]>([]);

  useEffect(() => {
    // Initialize with 15 cryptocurrencies on client side
    const initialPrices = [
      { name: "Bitcoin", price: 5125200, change: 1.38, marketCap: 1000000000000, weekHigh52: 6000000 },
      { name: "Ethereum", price: 256260, change: 0.86, marketCap: 300000000000, weekHigh52: 300000 },
      { name: "Binance Coin", price: 42710, change: -2.11, marketCap: 80000000000, weekHigh52: 50000 },
      { name: "Ripple", price: 4530, change: 0.45, marketCap: 50000000000, weekHigh52: 6000 },
      { name: "Cardano", price: 345, change: -1.23, marketCap: 20000000000, weekHigh52: 500 },
      { name: "Solana", price: 12500, change: 2.10, marketCap: 60000000000, weekHigh52: 15000 },
      { name: "Polkadot", price: 480, change: -0.89, marketCap: 7000000000, weekHigh52: 600 },
      { name: "Dogecoin", price: 12.5, change: 3.15, marketCap: 18000000000, weekHigh52: 15 },
      { name: "Avalanche", price: 2300, change: 1.67, marketCap: 10000000000, weekHigh52: 2500 },
      { name: "Shiba Inu", price: 0.000017, change: -0.50, marketCap: 10000000000, weekHigh52: 0.000020 },
      { name: "Polygon", price: 45, change: 0.92, marketCap: 5000000000, weekHigh52: 60 },
      { name: "Cosmos", price: 520, change: -1.75, marketCap: 2000000000, weekHigh52: 700 },
      { name: "Chainlink", price: 1150, change: 2.30, marketCap: 7000000000, weekHigh52: 1300 },
      { name: "Algorand", price: 150, change: 0.25, marketCap: 1200000000, weekHigh52: 200 },
      { name: "VeChain", price: 0.025, change: -0.80, marketCap: 2000000000, weekHigh52: 0.030 },
    ];
    setPrices(initialPrices);

    // Update prices every 10 seconds with more realistic changes
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((price) => {
          const priceChange = (Math.random() - 0.5) * (price.price * 0.01); // More realistic 1% max change
          const newPrice = price.price + priceChange;
          const changePercentage = parseFloat((Math.random() * 5 - 2.5).toFixed(2));
          
          return {
            ...price,
            price: newPrice,
            change: changePercentage,
            marketCap: price.marketCap + (Math.random() - 0.5) * (price.marketCap * 0.005),
            // Update 52-week high if current price exceeds it
            weekHigh52: newPrice > price.weekHigh52 ? newPrice : price.weekHigh52,
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []); // Remove defaultCurrency dependency as it's not used in the effect

  // Get currency rate and symbol safely
  const rate = exchangeRates[defaultCurrency as SupportedCurrency] || 1;
  const currencySymbol = currencySymbols[defaultCurrency as SupportedCurrency] || "$";
  
  // Format large numbers for better display
  const formatValue = (value: number): string => {
    if (value >= 1000000000) {
      return `${(value * rate / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value * rate / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value * rate / 1000).toFixed(2)}K`;
    }
    return (value * rate).toFixed(2);
  };

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead>Price ({defaultCurrency})</TableHead>
          <TableHead>Change (%)</TableHead>
          <TableHead>Market Cap ({defaultCurrency})</TableHead>
          <TableHead>52-Week High ({defaultCurrency})</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.map((price) => (
          <TableRow key={price.name}>
            <TableCell>{price.name}</TableCell>
            <TableCell>
              {currencySymbol}{(price.price * rate).toFixed(2)}
            </TableCell>
            <TableCell className={price.change >= 0 ? "text-green-500" : "text-red-500"}>
              {price.change >= 0 ? "+" : ""}{price.change.toFixed(2)}%
            </TableCell>
            <TableCell>
              {currencySymbol}{formatValue(price.marketCap)}
            </TableCell>
            <TableCell>
              {currencySymbol}{(price.weekHigh52 * rate).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
