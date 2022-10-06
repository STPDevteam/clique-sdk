import { Context } from "../../Context";
import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { IClientWeb3Core } from "../interfaces/core";
import { CChainId } from "../constants";
import { DaoContractAbi } from '../abi/governanceDao'
import { erc20ContractAbi } from '../abi/erc20'
import { Signer } from "@ethersproject/abstract-signer";

/**
 * web3, contract
 */
export class Web3Module implements IClientWeb3Core {

    private _signer: Signer | undefined;
    private _daoAddress: string;
    private _daoChainId: CChainId;
    private _web3Providers: {
        [key in CChainId]: JsonRpcProvider[];
    };

    constructor(context: Context) {
        this._daoAddress = context.daoDaoAddress;
        this._daoChainId = context.daoDaoChainId;
        this._web3Providers = context.web3Providers;

        if (context.signer) {
            this.useSigner(context.signer);
        }
    }

    /** Replaces the current signer by the given one */
    public useSigner(signer: Signer): void {
        if (!signer) {
            throw new Error("Empty wallet or signer");
        }
        this._signer = signer;
    }


    /** Retrieves the current signer */
    public getSigner(): Signer | null {
        return this._signer || null;
    }

    /** Returns a signer connected to the current network provider */
    public getConnectedSigner(): Signer {
        let signer = this.getSigner();
        if (!signer) {
            throw new Error("No signer");
        } else if (!signer.provider && !this.getProvider()) {
            throw new Error("No provider");
        } else if (signer.provider) {
            return signer;
        }

        const provider = this.getProvider();
        if (!provider) throw new Error("No provider");

        signer = signer.connect(provider);
        return signer;
    }

    /** Returns the currently active network provider */
    public getProvider(chainId?: CChainId): JsonRpcProvider {
        if (chainId) return this._web3Providers[chainId][0]
        return this._web3Providers[this.getDaoChainId()][0];
    }

    /**
     * Returns a contract instance at the given address
     *
     * @param address Contract instance address
     * @param abi The Application Binary Inteface of the contract
     * @return A contract instance attached to the given address
     */
    public attachContract(
        address: string,
        abi: ContractInterface,
        provider: JsonRpcProvider | null,
        signer: Signer | null
    ): Contract {
        if (!address) throw new Error("Invalid contract address");
        else if (!abi) throw new Error("Invalid contract ABI");

        if (!signer && !provider) {
            throw new Error("No signer");
        }

        if (!provider) throw new Error("No provider");

        const contract = new Contract(address, abi, provider);

        if (!signer) {
            return contract;
        } else if (signer instanceof Wallet) {
            return contract.connect(signer.connect(provider));
        }

        return contract.connect(signer);
    }

    public getDaoContract() {
        return this.attachContract(this._daoAddress, DaoContractAbi, this.getProvider(), this.getSigner())
    }

    public getTokenContract(tokenAddress:string, chainId: CChainId) {
        return this.attachContract(tokenAddress, erc20ContractAbi, this.getProvider(chainId), this._daoChainId === chainId ? this.getSigner() : null)
    }

    /** Returns the current DAO address */
    public getDaoAddress(): string {
        return this._daoAddress;
    }

    /** Returns the current DAO chainId */
    public getDaoChainId(): CChainId {
        return this._daoChainId;
    }
}