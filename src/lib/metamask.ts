import { MetaMaskSDK } from '@metamask/sdk';
import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "ethers";
type Provider = ethers.providers.Provider;

export const parseUnits = ethers.utils.parseUnits;

import ERC20 from "./ERC20.json";

export class MetamaskHandler {

    signer: Signer;
    provider: Provider;

    constructor(
        public MMSDK: MetaMaskSDK = new MetaMaskSDK({
            dappMetadata: {

                url: 'app.xtreamly.io',
                name: 'Xtreamly DApp'
            }

        })
    ) {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        this.provider = provider;
        this.signer = provider.getSigner();
    }

    async connectAndGetAccounts() {
        const accounts = await this.MMSDK.getProvider().request({ method: 'eth_requestAccounts' }).catch((err) => {
            if (err.code === 4001) {
                console.log('Please connect to MetaMask.');
                return null;
            } else {
                console.error(err);
                return null;
            }
        });

        return accounts;
    }

    async detectChain() {
        const chainId = this.MMSDK.getProvider().request({ method: 'eth_chainId' });
        return chainId;
    }

    async sendEth(account: string, to: string, value: string,
        gasLimit: string, maxPriorityFeePerGas: string = '0x3b9aca00', maxFeePerGas: string = '0x2540be400'
    ) {
        const res = this.MMSDK.getProvider().request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: account,
                    to: to,
                    value: value,
                    gasLimit: gasLimit,
                    maxPriorityFeePerGas: maxPriorityFeePerGas,
                    maxFeePerGas: maxFeePerGas,
                },
            ],
        })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error(error));
    }

    async addTokenForView(address: string, symbol: string, decimals: number, imageUrl: string) {

        try {
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: address,
                        symbol: symbol,
                        decimals: decimals,
                        image: imageUrl
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }


    getContract(contractAddress: string): Contract {
        let abi = ERC20.abi;
        return new Contract(contractAddress, abi, this.signer);
    }

    getERC20Symbol = async (contract: Contract) => {
        return await contract.symbol();
    };

    getERC20Balance = async (contract: Contract, account: string) => {
        console.log(`Getting balance for ${account}`);
        return (await contract.balanceOf(account)).toString();
    };


    // NOTE: that you need to await on the return value which is transaction
    // receivpt
    // await tx.wait();
    transferERC20 = async (
        contract: Contract,
        toAddress: string,
        amount: bigint
    ) => {
        console.log(`Transfering ${amount}
                of ${await contract.symbol()}
                from ${await this.connectAndGetAccounts()[0]}
                to ${toAddress}`);
        return await contract.transfer(toAddress, amount);
    };

    // NOTE: that you need to await on the return value which is transaction
    // receivpt
    // await tx.wait();
    approveTransferERC20 = async (
        contract: Contract,
        toAddress: string,
        amount: bigint
    ) => {
        console.log(`Approving ${amount}
                of ${await contract.symbol()}
                from ${await this.connectAndGetAccounts()[0]}
                to ${toAddress}`);
        return await contract.approve(toAddress, amount);
    };


}
