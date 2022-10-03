import JSBI from "jsbi";
import { Context } from "./Context";
import { CChainId } from "./internal/constants";
import { ClientCore } from "./internal/core";
import {
  AccountVotesInfo,
  DaoInfoProp,
  ProposalDetailProp,
  ProposalSignProp,
  ProposalSignType,
  ProposalStatus,
  ProposalVoteHistory,
  ProposalVotingTypes,
  VotingTypes,
} from "./internal/interfaces/common";
import { IClique } from "./internal/interfaces/IClique";
import { currentTimeStamp, isAddress } from "./internal/utils";
import {
  InvalidAddressOrEnsError,
  InvalidProposalIdCancelError,
  InvalidProposalIdInsufficientVotesError,
  InvalidProposalIdVoteError,
  NoSignerError,
} from "./internal/utils/error";
import { Token, TokenAmount } from "./token";

export class Clique extends ClientCore implements IClique {
  private _daoToken: Token | undefined;
  public daoInfo: DaoInfoProp | undefined;

  constructor(context: Context) {
    super(context);
    this.getDaoInfo();
  }

  public async getDaoInfo(): Promise<DaoInfoProp> {
    if (this.daoInfo) return this.daoInfo;

    const contract = this.web3.getDaoContract();
    const allRes = await Promise.all([
      contract.daoInfo(),
      contract.daoToken(),
      contract.daoGovernance(),
    ]);

    const daoTokenChainId = Number(allRes[1].chainId) as CChainId;
    const daoTokenAddress = allRes[1].tokenAddress;

    let daoToken = this.getDaoToken();
    if (!daoToken) {
      daoToken = await this.getToken(daoTokenChainId, daoTokenAddress);
      if (!daoToken) throw new Error("Token query error");
      this._setDaoToken(daoToken);
    }

    const daoInfo = {
      name: allRes[0].name,
      handle: allRes[0].handle,
      category: allRes[0].category,
      description: allRes[0].description,
      twitter: allRes[0].twitter,
      github: allRes[0].github,
      discord: allRes[0].discord,
      website: allRes[0].website,
      daoLogo: allRes[0].daoLogo,
      daoTokenAddress,
      daoTokenChainId,
      daoAddress: this.web3.getDaoAddress(),
      daoChainId: this.web3.getDaoChainId(),
      token: daoToken,
      proposalThreshold: new TokenAmount(daoToken, allRes[2].proposalThreshold),
      votingThreshold: new TokenAmount(daoToken, allRes[2].votingThreshold),
      votingPeriod: Number(allRes[2].votingPeriod),
      votingType: Number(allRes[2].votingType),
      isCustomVotes: Number(allRes[2].votingPeriod) === 0,
    };

    this.daoInfo = daoInfo;

    return daoInfo;
  }

  public async getProposalInfo(
    proposalId: number
  ): Promise<ProposalDetailProp> {
    const contract = this.web3.getDaoContract();
    let token = this.getDaoToken();
    if (!token) {
      const daoInfo = await this.getDaoInfo();
      token = daoInfo.token;
    }

    const allRes = await Promise.all([
      contract.proposals(proposalId),
      contract.getProposalOptionById(proposalId),
    ]);

    const now = currentTimeStamp();
    const startTime = Number(allRes[0].startTime.toString()) as number;
    const endTime = Number(allRes[0].endTime.toString()) as number;

    let _status: ProposalStatus = ProposalStatus.CLOSED;
    if (allRes[0].cancel) {
      _status = ProposalStatus.CANCEL;
    } else if (now >= startTime && now <= endTime) {
      _status = ProposalStatus.OPEN;
    } else if (now < startTime) {
      _status = ProposalStatus.SOON;
    } else {
      _status = ProposalStatus.CLOSED;
    }

    const _baseInfo = {
      cancel: allRes[0].cancel,
      status: _status,
      creator: allRes[0].creator as string,
      title: allRes[0].title as string,
      introduction: allRes[0].introduction as string,
      uuid: allRes[0].content as string,
      startTime,
      endTime,
      proposalId,
      votingType: allRes[0].votingType as VotingTypes,
      votingThresholdSnapshot: allRes[0].votingThresholdSnapshot.toString(),
    };

    const _totalVoteAmount = allRes[1]
      .map((item: any) => item.amount.toString() as string)
      .reduce((a: string, b: string) =>
        JSBI.ADD(JSBI.BigInt(a), JSBI.BigInt(b))
      );
    const totalVoteAmount = new TokenAmount(token, _totalVoteAmount.toString());

    const votingThreshold = new TokenAmount(
      token,
      _baseInfo.votingThresholdSnapshot
    );

    const proposalOptions = allRes[1].map((item: any) => {
      const _amount = new TokenAmount(token as Token, item.amount.toString());
      return {
        name: item.name as string,
        amount: _amount,
        per: Number(_amount.divide(totalVoteAmount).toSignificant(6)),
      };
    });

    const isSuccessProposal = !votingThreshold.greaterThan(totalVoteAmount);

    const _proposalBaseInfo = isSuccessProposal
      ? Object.assign(_baseInfo, { status: ProposalStatus.SUCCESS })
      : _baseInfo;

    const proposalContentRes = await this.request.getProposalContent(
      _proposalBaseInfo.uuid
    );

    return {
      content: proposalContentRes.data.data.content,
      proposalOptions,
      totalVoteAmount,
      votingThreshold,
      ..._proposalBaseInfo,
    };
  }

