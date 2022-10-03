import {
  AccountVotesInfo,
  DaoInfoProp,
  ProposalDetailProp,
  ProposalSignProp,
  ProposalStatus,
  ProposalVoteHistory,
  ProposalVotingTypes,
} from "./common";
import { Token } from "../../token";
import { IClientCore } from "./core";
import { CChainId } from "../constants";

export interface IClique extends IClientCore {
  getDaoInfo: () => Promise<DaoInfoProp>;
  daoInfo: DaoInfoProp | undefined;
  getDaoToken(): Token | undefined;
  getToken(chainId: CChainId, tokenAddress: string): Promise<Token>;
  getDaoAddress(): string;
  getDaoChainId(): CChainId;
  getProposalListIds(
    status: ProposalStatus | undefined,
    offset: number,
    pageSize?: number
  ): Promise<{
    total: number;
    proposalIds: number[];
  }>;
  cancelProposal(
    proposalId: number,
    checkParams?: {
      account: string;
    }
  ): Promise<any>;
  createProposal(title: string, introduction: string, content: string, startTime: number, endTime: number, votingType: ProposalVotingTypes, options: string[], signData: ProposalSignProp, isCheck?: boolean): Promise<any>
  getProposalInfo(proposalId: number): Promise<ProposalDetailProp | undefined>;
  getAccountVotesById(
    account: string,
    proposalId: number
  ): Promise<AccountVotesInfo[]>;
  getVotesDataAndSignature(account: string, proposalId: number): Promise<ProposalSignProp>
  getCreateProposalDataAndSignature(account: string, proposalId: number): Promise<ProposalSignProp>
  proposalVote(proposalId: number, index: number[], amountRaw: string[], signData: ProposalSignProp, isCheck?: boolean): Promise<any>
  getProposalVoteHistory(proposalId: number, offset: number, pageSize?: number): Promise<{
    total: number;
    list: ProposalVoteHistory[];
  }>
}
