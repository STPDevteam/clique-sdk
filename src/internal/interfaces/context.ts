// This file defines the interfaces of the context object holding client settings

import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider } from "@ethersproject/providers";
import { CChainId } from "../constants";

type Web3ProvidersType = {[key in CChainId]: string | JsonRpcProvider | (string | JsonRpcProvider)[]};

export type Web3ContextParams = {
  signer?:  Signer
  isTest?: boolean
  daoAddress: string
  daoChainId: CChainId
  web3Providers: Web3ProvidersType
};