  public async getAccountVotesById(
    account: string,
    proposalId: number
  ): Promise<AccountVotesInfo[]> {
    const contract = this.web3.getDaoContract();
    let token = this.getDaoToken();
    if (!token) {
      const daoInfo = await this.getDaoInfo();
      token = daoInfo.token;
    }

    const allRes = await Promise.all([
      contract.getVoteInfoByAccountAndProposalId(account, proposalId),
      contract.getProposalOptionById(proposalId),
    ]);

    return allRes[0].map((item: any) => ({
      name: allRes[1][item.index].name,
      amount: new TokenAmount(token as Token, item.amount),
    }));
  }

  public async createProposal(
    title: string,
    introduction: string,
    content: string,
    startTime: number,
    endTime: number,
    votingType: ProposalVotingTypes,
    options: string[],
    signData: ProposalSignProp,
    isCheck?: boolean
  ): Promise<any> {
    const contract = this.web3.getDaoContract();
    if (!this.web3.getConnectedSigner()) {
      throw new NoSignerError();
    }

    if (isCheck) {
      let _daoInfo = this.daoInfo
      if (!_daoInfo) _daoInfo = await this.getDaoInfo();
      if (_daoInfo.proposalThreshold.greaterThan(signData.balance)) {
        throw new InvalidProposalIdInsufficientVotesError();
      }
    }

    let contentTag = ''
    if (content.trim()) {
      try {
        const contentRes = await this.request.saveProposalContent(content.trim())
        contentTag = contentRes.data.data.uuid
      } catch (error) {
        throw new Error('Upload failed, please try again.')
      }
    }

    const args = [
      [title, introduction, contentTag, startTime, endTime, votingType],
      options,
      [signData.tokenChainId, signData.tokenAddress, signData.balance.raw.toString(), ProposalSignType.CREATE_PROPOSAL],
      signData.signature
    ];

    return contract.createProposal(...args);
  }

  public async cancelProposal(
    proposalId: number,
    checkParams?: { account: string }
  ): Promise<any> {
    const contract = this.web3.getDaoContract();
    if (!this.web3.getConnectedSigner()) {
      throw new NoSignerError();
    }

    // check creator and proposalStatus
    if (checkParams) {
      const proposalInfo = await this.getProposalInfo(proposalId);
      if (
        ![ProposalStatus.OPEN, ProposalStatus.SOON].includes(
          proposalInfo.status
        )
      ) {
        throw new InvalidProposalIdCancelError();
      }
      if (proposalInfo.creator !== checkParams.account) {
        throw new Error("Not the creator");
      }
    }

    contract.cancelProposal(proposalId);
  }

