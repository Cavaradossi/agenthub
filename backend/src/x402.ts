import { X402Client } from 'x402-sdk';

const client = new X402Client({
    network: 'devnet',
    apiKey: process.env.X402_API_KEY!
});

export async function x402Pay(fromWallet: string, toWallet: string, amount: number) {
    try {
        const tx = await client.createPayment({
            from: fromWallet,
            to: toWallet,
            amount,
            currency: 'SOL'
        });
        await client.sendPayment(tx);
        return tx.id;
    } catch (err) {
        console.error('x402 Payment failed', err);
        throw err;
    }
}
