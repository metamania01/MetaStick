//@ts-nocheck
import { getMplTokenAuthRulesProgramId, mintV2, mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";
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
} from "@metaplex-foundation/mpl-token-metadata";

import { dasApi, DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";

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
    DEV1: path.join("/Users/jackfisher/.config/solana/mages.json")};

let rpc_url = "";

const umiInstance = () => {
    const umi = createUmi(rpc_url)
        // .use(mplCore())
        .use(mplTokenMetadata())
        // .use(mplInscription())
        .use(mplCandyMachine())
        // .use(mplCandyMachine())
        // .use(mplBubblegum())
        .use(dasApi())
        // .use(irysUploader())
        // .use(mplHybrid())
        // .use(mplHydra());
    const secretKey = JSON.parse(fs.readFileSync(Wallet.DEV1, "utf-8"));
    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(secretKey)
    );
    umi.use(keypairIdentity(keypair));

    console.log(`Active Key: ${keypair.publicKey}`);

    return umi; 
  };


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mint_list = {
    "total": 17,
    "limit": 1000,
    "page": 1,
    "items": [
      {
        "interface": "ProgrammableNFT",
        "id": "J3k8jsiVwnMuQLNZyvx5hwepdrYsiuTU9CNHkuv1NJJg",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/FzDl2osXzKdHefmKKS66391_ESggUHpdz7-XR_sAEsc",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/S3x9tWZye0IwdeQZfr0ust-CCgYlXZwZbtpvtCOWfMY?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/S3x9tWZye0IwdeQZfr0ust-CCgYlXZwZbtpvtCOWfMY?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "JoeMcCann",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #1",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/S3x9tWZye0IwdeQZfr0ust-CCgYlXZwZbtpvtCOWfMY?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 250
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "FmYJTB2WcBtEoTRmEuYnaG49BszeoF2kkFAxPhNimK32"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "H13sqvLtk6oTG8hsdGwGvmMU74LARAguRK64No2ic1Bm",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/olnp0IP0kVlavhnGW5tx7-1NJWwscEdN8kT2_9CIubw",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/ZsKZDU5AF25d4C3lERhsGHMhjvTeMPzE2bfSjOnbNq8?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/ZsKZDU5AF25d4C3lERhsGHMhjvTeMPzE2bfSjOnbNq8?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Stacc",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #4",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/ZsKZDU5AF25d4C3lERhsGHMhjvTeMPzE2bfSjOnbNq8?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 255
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "3BS1LRVzbqdJJdb59yRaeG25jLtj2qvRQyqssAfJQLL7"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "FWcKXABdhpk8iNQp3eCWcgf7G3z83pgw8Yd1sHmXL9XH",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/9CVaJKBnTUW0yeekN6KRxVVhEcSXxGMDPSS4ZHNYKDc",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/CjBx66NGGkuQBtuzlf1n-182IDD8_aAfni6SXpNkf38?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/CjBx66NGGkuQBtuzlf1n-182IDD8_aAfni6SXpNkf38?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "LilWang",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #16",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/CjBx66NGGkuQBtuzlf1n-182IDD8_aAfni6SXpNkf38?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 254
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "CYWvfkgPQecJrYrjpj8mxphtAo7Bk7BLk1kFjwjxTUkf"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "ExLPvHEEFE7jnvpjca54fZshJt4r7dwu9kWoTjX73Kku",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/EUoKdwtLKmTaDLDt8xoiLZJ7lFgC7PHNW1VvxFvzRWo",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/AeoHqZVxGlPmCBscdWUhoL7RzR5aXO9qkB8gqjMNohY?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/AeoHqZVxGlPmCBscdWUhoL7RzR5aXO9qkB8gqjMNohY?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Alison",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #10",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/AeoHqZVxGlPmCBscdWUhoL7RzR5aXO9qkB8gqjMNohY?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 255
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "A89xPmyYdjFfuG9a23k3JUteUJwCuNHTe5MwmrtNAAMr"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "CWnnZJaf7f17fM7RUmXQJNRnaVtWogZkUs7pw2HVZ5bY",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/Q0QvLlhN7KL0cac5nCkoNZ1jBOXfA6jn4VZ6r39Lpxc",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/TFLWNZs6ru4_aPxdq3nVhuJbaLWQ-vqCaiVkI8wtMg4?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/TFLWNZs6ru4_aPxdq3nVhuJbaLWQ-vqCaiVkI8wtMg4?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "SlayerOshi",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #2",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/TFLWNZs6ru4_aPxdq3nVhuJbaLWQ-vqCaiVkI8wtMg4?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 250
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "CEPpo2iyoct4tmAqQ4kW3G8Wiz2SE8a15WQvKNArWLWQ"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "CUBL35cxM9yjx9jEr3Sycyn1JgMndeBRVVKsXjppKMQN",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/1kBE4J-lL0HOwpPDJ3mIQZeX92gk5Sj4tIN-VAfwsuc",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/JQ27Qdne1JH6ThHeFAnTDJ1GDvnRDYy07OWgU7NMIBY?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/JQ27Qdne1JH6ThHeFAnTDJ1GDvnRDYy07OWgU7NMIBY?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "BostonRob",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #3",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/JQ27Qdne1JH6ThHeFAnTDJ1GDvnRDYy07OWgU7NMIBY?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 251
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "C1pCxcGeEF6jvzYej8nqUyhwtib4djMgQSRVPRvbf3WL"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "C3Rd8UHnmNFe4KKMpHr7Zr891QgkiNUJCuQRn1jkiavU",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/8eUG1Hx5Gbd-k_rbykqF8Z28vsokbqDkJiYkDMCh_Ew",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/kBHZHKu_aX4V0ymt8EZ8B35hf34s2uFy7QCUjzVRtBU?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/kBHZHKu_aX4V0ymt8EZ8B35hf34s2uFy7QCUjzVRtBU?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "MN",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #15",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/kBHZHKu_aX4V0ymt8EZ8B35hf34s2uFy7QCUjzVRtBU?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 254
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "DMDZ1NgLprwoUi7tPmbdayBVtr5JNxGysw5ima3CDmEk"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "A4G9RUsaKu2xvkFPvZaFepohyQ3eun5ZXJ2wNwGa4Shk",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/AQPwyO8VqY8g0dZ9WmUG8OpaD9k-oJogsnZk8S_bIpI",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/1-2-Fmtqirw0txg5idvV6GSq3b_7i2hnCAJgOZnxj68?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/1-2-Fmtqirw0txg5idvV6GSq3b_7i2hnCAJgOZnxj68?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Sk",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #13",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/1-2-Fmtqirw0txg5idvV6GSq3b_7i2hnCAJgOZnxj68?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 251
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "5wEFVRkzVriQNFSauQ5g1D4PBXN2w4GcZMr69e9eAoSE"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "6mCWPFTGGyZer2rUpVLVkGV6TrYYw7ai91fqs93bKqdr",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/rZTzt358f7uo7tSlXu_CsAdwnwcjuBT7Qg8cNc67Gao",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/-Umq7DlOc-RB_K7REbkVkWJvGGbxD7ww1yHUMsSTeHI?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/-Umq7DlOc-RB_K7REbkVkWJvGGbxD7ww1yHUMsSTeHI?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "0xmage",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #5",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/-Umq7DlOc-RB_K7REbkVkWJvGGbxD7ww1yHUMsSTeHI?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 255
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "AfLFEWYyNn4Dwz3aMosTJqtNgeWhzPHxQg5MnD3YcRno"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "6QLGCLGk1CDPHZty4JZtuSuvfv6gzERc76Ly2rom5eSK",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/IyWkOkWHQ393w9lVAuZhQCybnZRtn8KejXImyXdZn6Y",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/hYg-_3AQlFQ5F63nebOooUhS3hICOLlT_Ey6jiquCcU?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/hYg-_3AQlFQ5F63nebOooUhS3hICOLlT_Ey6jiquCcU?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Jonathon",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #14",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/hYg-_3AQlFQ5F63nebOooUhS3hICOLlT_Ey6jiquCcU?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 255
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "3QE9fzFVmLjkiFwwkmR27Gq3sYPhtNxRJekcdEuevRjk"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "5EGbVQF54eTiK97KE7JuwcAVxY7TER91VJb5ZbvnNa2u",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/DsYsNFU0oiT1Wev6L9Euu756BBiQ6avtLX6Ul4iCzqo",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/GgOLqJxgk2GsCJjPTxrLTQzjNeSYxFRsQdx7PmxCBbM?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/GgOLqJxgk2GsCJjPTxrLTQzjNeSYxFRsQdx7PmxCBbM?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "P-7",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #6",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/GgOLqJxgk2GsCJjPTxrLTQzjNeSYxFRsQdx7PmxCBbM?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 249
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "513M4dVnCNzCBCYs3ZfhcptaRBNB7uAAaqpBiiGQK6si"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "5BLqwNZR3Ldxfz5TyZUk421WtZ3Phx2ZM3Ke29MVtHWn",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/23BCa2Qo0GZFZnB6HEWHc6ESwzr7eNtwP2YtJ2DjJxw",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/AOwgU7GSxr_vmvqILAzvksjty_-QTzmSsX_J-Kyd_QE?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/AOwgU7GSxr_vmvqILAzvksjty_-QTzmSsX_J-Kyd_QE?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "BetterCallSolana",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #11",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/AOwgU7GSxr_vmvqILAzvksjty_-QTzmSsX_J-Kyd_QE?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 252
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "D3WAz3SmPhiovsPCcEYvTt6Z19qjr4p6dMCjREX8RF15"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "3dG9zCcFXp6wa95YEHPYMTecaKSB5ZsqtufgSZVdpHJ6",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/VGBv8HiuIdX3m0-2bv2zfCaJ5s-Y2Y880HLE8tphZmg",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/wklDsXpRyhUgsZIwU8xb38ihBT6JjKV6KarmsCd7l3c?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/wklDsXpRyhUgsZIwU8xb38ihBT6JjKV6KarmsCd7l3c?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Sam3d",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #8",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/wklDsXpRyhUgsZIwU8xb38ihBT6JjKV6KarmsCd7l3c?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 255
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "GRekL7okjzDayGn56G9JCgDdmbEmKu9iLokiBfa7vzCG"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "3LLc2TBfLaXeaqiKLP7wvJWuFTvFeKEsfK2NNrMGgRQu",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/B2BYnrMbhc69-ELPfczD6Dam0K8CN1UrMOzofm-LrIE",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/2j7tphqO_iY-4K0M9i6jOb58MGKmAPBidiB0QTn94Qc?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/2j7tphqO_iY-4K0M9i6jOb58MGKmAPBidiB0QTn94Qc?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Rob",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #12",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/2j7tphqO_iY-4K0M9i6jOb58MGKmAPBidiB0QTn94Qc?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 244
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "E1MbMZNuomumuLKjJAE9Km7LMTKfJath136eTffkbDt6"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "3CZW4TPyZ2a3Nr64dYsWiZQpjzfSV7KwLuwaWhWkBFwB",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/DCMcgZB3wJXrf_Y7D3ePKPHMkfepGNjaTEj0dgYtfEk",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/1zE3kE0OWlLbScXuzQymZl9lmSAnNLxdp39PfmBgLlU?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/1zE3kE0OWlLbScXuzQymZl9lmSAnNLxdp39PfmBgLlU?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "David",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #0",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/1zE3kE0OWlLbScXuzQymZl9lmSAnNLxdp39PfmBgLlU?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 251
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "428Rbjcy3fajBWSN4fYtJgzcwHs8PJtbsqZFsE3M3CBb"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "2LkVEZyBqkrKGkEwseoEP5nwbJERfB4foU8b1rWULV8h",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/wvYP3Q56JuXLTY-qSJJAbK2J6Th6-zhxZoZt-a3gm0g",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/t4yH55QBAltdIvOXcO3hbxEQIC-19TIFqz1-vXjoQCk?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/t4yH55QBAltdIvOXcO3hbxEQIC-19TIFqz1-vXjoQCk?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Don",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #7",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/t4yH55QBAltdIvOXcO3hbxEQIC-19TIFqz1-vXjoQCk?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 254
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "FBcfr5DM96emL19c7rwS9RBYdH3ux1hXyovtw7uET4xS"
        }
      },
      {
        "interface": "ProgrammableNFT",
        "id": "229kEMB6cwqZhQo5h2TqUMSxvpu5EDFw6UcNCERFpJRN",
        "content": {
          "$schema": "https://schema.metaplex.com/nft1.0.json",
          "json_uri": "https://gateway.irys.xyz/oB46QekdCS1vLyZl7AUpEh2fzQEt0_AYAdAJb08R9Kk",
          "files": [
            {
              "uri": "https://gateway.irys.xyz/RNI02KJ8MdJfoBN3lVzDUhixo0mV6rmjzUTncc47pwQ?ext=png",
              "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://gateway.irys.xyz/RNI02KJ8MdJfoBN3lVzDUhixo0mV6rmjzUTncc47pwQ?ext=png",
              "mime": "image/png"
            }
          ],
          "metadata": {
            "attributes": [
              {
                "value": "Sam",
                "trait_type": "legendary"
              }
            ],
            "description": "",
            "name": "Mage #9",
            "symbol": "MAGES",
            "token_standard": "ProgrammableNonFungible"
          },
          "links": {
            "image": "https://gateway.irys.xyz/RNI02KJ8MdJfoBN3lVzDUhixo0mV6rmjzUTncc47pwQ?ext=png"
          }
        },
        "authorities": [
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "scopes": [
              "full"
            ]
          }
        ],
        "compression": {
          "eligible": false,
          "compressed": false,
          "data_hash": "",
          "creator_hash": "",
          "asset_hash": "",
          "tree": "",
          "seq": 0,
          "leaf_id": 0
        },
        "grouping": [
          {
            "group_key": "collection",
            "group_value": "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT"
          }
        ],
        "royalty": {
          "royalty_model": "creators",
          "target": null,
          "percent": 0.069,
          "basis_points": 690,
          "primary_sale_happened": true,
          "locked": false
        },
        "creators": [
          {
            "address": "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
            "share": 0,
            "verified": true
          },
          {
            "address": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF",
            "share": 100,
            "verified": false
          }
        ],
        "ownership": {
          "frozen": true,
          "delegated": false,
          "delegate": null,
          "ownership_model": "single",
          "owner": "Bvbkr839Zus2Kp3VXD4Gi5x7rjnc1a8iCcre1zEhDqHF"
        },
        "supply": {
          "print_max_supply": 0,
          "print_current_supply": 0,
          "edition_nonce": 253
        },
        "mutable": true,
        "burnt": false,
        "token_info": {
          "supply": 1,
          "decimals": 0,
          "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "associated_token_address": "93a9nzHn4Mm5xs7vEVX4MHtuEtzdXSCVZUXGQVGE5RZb"
        }
      }
    ]
  }