  public async proposalVote(
    proposalId: number,
    index: number[],
    amountRaw: string[],
    signData: ProposalSignProp,
    isCheck?: boolean
  ): Promise<any> {
    const contract = this.web3.getDaoContract();
    if (!this.web3.getConnectedSigner()) {
      throw new NoSignerError();
    }
    if (!signData.balance.greaterThan(JSBI.BigInt(0))) {
      throw new InvalidProposalIdInsufficientVotesError();
    }

    // check proposalStatus
    if (isCheck) {
      const proposalInfo = await this.getProposalInfo(proposalId);
      if (proposalInfo.status !== proposalInfo.status) {
        throw new InvalidProposalIdVoteError();
      }
    }

    const args = [
      proposalId,
      index,
      amountRaw,
      [
        signData.tokenChainId,
        signData.tokenAddress,
        signData.balance.raw.toString(),
        ProposalSignType.VOTE,
      ],
      signData.signature,
    ];
    contract.vote(...args);
  }

  public async getToken(
    chainId: CChainId,
    tokenAddress: string
  ): Promise<Token> {
    if (!isAddress(tokenAddress)) throw new InvalidAddressOrEnsError();

    const daoToken = this.getDaoToken();
    if (daoToken?.address === tokenAddress && daoToken.chainId === chainId) {
      return daoToken;
    }

    const contract = this.web3.getTokenContract(tokenAddress, chainId);
    const allRes = await Promise.all([
      contract.decimals(),
      contract.symbol(),
      contract.name(),
    ]);

    return new Token(chainId, tokenAddress, allRes[0], allRes[1], allRes[2]);
  }

  public async getProposalListIds(
    status: ProposalStatus | undefined,
    offset: number,
    pageSize = 8
  ) {
    const listRes = await this.request.getProposalList(
      this.getDaoChainId(),
      this.getDaoAddress(),
      status,
      offset,
      pageSize
    );
    const data = listRes.data.data as any;
    if (!data) throw new Error(data);
    const proposalIds = data.list.map((item: any) => item.proposalId);
    const total = data.total;

    return {
      total,
      proposalIds,
    };
  }

  public async getProposalVoteHistory(
    proposalId: number,
    offset: number,
    pageSize = 8
  ): Promise<{
    total: number;
    list: ProposalVoteHistory[];
  }> {
    const listRes = await this.request.getProposalVotesList(
      this.getDaoChainId(),
      this.getDaoAddress(),
      proposalId,
      offset,
      pageSize
    );
    const data = listRes.data.data as any;
    if (!data) throw new Error(data);

    let token = this.getDaoToken();
    if (!token) {
      const daoInfo = await this.getDaoInfo();
      token = daoInfo.token;
    }

    const list: ProposalVoteHistory[] = data.list.map((item: any) => ({
      optionIndex: item.optionIndex,
      voter: item.voter,
      amountRaw: item.amount,
      amount: new TokenAmount(token as Token, item.amount),
    }));
    const total = data.total;

    return {
      total,
      list,
    };
  }

  public async getVotesDataAndSignature(
    account: string,
    proposalId: number
  ): Promise<ProposalSignProp> {
    return this._getProposalDataAndSignature(account, ProposalSignType.VOTE, proposalId)
  }
  
  public async getCreateProposalDataAndSignature(
    account: string,
    proposalId: number
  ): Promise<ProposalSignProp> {
    return this._getProposalDataAndSignature(account, ProposalSignType.CREATE_PROPOSAL, proposalId)
  }

  private async _getProposalDataAndSignature(
    account: string,
    signType: ProposalSignType,
    proposalId: number
  ): Promise<ProposalSignProp> {
    const returnData = await this.request.getSign(
      this.getDaoChainId(),
      account,
      this.getDaoAddress(),
      signType,
      proposalId
    );
    const data: {
      account: string;
      balance: string;
      signature: string;
      tokenAddress: string;
      tokenChainId: CChainId;
    } = returnData.data.data;
    let token = this.getDaoToken();
    if (!token) {
      token = await this.getToken(data.tokenChainId, data.tokenAddress);
    }

    return {
      balance: new TokenAmount(token, data.balance),
      account,
      tokenAddress: data.tokenAddress,
      tokenChainId: data.tokenChainId,
      signature: data.signature,
    };
  }

  public getDaoToken(): Token | undefined {
    return this._daoToken;
  }

  public getDaoAddress(): string {
    return this.web3.getDaoAddress();
  }

  public getDaoChainId(): CChainId {
    return this.web3.getDaoChainId();
  }

  private _setDaoToken(token: Token) {
    this._daoToken = token;
  }
}
