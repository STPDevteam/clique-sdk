import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { CChainId } from "./internal/constants";
import { Web3ContextParams } from "./internal/interfaces/context";
import { isAddress } from "./internal/utils";
import { UnsupportedProtocolError } from "./internal/utils/error";

const supportedProtocols = ["https:"];
if (typeof process !== "undefined" && process.env?.TESTING) {
  supportedProtocols.push("http:");
}

/**
 * The Context class is an utility component that holds the configuration passed to Clique instance.
 */
export class Context {
  protected state: Web3ContextParams;
  // INTERNAL CONTEXT STATE

  /**
   * @param {Object} params
   *
   * @constructor
   */
  constructor(contextParams: Web3ContextParams) {
    if (!contextParams.daoAddress || !isAddress(contextParams.daoAddress)) {
      throw new Error("Missing DAO address");
    } else if (!contextParams.daoChainId) {
      throw new Error("Missing DAO chainId");
    } else if (!Object.keys(contextParams.web3Providers).length) {
      throw new Error("No web3 endpoints defined");
    }

    const _web3Providers: any = {};
    for (const key in contextParams.web3Providers) {
      if (
        Object.prototype.hasOwnProperty.call(contextParams.web3Providers, key)
      ) {
        const _web3ProviderItem =
          contextParams.web3Providers[Number(key) as CChainId];
        _web3Providers[Number(key)] = Context.resolveWeb3Providers(
          _web3ProviderItem
        );
      }
    }

    this.state = {
      signer: contextParams.signer,
      daoAddress: contextParams.daoAddress,
      daoChainId: contextParams.daoChainId,
      web3Providers: _web3Providers,
      isTest: contextParams.isTest || false
    };
  }

  /**
   * set web3Providers and signer
   * @param contextParams 
   */
  set(contextParams: Partial<Web3ContextParams>) {
    const _state = Object.assign({}, this.state || {}) as Web3ContextParams;
    if (contextParams.signer) {
      _state.signer = contextParams.signer;
    }
    if (contextParams.web3Providers) {
      const _web3Providers: any = {};
      for (const key in contextParams.web3Providers) {
        if (
          Object.prototype.hasOwnProperty.call(contextParams.web3Providers, key)
        ) {
          const _web3ProviderItem =
            contextParams.web3Providers[Number(key) as CChainId];
          _web3Providers[Number(key)] = Context.resolveWeb3Providers(
            _web3ProviderItem
          );
        }
      }
      _state.web3Providers = _web3Providers;
    }
    this.state = _state;
  }

  /**
   * Getter for the Signer
   *
   * @var signer
   *
   * @returns {Signer}
   *
   * @public
   */
  get signer() {
    return this.state.signer;
  }

  /**
   * Getter for the web3 providers
   *
   * @var web3Providers
   *
   * @returns {JsonRpcProvider[]}
   *
   * @public
   */
  get web3Providers(): {
    [key in CChainId]: JsonRpcProvider[];
  } {
    return this.state.web3Providers as { [key in CChainId]: JsonRpcProvider[] };
  }

  /**
   * dao address
   */
  get daoDaoAddress(): string {
    return this.state.daoAddress;
  }

  /**
   * dao chainId
   */
  get daoDaoChainId(): CChainId {
    return this.state.daoChainId;
  }

  get isTest(): boolean {
    return this.state.isTest || false;
  }

  // INTERNAL HELPERS
  private static resolveWeb3Providers(
    endpoints: string | JsonRpcProvider | (string | JsonRpcProvider)[],
    network?: Networkish
  ): JsonRpcProvider[] {
    if (Array.isArray(endpoints)) {
      return endpoints.map(item => {
        if (typeof item === "string") {
          const url = new URL(item);
          if (!supportedProtocols.includes(url.protocol)) {
            throw new UnsupportedProtocolError(url.protocol);
          }
          return new JsonRpcProvider(url.href, network);
        }
        return item;
      });
    } else if (typeof endpoints === "string") {
      const url = new URL(endpoints);
      if (!supportedProtocols.includes(url.protocol)) {
        throw new UnsupportedProtocolError(url.protocol);
      }
      return [new JsonRpcProvider(url.href, network)];
    } else {
      return [endpoints];
    }
  }
}
