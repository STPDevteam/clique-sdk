# Clique JS governance SDK

`@myclique/governance-sdk` provides easy access to the high level interactions to be governance with an Clique DAO.

- [Website](https://myclique.io/)
- [Testnet website](https://testv2.myclique.io/)
- The current version is the test version.
- The project is in beta, use at your own risk.

# Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install
@myclique/governance-sdk.

```sh
npm install @myclique/governance-sdk
# or
yarn add @myclique/governance-sdk
```

### # Usage

## Context

The [Context](./src/Context.ts) class is an utility component that holds the
configuration passed to [Clique](./src/Clique.ts) instance.

```typescript
import { Context, Clique, CChainId } from "@myclique/governance-sdk";

// Define
const context: Context = new Context({
  daoChainId: CChainId.POLYGON,
  daoAddress: "0x39fa22b4852119c62aabdd4523ac587481943c61",
  web3Providers: {
    [CChainId.ETH]: "https://rpc.ankr.com/eth",
    [CChainId.POLYGON]: "https://rpc.ankr.com/polygon",
    [CChainId.GOERLI]: "",
    [CChainId.POLYGON_MUMBAI]: "",
  },
});
// Test
const context: Context = new Context({
  daoChainId: CChainId.GOERLI,
  daoAddress: "0xadf89e38a2d189531c425e1f79db22b43889cb50",
  web3Providers: {
    [CChainId.ETH]: "https://rpc.ankr.com/eth",
    [CChainId.POLYGON]: "https://rpc.ankr.com/polygon",
    [CChainId.GOERLI]: "https://goerli.infura.io/v3/",
    [CChainId.POLYGON_MUMBAI]: "https://rpc.ankr.com/polygon_mumbai",
  },
});

const clique: Clique = new Clique(context);

// Update signer
context.set({ signer });
// or
clique.web3.useSigner(signer);
```

### Get governance dao info

```typescript
import { Clique, DaoInfoProp } from "@myclique/governance-sdk";

const clique: Clique = new Clique(context);
const daoInfo: DaoInfoProp | undefined = clique.daoInfo;
// if undefined
const daoInfo: DaoInfoProp = await clique.getDaoInfo();
```

### Get governance dao token

```typescript
import { Clique, DaoInfoProp, Token } from "@myclique/governance-sdk";

const clique: Clique = new Clique(context);

const daoToken: Token | undefined = await clique.getDaoToken();
// or
const daoInfo: DaoInfoProp | undefined = clique.daoInfo;
// const daoInfo: DaoInfoProp = await clique.getDaoInfo()
const daoToken: Token = daoInfo.token;
```

### Create proposal

```typescript
import {
  ProposalSignProp,
  ProposalVotingTypes,
} from "@myclique/governance-sdk";

const data: ProposalSignProp = await clique.getCreateProposalDataAndSignature(
  account
);
clique.createProposal(
  "title1",
  "introduction1",
  "content1",
  1664774069,
  1666033269,
  ProposalVotingTypes.MULTI,
  ["one", "two"],
  data
);
```

### Get proposal list ids

```typescript
import { ProposalStatus } from "@myclique/governance-sdk";

// get ids
const proposalListData: {
  total: number;
  proposalIds: number[];
} = await clique.getProposalListIds(ProposalStatus.OPEN, 0);
```

### Get proposal info by proposal id

```typescript
import { ProposalDetailProp } from "@myclique/governance-sdk";

const proposalDetail: ProposalDetailProp = await clique.getProposalInfo(1);
```

### Cancel proposal

```typescript
// To cancel proposal before closing
clique.cancelProposal(1);
```

### Get account votes

```typescript
import { AccountVotesInfo } from "@myclique/governance-sdk";

const votes: AccountVotesInfo = clique.getAccountVotesById(account, 1);
```

### vote

```typescript
import { ProposalSignProp } from "@myclique/governance-sdk";

const proposalId = 1;
const data: ProposalSignProp = await clique.getVotesDataAndSignature(
  account,
  proposalId
);
clique.proposalVote(proposalId, [0], [data.balance.raw.toString()], data, true);
```

### Get proposal vote history

```typescript
import { ProposalVoteHistory } from "@myclique/governance-sdk";

const list: {
  total: number;
  list: ProposalVoteHistory[];
} = await clique.getProposalVoteHistory(proposalId, 0, 8);
```
