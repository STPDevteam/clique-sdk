// This file contains the definition of the low level network clients

import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { CChainId } from "../constants";
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { Signer } from "@ethersproject/abstract-signer";

export interface IClientWeb3Core {
  useSigner: (signer: Signer) => void;
  getSigner: () => Signer | null;
  getConnectedSigner: () => Signer;
  getProvider: (chainId: CChainId) => JsonRpcProvider | null;
  attachContract: (
    address: string,
    abi: ContractInterface,
    provider: JsonRpcProvider | null,
    signer: Signer | null
  ) => Contract;
  getDaoAddress: () => string;
  getDaoChainId: () => CChainId;
  getDaoContract(): Contract
  getTokenContract(tokenAddress: string, chainId: CChainId): Contract
}

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}

export interface IClientRequestCore {
  axiosInstance: AxiosInstance
  baseServeUrl: string
  get: <T = any>(url: string, params: { [key: string]: any })=> AxiosPromise<ResponseType<T>>,
  post<T = any>(url: string, data: { [key: string]: any }, params?: AxiosRequestConfig): AxiosPromise<ResponseType<T>>
  getProposalList(chainId: number | string, daoAddress: string, status: number | undefined, offset: number, count: number): AxiosPromise<ResponseType<any>>
  getProposalContent(uuid: string): AxiosPromise<ResponseType<any>>
  getSign(chainId: number, account: string, daoAddress: string, signType: number, proposalId: number): AxiosPromise<ResponseType<any>>
  getProposalVotesList(chainId: number | string, daoAddress: string, proposalId: number, offset: number, count: number): AxiosPromise<ResponseType<any>>
  saveProposalContent(content: string): AxiosPromise<ResponseType<any>>
}

export interface IClientCore {
  web3: IClientWeb3Core;
  request: IClientRequestCore;
}
