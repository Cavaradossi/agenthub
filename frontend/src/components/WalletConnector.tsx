import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletConnector() {
    const { connected, publicKey } = useWallet();

    return (
        <div>
            <WalletMultiButton />
            {connected && <p>Connected Wallet: {publicKey?.toBase58()}</p>}
        </div>
    );
}
