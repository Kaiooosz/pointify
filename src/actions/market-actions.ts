"use server";

export async function getMarketRates() {
    let usd = 5.45;
    let btc = 500000;

    try {
        const usdRes = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", { next: { revalidate: 60 } })
            .then(res => res.json())
            .catch(() => null);
        if (usdRes?.USDBRL?.bid) usd = parseFloat(usdRes.USDBRL.bid);

        const btcRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl", { next: { revalidate: 60 } })
            .then(res => res.json())
            .catch(() => null);
        if (btcRes?.bitcoin?.brl) btc = btcRes.bitcoin.brl;

        return {
            success: true,
            usd,
            btc,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error fetching market rates:", error);
        return {
            success: true,
            usd,
            btc,
            updatedAt: new Date().toISOString()
        };
    }
}
