import { Token, TokenAmount } from "../../token";
import { CChainId } from "../constants";

export enum VotingTypes {
  ANY,
  SINGLE,
  MULTI,
}

export enum ProposalStatus {
  SOON = 1,
  OPEN = 2,
  CLOSED = 3,
  CANCEL = 4,
  SUCCESS = 5,
}

export interface DaoInfoProp {
  daoAddress: string;
  daoChainId: CChainId;
  name: string;
  handle: string;
  category: string;
  description: string;
  twitter: string;
  github: string;
  website: string;
  discord: string;
  daoLogo: string;
  daoTokenAddress: string;
  daoTokenChainId: CChainId;
  token: Token; // governance token, Token chainId does not necessarily equal DAO chainId
  proposalThreshold: TokenAmount; // create proposal minimum votes
  votingThreshold: TokenAmount; // default proposal success minimum votes
  votingPeriod: number; // default proposal life time
  votingType: VotingTypes; // Voting type, any, multi-select and simple
  isCustomVotes: boolean; // Custom: votingPeriod === 0
}

export interface ProposalOptionProp {
  name: string;
  amount: TokenAmount;
  per: number;
}

export interface ProposalDetailProp {
  status: ProposalStatus;
  creator: string;
  title: string;
  cancel: boolean;
  introduction: string;
  uuid: string;
  startTime: number;
  endTime: number;
  votingType: VotingTypes; // multi-select or simple
  content: string;
  proposalOptions: ProposalOptionProp[]; // options data
  proposalId: number;
  votingThreshold: TokenAmount; // proposal success minimum votes
  totalVoteAmount: TokenAmount; // Current number of valid votes
}

export interface AccountVotesInfo {
  name: string;
  amount: TokenAmount;
}

export enum ProposalSignType {
  CREATE_PROPOSAL,
  VOTE,
}

export interface ProposalSignProp {
  balance: TokenAmount;
  account: string;
  signature: string;
  tokenAddress: string;
  tokenChainId: CChainId;
  deadline: number;
}

export interface ProposalVoteHistory {
  optionIndex: number;
  voter: string;
  amountRaw: string;
  amount: TokenAmount;
}

export enum ProposalVotingTypes {
  SINGLE = 1,
  MULTI = 2
}