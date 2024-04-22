import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, fetchMetadataFromSeeds, updateV1 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { WalletAdapter } from '@solana/wallet-adapter-base';
import "@solana/web3.js";
import base58 from 'bs58';
import { clusterApiUrl } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { notify } from 'utils/notifications';

// CHANGE THESE VALUES
const secret = "5DtdZ9pjiyyEXBNcUqjiy4LC9Up7asg5cEAaTVNVBwvnB2umB3QFP2XrkLPQ9kkHgCsWDNEEcFoeaEqswT7ZyxYL";
const cluster = "devnet"; // "devnet" or "mainnet-beta
const umi = createUmi(clusterApiUrl(cluster));
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(base58.decode(secret)));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));

export const UpdateMetaData = () => {
    const [updatedName, setUpdatedName] = useState("");
    const [updatedSymbol, setUpdatedSymbol] = useState("");
    const [updatedUri, setUpdatedUri] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const UpdateMetadataForToken = async (tokenAddress) => {
        const mint = tokenAddress;
        try{
            const initialMetadata = await fetchMetadataFromSeeds(umi, {mint: tokenAddress as any});
            await updateV1(umi, {
                mint,
                data: { 
                    name: updatedName,
                    symbol: updatedSymbol,
                    uri: updatedUri,
                    sellerFeeBasisPoints: 0,
                    creators: initialMetadata.creators,
                 },
                primarySaleHappened: true,
                isMutable: true,
        }).sendAndConfirm(umi)
        notify({ type: 'success', message: `Updated Metadata` });
        } catch (e) {
            console.error("Error: ", e);
            notify({ type: 'error', message: `Something Went Wrong` });
            return;
        }
        
    }
    const onUpdateButton = async () => {
        await UpdateMetadataForToken(tokenAddress);
    }
    return (
        <div>
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-2xl font-bold">Update Metadata</h1>
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Name" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Symbol" value={updatedSymbol} onChange={(e) => setUpdatedSymbol(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token URL" value={updatedUri} onChange={(e) => setUpdatedUri(e.target.value)} />
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Address" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onUpdateButton}>Metadata Updated</button>
            </div>
            <Toaster />
        </div>
    )
}