const run = async () => {
  const umi = umiInstance();

//   let results: DasApiAssetList | undefined;

//   let index = 1;
//   let continueLoop = true;

//   while (continueLoop) {
//     const res = await umi.rpc.getAssetsByGroup({
//       groupKey: "creator",
//       groupValue: "53CotyrUx2BzcZBhDeP9phftAwhcVKt8QtYb6uWy1d4o",
//     //   groupValue: "8SyPrG3pGKjSDh64TL8VwTVC8vrVGRYYKnBq7JJtM3YT",
//       page: index,
//     });

//     console.log(`Page: ${index}, Total assets: `, res.total);
//     if (res.total < 1000) {
//       console.log("Total assets less than 1000 on current page, stopping loop");
//       continueLoop = false;
//     }

//     if (!results) {
//       results = res;
//       // continueLoop = false;
//     } else {
//       results.total = res.total + results.total;
//       results.items = results.items.concat(res.items);
//     }
//     index++;
//     await sleep(1000);
//   }

//   console.log("Total assets: ", results?.total);
//   console.log(results?.items.map((i) => i.mint));
  
  let mints = mint_list.items.map((i) => i.id);

  for (const mintId of mints) {

  let metadata = await fetchMetadataFromSeeds(umi, { mint: "CtdvwNW19jBxeBbwygrqbTfMMCyHPB6zHBSXJjR91Ari" })
  const collection = unwrapOptionRecursively(metadata.collection);
  const newCollection = publicKey("CtdvwNW19jBxeBbwygrqbTfMMCyHPB6zHBSXJjR91Ari");

  let transactions = transactionBuilder();

//   if (collection && collection.verified) {
//     transactions = transactions.add(
//       unverifyCollectionV1(umi, {
//         metadata: metadata.publicKey,
//         collectionMint: collection.key,
//       })
//     );
//   }

  metadata.name = "Mages v1.69";
  metadata.uri = "https://gateway.irys.xyz/Ei76OOA8blYfQakcXYsy0P9-8NTIs-e_KzxPfOxD2iw"
  transactions = transactions
    .add(
      updateAsUpdateAuthorityV2(umi, {
        mint: "CtdvwNW19jBxeBbwygrqbTfMMCyHPB6zHBSXJjR91Ari",
        data: metadata,
        tokenStandard: TokenStandard.NonFungible,
        // collection: collectionToggle("Set", [
        //   { key: newCollection, verified: false },
        // ]),
        authorizationRules:
          unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet ||
          undefined,
        authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
        // You may have to set authorizationData if required by the authorization rules
        authorizationData: undefined,
      })
    )
    // .add(
    //   verifyCollectionV1(umi, {
    //     metadata: metadata.publicKey,
    //     collectionMint: newCollection,
    //   })
    // );

  try {
        const res = await transactions.sendAndConfirm(umi);
        return
  } catch (err) {
    console.log("Error: ", err);
        console.log("some error but we keep rolling");
  }
}

  console.log("Signature: ", base58.deserialize(res.signature));

};

run().then(() => console.log("Done")).catch((err) => console.error(err));

