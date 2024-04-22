
import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, fetchMetadataFromSeeds, mintV1, updateV1 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { WalletAdapter } from '@solana/wallet-adapter-base';
import "@solana/web3.js";
import base58 from 'bs58';
import { clusterApiUrl } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { notify } from 'utils/notifications';

const secret = "5DtdZ9pjiyyEXBNcUqjiy4LC9Up7asg5cEAaTVNVBwvnB2umB3QFP2XrkLPQ9kkHgCsWDNEEcFoeaEqswT7ZyxYL";
const cluster = "devnet"; // "devnet" or "mainnet-beta
const umi = createUmi(clusterApiUrl(cluster));
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(base58.decode(secret)));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));
const MintTokens = () => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [mintAmount, setMintAmount] = useState("");

    const onClickButton = async (address) => {
        await mintV1(umi,
            {
                mint: address,
                amount: 1,
                tokenStandard: TokenStandard.Fungible,
            }
        ).sendAndConfirm(umi);
        notify({
            message: "Token Minted",
            description: "Token has been minted successfully",
            type: "success",
        });
    }
    return (
        <div>
            <Toaster />
            <div className="p-10">
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Token Address"
                        className="p-2 border border-gray-300 text-black"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Mint Amount"
                        className="p-2 border border-gray-300 text-black"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                    />
                    <button
                        className="p-2 bg-blue-500 text-white"
                        onClick={() => onClickButton(tokenAddress)}
                    >
                        Mint Tokens
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MintTokens;