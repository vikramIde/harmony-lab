/**
 * @packageDocumentation
 * @module harmony-transaction
 * @hidden
 */

import { hexToNumber, isHex, isAddress, add0xToString, strip0x, ChainType } from '@harmony-js/utils';
import {
    decode,
    encode,
    keccak256,
    hexlify,
    BN,
    hexZeroPad,
    recoverAddress,
    getAddress,
    arrayify,
    stripZeros
} from '@harmony-js/crypto';

import { HttpProvider, Messenger } from '@harmony-js/network';

export const transactionFields = [
    { name: 'nonce', length: 32, fix: false },
    { name: 'gasPrice', length: 32, fix: false, transform: 'hex' },
    { name: 'gasLimit', length: 32, fix: false, transform: 'hex' },
    { name: 'shardID', length: 16, fix: false },
    // recover it after main repo fix
    { name: 'toShardID', length: 16, fix: false },
    { name: 'to', length: 20, fix: true },
    { name: 'value', length: 32, fix: false, transform: 'hex' },
    { name: 'data', fix: false },
    { name: 'from', length: 20, fix: true },

];

export const transactionFieldsETH = [
    { name: 'nonce', length: 32, fix: false },
    { name: 'gasPrice', length: 32, fix: false, transform: 'hex' },
    { name: 'gasLimit', length: 32, fix: false, transform: 'hex' },
    { name: 'to', length: 20, fix: true },
    { name: 'value', length: 32, fix: false, transform: 'hex' },
    { name: 'data', fix: false },
];

export const handleNumber = (value) => {
    if (isHex(value) && value === '0x') {
        return hexToNumber('0x00');
    } else if (isHex(value) && value !== '0x') {
        return hexToNumber(value);
    } else {
        return value;
    }
};

export const handleAddress = (value) => {
    if (value === '0x') {
        return '0x';
    } else if (isAddress(value)) {
        return value;
    } else {
        return '0x';
    }
};

export const recover = (rawTransaction) => {
    const transaction = decode(rawTransaction);
    console.log(transaction,'recover')
    const tx = {
        id: '0x',
        from: handleAddress(transaction[8]) !== '0x'
            ? getAddress(handleAddress(transaction[8])).checksum
            : '0x',
        rawTransaction: '0x',
        unsignedRawTransaction: '0x',
        nonce: new BN(strip0x(handleNumber(transaction[0]))).toNumber(),
        gasPrice: new BN(strip0x(handleNumber(transaction[1]))),
        gasLimit: new BN(strip0x(handleNumber(transaction[2]))),
        shardID: new BN(strip0x(handleNumber(transaction[3]))).toNumber(),
        toShardID: new BN(strip0x(handleNumber(transaction[4]))).toNumber(),
        to:
            handleAddress(transaction[5]) !== '0x'
                ? getAddress(handleAddress(transaction[5])).checksum
                : '0x',
        value: new BN(strip0x(handleNumber(transaction[6]))),
        data: transaction[7],
        chainId: 0,
        signature: {
            r: '',
            s: '',
            recoveryParam: 0,
            v: 0,
        },
    };

    // Legacy unsigned transaction
    if (transaction.length === 9) {
        tx.unsignedRawTransaction = rawTransaction;
        return tx;
    }

    try {
        tx.signature.v = new BN(strip0x(handleNumber(transaction[9]))).toNumber();
    } catch (error) {
        throw error;
    }

    tx.signature.r = hexZeroPad(transaction[10], 32);
    tx.signature.s = hexZeroPad(transaction[11], 32);

    if (
        new BN(strip0x(handleNumber(tx.signature.r))).isZero() &&
        new BN(strip0x(handleNumber(tx.signature.s))).isZero()
    ) {
        // EIP-155 unsigned transaction
        tx.chainId = tx.signature.v;
        tx.signature.v = 0;
    } else {
        // Signed Tranasaction

        tx.chainId = Math.floor((tx.signature.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }

        let recoveryParam = tx.signature.v - 27;

        const raw = transaction.slice(0, 8);

        if (tx.chainId !== 0) {
            raw.push(hexlify(tx.chainId));
            raw.push('0x');
            raw.push('0x');
            recoveryParam -= tx.chainId * 2 + 8;
        }

        const digest = keccak256(encode(raw));
        try {
            const recoveredFrom = recoverAddress(digest, {
                r: hexlify(tx.signature.r),
                s: hexlify(tx.signature.s),
                recoveryParam,
            });
            tx.from = recoveredFrom === '0x' ? '0x' : getAddress(recoveredFrom).checksum;
        } catch (error) {
            throw error;
        }
        tx.rawTransaction = rawTransaction;
        tx.id = keccak256(rawTransaction);
    }
    console.log(tx, 'rawTransaction')

    return tx;
};



export const sleep = async (ms) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });

// export enum TransactionEvents {
//     transactionHash = 'transactionHash',
//     error = 'error',
//     confirmation = 'confirmation',
//     receipt = 'receipt',
//     track = 'track',
//     cxConfirmation = 'cxConfirmation',
//     cxReceipt = 'cxReceipt',
//     cxTrack = 'cxTrack',
// }

export const defaultMessenger = new Messenger(
    new HttpProvider('http://localhost:9500'),
    ChainType.Harmony,
);

/**
   *
   * @example
   * ```javascript
   * const unsigned = txn.getRLPUnsigned(txn);
   * console.log(unsigned);
   * ```
   */
export const getRLPUnsigned = (txParams)  => {
    const raw = [];

    // temp setting to be compatible with eth
    const fields = transactionFields;

    fields.forEach((field) => {
        let value = (txParams)[field.name] || [];
        value = arrayify(
            hexlify(field.transform === 'hex' ? add0xToString(value.toString(16)) : value),
        );
        // Fixed-width field
        if (field.fix === true && field.length && value.length !== field.length && value.length > 0) {
            throw new Error(`invalid length for ${field.name}`);
        }

        // Variable-width (with a maximum)
        if (field.fix === false && field.length) {
            value = stripZeros(value);
            if (value.length > field.length) {
                throw new Error(`invalid length for ${field.name}`);
            }
        }

        raw.push(hexlify(value));
    });

    if (txParams.chainId != null && txParams.chainId !== 0) {
        raw.push(hexlify(txParams.chainId));
        raw.push('0x');
        raw.push('0x');
    }

    return [encode(raw), raw];
}


