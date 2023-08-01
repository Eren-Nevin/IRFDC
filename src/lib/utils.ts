import { ethers } from 'ethers';

export const SERVER_ADDRESS = 'https://test.xtreamly.io:5002'

export function generateRandomAccount() {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
}
