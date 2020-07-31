import { 
    encryptPhrase, 
    getAddress, 
    decryptPhrase, 
    HarmonyAddress,
} from "@harmony-js/crypto";
import { ChainID, ChainType, strip0x, isValidAddress, Unit  } from "@harmony-js/utils"
import { StakingTransaction } from "@harmony-js/staking";
import { recover } from "@harmony-js/transaction";
import { Account } from "@harmony-js/account";
import { Harmony } from "@harmony-js/core";

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
// reciever: one1fumcmy285lh0jrp2svf2ksuxwdycwmj9wqr8p2
// rawTx: 0xeb80843b9aca00825208808094964330f9bfd1d8fb88560ffa693e423a7dda8f9b86b5e620f4800080028080
// pvtkey: 0xaaf84a67675bd2d2cfd8802e2b0ac0a2a10ac81d3e6575536983355f1389bf2c
// Harmony Laboratory
//Step 1 

export async function generateKeyPair() {
    let phrase = generatePhrase()
    let account;
    try {
        account = getHarmony().wallet.addByMnemonic(phrase);
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
export async function buildTx(
    toAddress,
    fromAddress,
    amount
) {
    const gasPrice = network.default_gas_price.toFixed(9)
    const gasEstimate = network.contract_gas_estimate

    const txn = harmony.transactions.newTx({
        from: new HarmonyAddress(fromAddress).checksum,
        to: new HarmonyAddress(toAddress).checksum,
        value: Unit.Szabo(amount).toWei(),
        shardID: 0,
        toShardID: 0,
        gasLimit: gasEstimate,
        gasPrice: Unit.One(gasPrice).toHex()
    })

    return txn
}

//Step 3
export async function signTx(
    privateKey,
    rawTx,
    type
) {
    console.log('Starting - Signing - Tx')

    let harmony = getHarmony();
    // sign the transaction use wallet;
    const account = harmony.wallet.addByPrivateKey(privateKey);
    const newTxn = harmony.transactions.newTx();
    newTxn.recover(rawTx);

    await getShardInfo()
    const signedTxn = await account.signTransaction(newTxn);

    // if (type === FACTORYTYPE.TRANSACTION)
    // {
    //         signedTxn = await signer.signTransaction(
    //         transaction ,
    //         updateNonce,
    //         encodeMode,
    //         blockNumber
    //     )
    // }
    console.log('FInish - Signing - Tx')

    return signedTxn
}

//Step 4
export async function decode(signedRawTx) {
    let harmony = getHarmony();
    const newTxn = harmony.transactions.newTx();
    newTxn.recover(signedRawTx);
    return newTxn
}
//Step 5 
export async function sendTx(
    privateKey,
    rawTx,
) {
    console.log('Starting - Sending - Tx')
    let signedTxn = await signTx(privateKey, rawTx, '' )
    console.log(signedTxn)
    signedTxn
        .observed()
        .on("transactionHash", (txnHash) => {
            console.log("--- hash ---");
            console.log(txnHash);
        })
        .on("error", (error) => {
            return {
                result: false,
                mesg: "Failed to sign transaction",
            };
        });

    const [sentTxn, id] = await signedTxn.sendTransaction();
    debugger
    const confiremdTxn = await sentTxn.confirm(id);

    var explorerLink;
    if (confiremdTxn.isConfirmed()) {
        explorerLink = getNetworkLink("/tx/" + txnHash);
    } else {
        return {
            result: false,
            mesg: "Can not confirm transaction " + txnHash,
        };
    }

    return {
        result: true,
        mesg: explorerLink,
    };
}

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

export async function transferToken(
    receiver,
    fromShard,
    toShard,
    amount,
    privateKey,
    gasLimit = "21000",
    gasPrice = 1
) {
    let harmony = getHarmony();

    //1e18
    const txn = harmony.transactions.newTx({
        //  token send to
        to: receiver,
        // amount to send
        value: new harmony.utils.Unit(amount)
            .asEther()
            .toWei()
            .toString(),
        // gas limit, you can use string
        gasLimit: gasLimit,
        // send token from shardID
        shardID:
            typeof fromShard === "string"
                ? Number.parseInt(fromShard, 10)
                : fromShard,
        // send token to toShardID
        toShardID:
            typeof toShard === "string" ? Number.parseInt(toShard, 10) : toShard,
        // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
        gasPrice: new harmony.utils.Unit(gasPrice)
            .asGwei()
            .toWei()
            .toString(),
    });
    // update the shard information
    await getShardInfo();

    // sign the transaction use wallet;
    const account = harmony.wallet.addByPrivateKey(privateKey);
    const signedTxn = await account.signTransaction(txn);

    signedTxn
        .observed()
        .on("transactionHash", (txnHash) => {
            console.log("--- hash ---");
            console.log(txnHash);
        })
        .on("error", (error) => {
            return {
                result: false,
                mesg: "Failed to sign transaction",
            };
        });

    const [sentTxn, txnHash] = await signedTxn.sendTransaction();
    const confiremdTxn = await sentTxn.confirm(txnHash);

    var explorerLink;
    if (confiremdTxn.isConfirmed()) {
        explorerLink = getNetworkLink("/tx/" + txnHash);
    } else {
        return {
            result: false,
            mesg: "Can not confirm transaction " + txnHash,
        };
    }

    return {
        result: true,
        mesg: explorerLink,
    };
}

export async function getTransfers(
    address,
    pageIndex,
    pageSize,
    order = "DESC"
) {
    let harmony = getHarmony();
    const ret = await harmony.messenger.send(
        "hmy_getTransactionsHistory",
        [
            {
                address: address,
                pageIndex: pageIndex,
                pageSize: pageSize,
                fullTx: true,
                txType: "ALL",
                order,
            },
        ],
        harmony.messenger.chainPrefix,
        harmony.messenger.getCurrentShardID()
    );

    return ret.result;
}

export async function getTransactionCount(addr) {
    let harmony = getHarmony();

    // const ret = await harmony.blockchain.getTransactionCount( {address: 'one1zksj3evekayy90xt4psrz8h6j2v3hla4qwz4ur'})
    const ret = await harmony.blockchain.getTransactionCount({ address: addr });

    return parseInt(ret.result);
}

export function getNetworkLink(currentNetwork, path) {
    var basic;
    switch (currentNetwork) {
        case "Mainnet": {
            basic = "https://explorer.harmony.one/#";
            break;
        }
        case "Pangaea": {
            basic = "https://explorer.pangaea.harmony.one/#";
            break;
        }
        case "Testnet": {
            basic = "https://explorer.testnet.harmony.one/#";
            break;
        }
        case "OpensSakingNet": {
            basic = "https://explorer.os.hmny.io/#";
            break;
        }
        case "Localnet": {
            basic = "";
            break;
        }
        case "PartnerNet": {
            basic = "https://explorer.ps.hmny.io/#";
            break;
        }
        default: {
            basic = "https://explorer.harmony.one/#";
            break;
        }
    }

    return basic + path;
}

export function removeDups(myList) {
    let unique = {};
    var newList = [];
    myList.forEach(function (i) {
        if (!unique[i.blockHash]) {
            unique[i.blockHash] = true;
            newList.push(i);
        }
    });

    return newList;
}
