import { 
    encryptPhrase, 
    getAddress, 
    decryptPhrase, 
    HarmonyAddress,

} from "@harmony-js/crypto";
import { ChainID, ChainType, isValidAddress, Unit  } from "@harmony-js/utils"
// import { StakingTransaction } from "@harmony-js/staking";
import { recover, getRLPUnsigned, RLPSign, sendRawTx, getShardBalance } from "./util";
// import { Account } from "@harmony-js/account";
import { Harmony } from "@harmony-js/core";
const { toUtf8Bytes } = require('@harmony-js/contract');

var currentNetwork = "";

export const RecoverCode = {
    MNEMONIC: 1,
    PRIVATE_KEY: 2,
    KEYSTORE: 3,
};

let network = {
    id: 3,
    chainId: ChainID.HmyTestnet,
    name: "Testnet",
    apiUrl: "https://api.s0.b.hmny.io",
    type: ChainType.Harmony,
    default_gas_price: 1e-9, // Recommended
    default_gas_estimate: 21000, // Recommended
    contract_gas_estimate: 42000 // Recommended
}
export const FACTORYTYPE = {
    STAKINGTRANSACTION: "staking",
    TRANSACTION: 'transaction'
}

var harmony = new Harmony(
    // rpc url
    network.apiUrl,
    {
        chainType: network.type,
        chainId: network.chainId, //ChainID.HmyMainnet,
    }
);
// Test net account
// sender: one15u5kn5k26tl7vla334m0w72ghjxkzddgw7mtuk
// rawTx: 0xeb80843b9aca00825208808094964330f9bfd1d8fb88560ffa693e423a7dda8f9b86b5e620f4800080028080
// pvtkey: 0xaaf84a67675bd2d2cfd8802e2b0ac0a2a10ac81d3e6575536983355f1389bf2c
// Harmony Laboratory

//Test 2 account
//sender: one15cahsfs9mveqekme9jwqxr55pmhek2m9qdkg9u
// privatekey : 0x5906b34bd8d7954835a248017f6a9d1eaed8480a48fd0d1e0e11eae9c79d691d

// Reciever 
// PublickKey ; one109tukavgk9h37z0vgpem30w7mkvznknvqlrjkw
// Private Key : 0x0f71f6db8186c28b6e6a47344c7655c12040b9bfc13ef85549925730f2c63549

// TestNetUrl : https://explorer.testnet.harmony.one/#/tx/

//Step 1 

export async function generateKeyPair() {
    // let phrase = generatePhrase()
    let phrase = `mango club state husband keen fiber float jelly major include horse infant square spike equip caught version must pen swim setup right poem economy`
    let account;
    try {
        account = getHarmony().wallet.addByMnemonic(phrase);
        console.log(account)
        let address = getAddress(account.address).bech32;
        let pvtKey = account.privateKey

        return {
            address,
            pvtKey
        }

    } catch (e) {
        console.log("createAccountFromMnemonic error = ", e);
        return false;
    }

}

//Step 2
// export async function buildTx(
//     toAddress,
//     fromAddress,
//     amount,
//     data
// ) {
//     const gasPrice = network.default_gas_price.toFixed(9)
//     const gasEstimate = network.contract_gas_estimate
//     const value = amount * 1000000
//     console.log(new HarmonyAddress(fromAddress).checksum,'from')

//     const txn = {
//         from: getAddress(fromAddress).checksum,
//         to: getAddress(toAddress).checksum,
//         value: Unit.Szabo(value).toWei(),
//         // value: '0x64',
//         shardID: 0,
//         toShardID: 0,
//         chainId:2,
//         gasLimit: gasEstimate,
//         nonce:4,
//         data: toUtf8Bytes(data),
//         gasPrice: Unit.One(gasPrice).asGwei().toWei()
//     }
//     let tx = getHarmony().transactions.newTx(txn);
//     // let [unsignedRawTransaction,raw] = getRLPUnsigned(txn)
//     let [unsignedRawTransaction,raw] = tx.getRLPUnsigned()
//     console.log(unsignedRawTransaction, raw)
//     return unsignedRawTransaction
// }
//Step 2
export async function buildTx(
    toAddress,
    fromAddress,
    amount,
    data
) {
    const gasPrice = network.default_gas_price.toFixed(9)
    const gasEstimate = network.contract_gas_estimate
    const value = amount * 1000000
    const shardBalanceObject = await getShardBalance(
        getAddress(fromAddress).checksum,
        0,
        'latest',
    )
        
    const txn = {
        from: getAddress(fromAddress).checksum,
        to: getAddress(toAddress).checksum,
        value: Unit.Szabo(value).toWei(),
        shardID: 0,
        toShardID: 0,
        chainId:2,
        gasLimit: gasEstimate,
        nonce: shardBalanceObject.nonce,
        data: toUtf8Bytes(data),
        gasPrice: Unit.One(gasPrice).toHex()
    }
    let [unsignedRawTransaction,raw] = getRLPUnsigned(txn)
    console.log(unsignedRawTransaction, raw)
    return unsignedRawTransaction
}

