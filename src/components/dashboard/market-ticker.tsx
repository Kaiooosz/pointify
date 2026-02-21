"use client";

import { useEffect, useState } from "react";
import { getMarketRates } from "@/actions/market-actions";
import { TrendingUp, TrendingDown, DollarSign, Bitcoin } from "lucide-react";
import { motion } from "framer-motion";

export function MarketTicker() {
    const [rates, setRates] = useState<any>(null);

    useEffect(() => {
        getMarketRates().then(res => {
            if (res.success) setRates(res);
        });
        const interval = setInterval(() => {
            getMarketRates().then(res => {
                if (res.success) setRates(res);
            });
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (!rates) return null;

    return (
        <div className="flex items-center gap-4 py-2 px-4 bg-black border border-white/5 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-[#1DB954]" />
                <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">USD/BRL</span>
                <span className="text-[10px] font-black text-white">R$ {rates.usd.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
                <Bitcoin className="w-3.5 h-3.5 text-[#F7931A]" />
                <span className="text-[9px] font-black text-[#A7A7A7] uppercase tracking-widest">BTC/BRL</span>
                <span className="text-[10px] font-black text-white">R$ {rates.btc.toLocaleString("pt-BR")}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                <span className="text-[8px] font-black text-[#A7A7A7] uppercase tracking-widest">Live Bolsa</span>
            </div>
        </div>
    );
}
