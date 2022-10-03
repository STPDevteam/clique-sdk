import axios, { AxiosInstance, AxiosPromise } from "axios";
import { Context } from "../../Context";
import { IClientRequestCore, ResponseType } from "../interfaces/core";

export class RequestModule implements IClientRequestCore {
  public axiosInstance: AxiosInstance;
  public baseServeUrl: string;

  constructor(context: Context) {
    this.baseServeUrl = context.isTest ? "https://devapiv2.myclique.io/" : "";
    this.axiosInstance = axios.create({
      baseURL: this.baseServeUrl,
      timeout: 10000,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    });
  }

  public get<T = any>(
    url: string,
    params: { [key: string]: any } = {}
  ): AxiosPromise<ResponseType<T>> {
    return this.axiosInstance.get(url, { params });
  }
  public post<T = any>(
    url: string,
    data: { [key: string]: any },
    params = {}
  ): AxiosPromise<ResponseType<T>> {
    return this.axiosInstance.post(url, data, { params });
  }

  public getProposalList(
    chainId: number | string,
    daoAddress: string,
    status: number | undefined,
    offset: number,
    count: number
  ) {
    return this.get("stpdao/v2/proposal/list", {
      chainId,
      daoAddress,
      status: status || "",
      offset,
      count,
    });
  }

  getProposalContent(uuid: string) {
    return this.get("stpdao/v2/proposal/query", {
      uuid,
    });
  }

  getSign(
    chainId: number,
    account: string,
    daoAddress: string,
    signType: number,
    proposalId: number
  ) {
    return this.post("stpdao/v2/sign/create", {
      chainId,
      account,
      daoAddress,
      signType: signType.toString(),
      proposalId: proposalId,
    });
  }

  getProposalVotesList(
    chainId: number | string,
    daoAddress: string,
    proposalId: number,
    offset: number,
    count: number
  ) {
    return this.get("stpdao/v2/votes/list", {
      chainId,
      daoAddress,
      proposalId,
      offset,
      count,
    });
  }

  saveProposalContent(content: string) {
    return this.post('stpdao/v2/proposal/save', {
      content
    })
  }
}
