import {
    MarketV2,
    Token,
} from '@raydium-io/raydium-sdk';
import { Keypair } from '@solana/web3.js';

import {
    connection,
    DEFAULT_TOKEN,
    makeTxVersion,
    PROGRAMIDS,
    wallet,
    customToken
} from '../utils/config';
import { buildAndSendTx } from '../utils/util';
import React, { useEffect } from 'react';

interface TestTxInputInfo {
    baseToken: Token
    quoteToken: Token
    wallet: Keypair
}

export async function createMarket(input: TestTxInputInfo) {
    const createMarketInstructions = await MarketV2.makeCreateMarketInstructionSimple({
        connection,
        wallet: input.wallet.publicKey,
        baseInfo: input.baseToken,
        quoteInfo: input.quoteToken,
        lotSize: 1, // default 1
        tickSize: 0.01, // default 0.01
        dexProgramId: PROGRAMIDS.OPENBOOK_MARKET,
        makeTxVersion,
    })
    return {txids: await buildAndSendTx(createMarketInstructions.innerTransactions)}
}

async function createmarket(){
    const baseToken = await customToken("6GBBsv8jqjTcMy4fhj6ppFSq3W6v5Q9Uf1sKEaag1BDd");
    const quoteToken = await customToken("2T5CqhBRGAihLZZRuxGAiWwJtPYFVM7aTVAvYYF8jnpY");
    const market = await createMarket({baseToken, quoteToken, wallet});
    console.log(market);
}


export const CreateMarket = () => {
    useEffect(() => {
        createmarket().then(market => console.log(market)).catch(err => console.error(err));
    }, []);
    return (
        <div>
            <h1>Create Market</h1>
        </div>
    )
}

