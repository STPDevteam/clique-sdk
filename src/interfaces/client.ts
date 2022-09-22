
export type AssetBalance = (NativeTokenBalance | Erc20TokenBalance) & {
    updateDate: Date;
};
type NativeTokenBalance = NativeTokenBase & {
    balance: bigint;
};
type Erc20TokenBalance = Erc20TokenBase & {
    balance: bigint;
};
type Erc20TokenBase = {
    type: "erc20";
    address: string;
    name: string;
    symbol: string;
    decimals: number;
};
type NativeTokenBase = {
    type: "native";
};
export interface IPluginInstallItem {
    id: string 
    data: Uint8Array
}
export interface ICreateParams {
    daoName: string;
    daoHandle: string;
    category: string;
    description?: string;
    twitterLink?: string;
    githubLink?: string;
    discordLink?: string;
    daoImage?: string;
}

export interface IDAOInfoParams {
    daoName: string;
    daoHandle: string;
    category: string;
    description: string;
    twitterLink: string;
    githubLink: string;
    discordLink: string;
    daoImage: string;
}

export interface IDAOBaseParams {
    baseChainId: number;
    tokenAddress: string;
}

export interface IDAOGovernanceParams {
    createProposalMinimum: string;
    executeMinimum: string;
    defaultVotingPeriod: number;
    votingTypes: number
}
export interface IMetadata {
    name: string;
    description: string;
    avatar?: string;
    links: DaoResourceLink[];
}

export type DaoResourceLink = { name: string; url: string };