#!/usr/bin/env ts-node
//@ts-nocheck
import { Connection, clusterApiUrl, PublicKey, ParsedConfirmedTransaction } from '@solana/web3.js';
import { log } from 'console';

// Get the account address from command line arguments
const accountAddress = process.argv[2];

if (!accountAddress) {
    console.error("Please provide an account address.");
    process.exit(1);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the connection to the Solana cluster
const connection = new Connection("https://burned-young-snowflake.solana-mainnet.quiknode.pro/96e3f49289f987ccdd62dacc40990b20bd21f5ad/", 'confirmed');

async function getFirstTransaction(accountAddress: string): Promise<void> {
    try {
        const publicKey = new PublicKey(accountAddress);

        // Fetch signatures with a limit to start from the earliest transaction
        let signatures = await connection.getSignaturesForAddress(publicKey, {
            limit: 1000, // Use a high limit to fetch as many as possible
        });

        // If there are no signatures, there are no transactions for the account
        if (signatures.length === 0) {
            console.log("No transactions found for this account.");
            return;
        }


        
        // Traverse to find the earliest signature
        while (signatures.length === 1000) {
            try{
            const lastSignature = signatures[signatures.length - 1].signature;
            const newSignatures = await connection.getSignaturesForAddress(publicKey, {
                before: lastSignature,
                limit: 1000,
            });

            signatures = newSignatures;}
            catch (error) {
                console.error("Error fetching signatures:", error);
            }
            await sleep(500);
        }

        // The first transaction is now at the end of the list
        const firstTransaction = signatures[signatures.length - 1];

        console.log("First Transaction Signature:", firstTransaction.signature);
        console.log("Slot:", firstTransaction.slot);
        if (firstTransaction.blockTime) {
            console.log("Timestamp:", new Date(firstTransaction.blockTime * 1000).toISOString());
        } else {
            console.log("Timestamp: No block time available.");
        }

    } catch (error) {
        console.error("Error fetching first transaction:", error);
    }
}


async function main(): Promise<void> {
    const accountAddress = process.argv[2];

    if (!accountAddress) {
        console.error("Please provide an account address.");
        process.exit(1);
    }

    await getFirstTransaction(accountAddress);
}

main()
    .then(() => {
        console.log("Script completed successfully.");
    })
    .catch((error) => {
        console.error("Script encountered an error:", error);
    });