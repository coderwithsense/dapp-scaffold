import toast, { Toaster } from "react-hot-toast"
import { useState } from "react"
import { getMint, getOrCreateAssociatedTokenAccount, revoke, revokeInstructionData } from "@solana/spl-token"
import { PublicKey, Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import base58 from 'bs58';
import {configDotenv} from 'dotenv';
import { revokeStandardV1 } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
configDotenv();

const cluster = 'devnet'; // "devnet" or "mainnet-beta
const connection = new Connection(clusterApiUrl(cluster as any));
const key = base58.decode('5DtdZ9pjiyyEXBNcUqjiy4LC9Up7asg5cEAaTVNVBwvnB2umB3QFP2XrkLPQ9kkHgCsWDNEEcFoeaEqswT7ZyxYL');
const ownerKeypair = Keypair.fromSecretKey(key);

const umi = createUmi(clusterApiUrl(cluster));
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(key));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));

const RevokeControl = () => {
    const [tokenAddress, setTokenAddress] = useState("");

    const revokeContract = async () => {
        const ownerAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            ownerKeypair,
            new PublicKey(tokenAddress),
            ownerKeypair.publicKey
        )
        toast.success(`Successfully created token ${ownerAccount.address}`)
        // const revokeToken = await revoke(connection, ownerKeypair, new PublicKey(tokenAddress), ownerKeypair.publicKey);
        const revokeToken = revokeStandardV1(umi, 
            {
                delegate: ownerKeypair.publicKey as any,
                mint: new PublicKey(tokenAddress) as any,
                tokenStandard: 1,
            })
        console.log("Revoke Token: ", revokeToken);
        toast.success(`Successfully revoked token ${tokenAddress}`)
    }
    return (
        <div>
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-2xl font-bold">Revoke Access To your token </h1>
                <input className="border-2 border-gray-300 p-2 rounded-md text-black" type="text" placeholder="Token Name" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={revokeContract}>Revoke Access</button>
            </div>
            <Toaster />
        </div>
    )
}

export default RevokeControl