import { getMplTokenAuthRulesProgramId, mintV2, mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
    collectionToggle,
    fetchMetadataFromSeeds,
    findMetadataPda,
    TokenStandard,
    unverifyCollectionV1,
    updateAsUpdateAuthorityV2,
    verifyCollectionV1,
    fetchAllDigitalAssetByVerifiedCollection,
    mplTokenMetadata,
    fetchAllDigitalAssetByCreator,
    findTokenRecordPda,
} from "@metaplex-foundation/mpl-token-metadata";


import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

import {
    publicKey,
    transactionBuilder,
    unwrapOptionRecursively,
    keypairIdentity,
    generateSigner
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import fs from "fs";
import path from "path";

const Wallet = {
    DEV1: path.join("/Users/jackfisher/.config/solana/mages.json")
};

let rpc_url = ""

const umiInstance = () => {
    const umi = createUmi(rpc_url).use(mplTokenMetadata()).use(mplCandyMachine());
    const secretKey = JSON.parse(fs.readFileSync(Wallet.DEV1, "utf-8"));
    const keypair = umi.eddsa.createKeypairFromSecretKey(
        new Uint8Array(secretKey)
    );
    umi.use(keypairIdentity(keypair));

    console.log(`Active Key: ${keypair.publicKey}`);

    return umi;
};



const run = async () => {
    const umi = umiInstance();

    const candyMachineId = publicKey("");
    const candyGuard = publicKey("");
    const collectionId = publicKey("");
    const collection = await fetchMetadataFromSeeds(umi, { mint: collectionId });

    const assetToBurn = publicKey("");
    const assetToBurnCollection = publicKey("");

    const asset = generateSigner(umi);

    const tokenAccount = findAssociatedTokenPda(umi, {
        mint: asset.publicKey,
        owner: umi.identity.publicKey,
    });
    const tokenRecord = findTokenRecordPda(umi, {
        mint: asset.publicKey,
        token: tokenAccount[0],
    });

    let transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 })) // 

    transaction = transaction.add(mintV2(umi, {
        candyMachine: candyMachineId,
        candyGuard: candyGuard,
        nftMint: asset,
        tokenRecord: tokenRecord,
        collectionMint: collectionId,
        collectionUpdateAuthority: collection.updateAuthority,
        group: "OGs",
        // mintArgs: {
        //   nftBurn: {
        //     mint: assetToBurn,
        //     tokenStandard: TokenStandard.NonFungible,
        //     requiredCollection: assetToBurnCollection,
        //   },
        // }
    }));

    for (let i=0; i<120; i++) {
        try {
            const res = await transaction.send(umi, {
                skipPreflight: true
            });
            // console.log(base58.deserialize(res.signature));

        } catch (err) {
            continue;
        }
    }


};

run().then(() => console.log("Done")).catch((err) => console.error(err));