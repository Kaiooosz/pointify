import { v4 as uuidv4 } from 'uuid';

export interface PixCharge {
    qrCode: string;
    copyPaste: string;
    expiresAt: Date;
    transactionId: string;
}

// Simulated PIX Provider (e.g., mimicking OpenPix, StarkBank, etc.)
export const pixProvider = {
    async createCharge(amount: number, externalReference: string): Promise<PixCharge> {
        // In a real scenario, this would call an external API.
        // Here we simulate a response.

        const mockId = uuidv4();

        // This is a dummy BRCode (EMV standard) structure for simulation
        const mockCopyPaste = `00020126580014BR.GOV.BCB.PIX0136${uuidv4()}520400005303986540${amount.toFixed(2).replace('.', '')}5802BR5913POINTIFY INC6009SAO PAULO62070503***6304${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

        return {
            qrCode: `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(mockCopyPaste)}&choe=UTF-8`,
            copyPaste: mockCopyPaste,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            transactionId: mockId
        };
    }
};
