// components/live-prices-table.tsx
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
    // Check for client-side execution
    if (typeof window === "undefined") return

    // Initialize with 15 cryptocurrencies on client side
    const initialPrices = [
      { name: "Bitcoin", price: 51252.00, change: 1.38, marketCap: 1000000000000, weekHigh52: 60000.00 },
      { name: "Ethereum", price: 2562.60, change: 0.86, marketCap: 300000000000, weekHigh52: 3000.00 },
      { name: "Binance Coin", price: 427.10, change: -2.11, marketCap: 80000000000, weekHigh52: 500.00 },
      { name: "Ripple", price: 45.30, change: 0.45, marketCap: 50000000000, weekHigh52: 60.00 },
      { name: "Cardano", price: 3.45, change: -1.23, marketCap: 20000000000, weekHigh52: 5.00 },
      { name: "Solana", price: 125.00, change: 2.10, marketCap: 60000000000, weekHigh52: 150.00 },
      { name: "Polkadot", price: 4.80, change: -0.89, marketCap: 7000000000, weekHigh52: 6.00 },
      { name: "Dogecoin", price: 0.125, change: 3.15, marketCap: 18000000000, weekHigh52: 0.15 },
      { name: "Avalanche", price: 23.00, change: 1.67, marketCap: 10000000000, weekHigh52: 25.00 },
      { name: "Shiba Inu", price: 0.000017, change: -0.50, marketCap: 10000000000, weekHigh52: 0.000020 },
      { name: "Polygon", price: 0.45, change: 0.92, marketCap: 5000000000, weekHigh52: 0.60 },
      { name: "Cosmos", price: 5.20, change: -1.75, marketCap: 2000000000, weekHigh52: 7.00 },
      { name: "Chainlink", price: 11.50, change: 2.30, marketCap: 7000000000, weekHigh52: 13.00 },
      { name: "Algorand", price: 1.50, change: 0.25, marketCap: 1200000000, weekHigh52: 2.00 },
      { name: "VeChain", price: 0.025, change: -0.80, marketCap: 2000000000, weekHigh52: 0.030 },
    ];
    setPrices(initialPrices);

    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((price) => {
          const priceChange = (Math.random() - 0.5) * (price.price * 0.01); // More realistic 1% max change
          const newPrice = Math.max(0, price.price + priceChange);
          const changePercentage = parseFloat((Math.random() * 5 - 2.5).toFixed(2));
          
          return {
            ...price,
            price: newPrice,
            change: changePercentage,
            marketCap: price.marketCap + (Math.random() - 0.5) * (price.marketCap * 0.005),
            weekHigh52: newPrice > price.weekHigh52 ? newPrice : price.weekHigh52,
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const rate = exchangeRates[defaultCurrency as SupportedCurrency] || 1;
  const currencySymbol = currencySymbols[defaultCurrency as SupportedCurrency] || "$";
  
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