//Step 3
// export async function signTx(
//     privateKey,
//     rawTx,
//     type
// ) {
//     console.log('Starting - Signing - Tx')
//     // let txnObject = recover(rawTx)
//     let harmony = getHarmony()
//     const sender = harmony.wallet.addByPrivateKey(privateKey);

//     // harmony.wallet.addByPrivateKey(
//     //     privateKey,
//     // );
//     const txn = harmony.transactions.newTx();
//     txn.recover(rawTx);
//     let signed = await harmony.wallet.signTransaction(txn, undefined,undefined,false);

//     // const [signature, rawTransaction] = RLPSign(rawTx, privateKey );

//     console.log('FInish - Signing - Tx', signed)

//     return [signed.signature, signed.rawTransaction]
// }
// //Step 3
export async function signTx(
    privateKey,
    rawTx,
    type
) {
    console.log('Starting - Signing - Tx')

    const [signature, rawTransaction] = RLPSign(rawTx, privateKey );

    console.log('FInish - Signing - Tx', rawTransaction)

    return [signature, rawTransaction]
}


//Step 4
export async function decodex(signedRawTx) {
    let newTxn = recover(signedRawTx)
    return newTxn
}



//Step 5 
export async function sendTx(
    privateKey,
    rawTx,
) {
    let x = await sendRawTx(rawTx)
    console.log(x)
    return x
}

// export async function sendTx(
//     privateKey,
//     rawTx,
// ) {
//     console.log('Starting - Sending - Tx')
//     let signedTxn = await signTx(privateKey, rawTx, '' )
//     let txHash
//     signedTxn
//         .observed()
//         .on("transactionHash", (txnHash) => {
//             console.log("--- hash ---");
//             console.log(txnHash);
//             txHash = txnHash
//         })
//         .on("error", (error) => {
//             return {
//                 result: false,
//                 mesg: "Failed to sign transaction",
//             };
//         });

//     const [sentTxn, id] = await signedTxn.sendTransaction();
    
//     const confiremdTxn = await sentTxn.confirm(id);

//     var explorerLink;
//     if (confiremdTxn.isConfirmed()) {
//         explorerLink = getNetworkLink("/tx/" + txHash);
//     } else {
//         return {
//             result: false,
//             mesg: "Can not confirm transaction " + txnHash,
//         };
//     }

//     return {
//         result: true,
//         mesg: explorerLink,
//     };
// }

// Harmony Lab ends here 

export function getHarmony() {
    if (currentNetwork != network.name) {
        currentNetwork = network.name;
        console.log("current network changed to", network.name);
        harmony = new Harmony(
            // rpc url
            network.apiUrl,
            {
                chainType: network.type,
                chainId: network.chainId, //ChainID.HmyMainnet,
            }
        );
    }

    return harmony;
}


export function validatePrivateKey(privateKey) {
    try {
        const oneAddress = getAddressFromPrivateKey(privateKey);
        return isValidAddress(oneAddress);
    } catch (e) {
        return false;
    }
}

export async function encryptKeyStore(password, privateKey) {
    const keyStore = await encryptPhrase(privateKey, password);
    return keyStore;
}

export async function decryptKeyStore(password, keystore) {
    if (!password) {
        return false;
    }

    var privateKey;
    try {
        privateKey = await decryptPhrase(JSON.parse(keystore), password);
    } catch (e) {
        console.log(e);
        return false;
    }

    return privateKey;
}

export function generatePhrase() {
    return getHarmony().wallet.newMnemonic();
}

export async function createAccountFromMnemonic(name, mnemonic, password) {
    let account;
    try {
        account = getHarmony().wallet.addByMnemonic(mnemonic);
    } catch (e) {
        console.log("createAccountFromMnemonic error = ", e);
        return false;
    }

    let address = getAddress(account.address).bech32;
    const keystore = await encryptPhrase(account.privateKey, password);

    return {
        name,
        address,
        keystore,
    };
}

export function getAddressFromPrivateKey(privateKey) {
    let account = getHarmony().wallet.addByPrivateKey(privateKey);
    let address = getAddress(account.address).bech32;
    return address;
}

export async function getBalance(address, shardId) {
    getHarmony().blockchain.messenger.setDefaultShardID(shardId);
    let ret = await getHarmony().blockchain.getBalance({ address });
    return ret.result;
}

export async function getShardInfo() {
    //set sharding
    const res = await getHarmony().blockchain.getShardingStructure();
    getHarmony().shardingStructures(res.result);

    return res.result;
}

export function checkAddress(address) {
    return isValidAddress(address);
}

