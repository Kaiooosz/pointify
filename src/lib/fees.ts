/**
 * Tabela de Taxas Pointify
 * ─────────────────────────────────────────────────────
 * Enviar / Receber / Pagar:  max(3%, R$ 0,50)
 * Swap PTS → USDT:           1%
 * Swap PTS → BTC:            2%
 */

export const FEES = {
    /** Taxas de transação (envio, recebimento, pagamento) */
    TRANSACTION: {
        PERCENT: 3,          // 3%
        MIN_FLAT: 0.50,      // mínimo R$ 0,50
    },

    /** Swap PTS → USDT */
    SWAP_USDT: {
        PERCENT: 1,          // 1%
    },

    /** Swap PTS → BTC */
    SWAP_BTC: {
        PERCENT: 2,          // 2%
    },
} as const;

/**
 * Calcula a taxa de transação (envio/recebimento/pagamento)
 * Regra: max(3% do valor, R$ 0,50)
 */
export function calcTransactionFee(amount: number): number {
    const percentFee = amount * (FEES.TRANSACTION.PERCENT / 100);
    return Math.max(percentFee, FEES.TRANSACTION.MIN_FLAT);
}

/**
 * Calcula a taxa de swap
 * @param amount - valor em PTS sendo convertido
 * @param token - "USDT" | "BTC"
 */
export function calcSwapFeePercent(token: "USDT" | "BTC"): number {
    return token === "BTC" ? FEES.SWAP_BTC.PERCENT : FEES.SWAP_USDT.PERCENT;
}

/**
 * Formata taxa para exibição
 */
export function formatFeeDisplay(feePercent: number): string {
    return `${feePercent}%`;
}
