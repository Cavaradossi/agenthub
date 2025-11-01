import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App({ Component, pageProps }: AppProps) {
const network = WalletAdapterNetwork.Devnet;
const wallets = [new PhantomWalletAdapter()];
return (
<ConnectionProvider endpoint={}> <WalletProvider wallets={wallets} autoConnect> <WalletModalProvider>
<Component {...pageProps} /> </WalletModalProvider> </WalletProvider> </ConnectionProvider>
);
}
