import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, fetchMetadataFromSeeds, updateV1 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import base58 from 'bs58';
import { clusterApiUrl } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// CHANGE THESE VALUES
const secret = "5DtdZ9pjiyyEXBNcUqjiy4LC9Up7asg5cEAaTVNVBwvnB2umB3QFP2XrkLPQ9kkHgCsWDNEEcFoeaEqswT7ZyxYL";
const cluster = "devnet"; //Replace with the network you want to use "devnet" or "mainnet-beta
const umi = createUmi(clusterApiUrl(cluster)); //Replace with your QuickNode RPC Endpoint
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(base58.decode(secret)));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));

export const SplTokenCreate = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenUrl, setTokenUrl] = useState("");
    const [tokenAmount, setTokenAmount] = useState(0);
    const [tokenDecimals, setTokenDecimals] = useState(0);

    function createmint() {
        try {
            const mint = generateSigner(umi);
            umi.use(mplCandyMachine())
            createAndMint(umi, {
                mint,
                authority: umi.identity,
                name: tokenName,
                symbol: tokenSymbol,
                uri: tokenUrl,
                // image: TOKEN_url,
                sellerFeeBasisPoints: percentAmount(0),
                decimals: 9,
                amount: tokenAmount * (10 ** tokenDecimals), // 1 billion
                tokenOwner: userWallet.publicKey,
                tokenStandard: TokenStandard.Fungible,
            }).sendAndConfirm(umi).then(() => {
                toast.success(`Successfully minted ${tokenAmount} tokens`);
                // UpdateMetadataForToken("GApiDomLBcR8sRvV7UxQWrQHXF7EXtsQNMRDJYW3zkDj");
                console.log(`Successfully minted ${tokenAmount} tokens (`, mint.publicKey, ")");
            });
        } catch (error) {
            toast.error(`Error minting tokens: ${error}`);
            console.error("Error minting tokens: ", error);
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-2xl font-bold">Create a SPL Token</h1>
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Symbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token URL" value={tokenUrl} onChange={(e) => setTokenUrl(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="number" placeholder="Token Amount" value={tokenAmount} onChange={(e) => setTokenAmount(parseInt(e.target.value))} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="number" placeholder="Token Decimals" value={tokenDecimals} onChange={(e) => setTokenDecimals(parseInt(e.target.value))} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={createmint}>Create Token</button>
            </div>
            <Toaster />
        </div>
    )
}
