import {
    ENDPOINT as _ENDPOINT,
    Currency,
    LOOKUP_TABLE_CACHE,
    MAINNET_PROGRAM_ID,
    DEVNET_PROGRAM_ID,
    RAYDIUM_MAINNET,
    Token,
    TOKEN_PROGRAM_ID,
    TxVersion,
} from '@raydium-io/raydium-sdk';

import {
    Connection,
    Keypair,
    PublicKey,
} from '@solana/web3.js';
import base58 from 'bs58';

import dotenv from 'dotenv';
dotenv.config();

export const PROGRAMIDS = process.env.NEXT_PUBLIC_NETWORK == 'beta-mainnet' ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID;
export const wallet = Keypair.fromSecretKey(
    base58.decode(process.env.NEXT_PUBLIC_SECRET_KEY)
);
export const makeTxVersion = TxVersion.V0;
export const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL)
export const ENDPOINT = _ENDPOINT;
export const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;
export const addLookupTableInfo = process.env.NEXT_PUBLIC_NETWORK == 'beta-mainnet' ? LOOKUP_TABLE_CACHE : undefined;
export const tokenDecimal = async (tokenAddress: any) =>{
    const info = await connection.getParsedAccountInfo(new PublicKey(tokenAddress)) as any;
    const result = (info.value?.data).parsed.info.decimals;
    console.log("Decimals: ", result);
    return result;
}
export const customToken = async (tokenAddress) => {
    const decimals = await tokenDecimal(tokenAddress);
    return new Token(TOKEN_PROGRAM_ID, new PublicKey(tokenAddress), decimals);
}
export const DEFAULT_TOKEN = {
    'SOL': new Currency(9, 'USDC', 'USDC'),
    'WSOL': new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
    'USDC': new Token(TOKEN_PROGRAM_ID, new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
    'RAY': new Token(TOKEN_PROGRAM_ID, new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), 6, 'RAY', 'RAY'),
    'RAY_USDC-LP': new Token(TOKEN_PROGRAM_ID, new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'), 6, 'RAY-USDC', 'RAY-USDC'),
}