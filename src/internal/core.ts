import {
  IClientCore,
  IClientRequestCore,
  IClientWeb3Core,
} from "./interfaces/core";
import { Context } from "../Context";
import { Web3Module } from "./modules/web3";
import { RequestModule } from "./modules/request";

/**
 * Provides the low level foundation so that subclasses have ready-made access to Web3, server
 */
export abstract class ClientCore implements IClientCore {

  public web3: IClientWeb3Core
  public request: IClientRequestCore

  constructor(context: Context) {
    this.web3 = new Web3Module(context);
    this.request = new RequestModule(context);
  }
}
