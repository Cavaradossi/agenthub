export async function x402Pay(fromWallet: string, toWallet: string, amount: number) {
console.log(`Simulating x402 payment: ${amount} SOL from ${fromWallet} -> ${toWallet}`);
return `DUMMY_TX_${Date.now()}`;
}
