export type NotifType =
    | "TRANSFER_IN" | "TRANSFER_OUT"
    | "DEPOSIT" | "SWAP" | "WITHDRAW"
    | "KYC_APPROVED" | "KYC_REJECTED"
    | "SYSTEM" | "NEW_USER" | "ADMIN_ACTION";

export const NOTIF_META: Record<string, { color: string; emoji: string }> = {
    TRANSFER_IN: { color: "#1DB954", emoji: "⬇️" },
    TRANSFER_OUT: { color: "#A7A7A7", emoji: "⬆️" },
    DEPOSIT: { color: "#1DB954", emoji: "💰" },
    SWAP: { color: "#26A17B", emoji: "🔄" },
    WITHDRAW: { color: "#F7931A", emoji: "📤" },
    KYC_APPROVED: { color: "#1DB954", emoji: "✅" },
    KYC_REJECTED: { color: "#EF4444", emoji: "❌" },
    SYSTEM: { color: "#60A5FA", emoji: "🔔" },
    NEW_USER: { color: "#60A5FA", emoji: "👤" },
    ADMIN_ACTION: { color: "#F59E0B", emoji: "⚡" },
};
