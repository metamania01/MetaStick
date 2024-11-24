//@ts-nocheck
import { Keypair, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairPayer, keypairIdentity, publicKey, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { fetchAllDigitalAssetByVerifiedCollection, updateV1, fetchMetadataFromSeeds, verifyCreatorV1, findMetadataPda, fetchAllDigitalAssetByCreator } from '@metaplex-foundation/mpl-token-metadata'


// Replace with your current wallet private key (for example purposes, convert a secret key string to Uint8Array)
const WALLET_SECRET_KEY = Uint8Array.from([])
const NEW_UPDATE_AUTHORITY = Uint8Array.from([])
const wallet = Keypair.fromSecretKey(WALLET_SECRET_KEY);
const newWallet = Keypair.fromSecretKey(NEW_UPDATE_AUTHORITY)
const umiKeypair = fromWeb3JsKeypair(wallet);
const umiNewKeypair = fromWeb3JsKeypair(newWallet)

// Replace with your RPC connection URL
const RPC_URL = "";
const connection = new Connection(RPC_URL, "confirmed");

const umi = createUmi(RPC_URL);
umi.use(keypairIdentity(umiKeypair));
umi.use(keypairPayer(umiKeypair));
const umiSigner = createSignerFromKeypair(umi, umiKeypair)
const umiNewSigner = createSignerFromKeypair(umi, umiNewKeypair)


const CREATOR = publicKey("99VXriv7RXJSypeJDBQtGRsak1n5o2NBzbtMXhHW2RNG")
const COLLECTION = publicKey("AeaLPUDgHfPULfBfWS2EFRczygPMXBJQjUEAJtoB9qxB")
/**
 * Retrieves all NFT mint addresses in a specified collection.
 * @param collectionAddress - The public key of the collection.
 * @returns Promise<string[]> - An array of NFT mint addresses in the collection.
 */
async function getNftMintsInCollection(): Promise<string[]> {
    console.log("Fetching NFT mint addresses in the collection...");
    // Fetch all metadata accounts associated with the collection
    const assets = await fetchAllDigitalAssetByCreator(umi, CREATOR);
    console.log(`Found ${assets.length} NFTs in the collection.`);
    // Extract and return all mint addresses
    const nftMintAddresses = assets.map((asset) => asset.mint.publicKey);
    return nftMintAddresses;
}

async function updateNftCollectionUpdateAuthority(mint) {
    // Set up connection, wallet, and Umi instance
    const wallet = Keypair.fromSecretKey(WALLET_SECRET_KEY);

    // Prepare the instruction to update the metadata account
    const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
    await updateV1(umi, {
        mint,
        authority: umiSigner,
        data: {
            ...initialMetadata,
            creators: [
                {
                    address: publicKey("CZee72qSPikX1eFWpunHiXFrA9bwaFEbEdKhqMrc3Vdu"),
                    verified: true,
                    share: 0
                },
                {
                    address: publicKey("7Ykem4ENTbVr5Si1PE4esGpaZt3YT8i7mh92hvN6CAua"),
                    verified: false,
                    share: 100
                }
            ]
        },
        newUpdateAuthority: publicKey("7Ykem4ENTbVr5Si1PE4esGpaZt3YT8i7mh92hvN6CAua"),

    }).sendAndConfirm(umi)


    // let metadata = findMetadataPda( umi, { mint: mint })
    // await verifyCreatorV1(umi, {
    //     metadata, 
    //     authority: umiNewSigner
    // }).sendAndConfirm(umi)

}


async function main() {

    let mintList = await getNftMintsInCollection()
    console.log(mintList.length);
    
    for (let mint of mintList) {
        console.log('Updating Mage ', mint);
        

        // try {
        //     let txid = await updateNftCollectionUpdateAuthority(mint)
        //     console.log(`Transaction ID: ${txid}`);
        // } catch (error) {
        //     console.error(`Error updating NFT mint ${mint}: ${error}`);
        // }

    }
}

main().then(() => console.log("All swaps completed!")
).catch(error => {
    console.error(error);
    process.exit(1);
})