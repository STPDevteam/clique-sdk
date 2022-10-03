import { ContractInterface } from "@ethersproject/contracts";

export const DaoContractAbi: ContractInterface = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "admin", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "enable", "type": "bool" }
    ],
    "name": "Admin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" }],
    "name": "CancelProposal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "proposer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "nonce", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" }
    ],
    "name": "CreateProposal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8" }],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "settingType", "type": "uint256" }],
    "name": "Setting",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "optionIndex", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "nonce", "type": "uint256" }
    ],
    "name": "Vote",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "SETTING_TYPE_GENERAL",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SETTING_TYPE_GOVERNANCE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SETTING_TYPE_TOKEN",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "admins",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "proposalId_", "type": "uint256" }],
    "name": "cancelProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "introduction", "type": "string" },
          { "internalType": "string", "name": "content", "type": "string" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "enum IDAOBase.VotingType", "name": "votingType", "type": "uint8" }
        ],
        "internalType": "struct DAOBase.ProposalInput",
        "name": "input_",
        "type": "tuple"
      },
      { "internalType": "string[]", "name": "options_", "type": "string[]" },
      {
        "components": [
          { "internalType": "uint256", "name": "chainId", "type": "uint256" },
          { "internalType": "address", "name": "tokenAddress", "type": "address" },
          { "internalType": "uint256", "name": "balance", "type": "uint256" },
          { "internalType": "enum DAOBase.SignType", "name": "signType", "type": "uint8" }
        ],
        "internalType": "struct DAOBase.SignInfo",
        "name": "signInfo_",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "signature_", "type": "bytes" }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "daoGovernance",
    "outputs": [
      { "internalType": "uint256", "name": "proposalThreshold", "type": "uint256" },
      { "internalType": "uint256", "name": "votingThreshold", "type": "uint256" },
      { "internalType": "uint256", "name": "votingPeriod", "type": "uint256" },
      { "internalType": "enum IDAOBase.VotingType", "name": "votingType", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "daoInfo",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "handle", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "twitter", "type": "string" },
      { "internalType": "string", "name": "github", "type": "string" },
      { "internalType": "string", "name": "discord", "type": "string" },
      { "internalType": "string", "name": "daoLogo", "type": "string" },
      { "internalType": "string", "name": "website", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "daoToken",
    "outputs": [
      { "internalType": "uint256", "name": "chainId", "type": "uint256" },
      { "internalType": "address", "name": "tokenAddress", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factoryAddress",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "proposalId_", "type": "uint256" }],
    "name": "getProposalOptionById",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct DAOBase.ProposalOption[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account_", "type": "address" },
      { "internalType": "uint256", "name": "proposalId_", "type": "uint256" }
    ],
    "name": "getVoteInfoByAccountAndProposalId",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "index", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct DAOBase.VoteInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "handle", "type": "string" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "twitter", "type": "string" },
          { "internalType": "string", "name": "github", "type": "string" },
          { "internalType": "string", "name": "discord", "type": "string" },
          { "internalType": "string", "name": "daoLogo", "type": "string" },
          { "internalType": "string", "name": "website", "type": "string" }
        ],
        "internalType": "struct IDAOBase.General",
        "name": "general_",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint256", "name": "chainId", "type": "uint256" },
          { "internalType": "address", "name": "tokenAddress", "type": "address" }
        ],
        "internalType": "struct IDAOBase.Token",
        "name": "token_",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint256", "name": "proposalThreshold", "type": "uint256" },
          { "internalType": "uint256", "name": "votingThreshold", "type": "uint256" },
          { "internalType": "uint256", "name": "votingPeriod", "type": "uint256" },
          { "internalType": "enum IDAOBase.VotingType", "name": "votingType", "type": "uint8" }
        ],
        "internalType": "struct IDAOBase.Governance",
        "name": "governance_",
        "type": "tuple"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposalIndex",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "proposals",
    "outputs": [
      { "internalType": "bool", "name": "cancel", "type": "bool" },
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "introduction", "type": "string" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "votingThresholdSnapshot", "type": "uint256" },
      { "internalType": "enum IDAOBase.VotingType", "name": "votingType", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "address", "name": "admin_", "type": "address" },
      { "internalType": "bool", "name": "enabled_", "type": "bool" }
    ],
    "name": "setAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "proposalThreshold", "type": "uint256" },
          { "internalType": "uint256", "name": "votingThreshold", "type": "uint256" },
          { "internalType": "uint256", "name": "votingPeriod", "type": "uint256" },
          { "internalType": "enum IDAOBase.VotingType", "name": "votingType", "type": "uint8" }
        ],
        "internalType": "struct IDAOBase.Governance",
        "name": "governance_",
        "type": "tuple"
      }
    ],
    "name": "setGovernance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string[]", "name": "args", "type": "string[]" }],
    "name": "setInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalId_", "type": "uint256" },
      { "internalType": "uint256[]", "name": "optionIndexes_", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "amounts_", "type": "uint256[]" },
      {
        "components": [
          { "internalType": "uint256", "name": "chainId", "type": "uint256" },
          { "internalType": "address", "name": "tokenAddress", "type": "address" },
          { "internalType": "uint256", "name": "balance", "type": "uint256" },
          { "internalType": "enum DAOBase.SignType", "name": "signType", "type": "uint8" }
        ],
        "internalType": "struct DAOBase.SignInfo",
        "name": "signInfo_",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "signature_", "type": "bytes" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "voteInfos",
    "outputs": [
      { "internalType": "uint256", "name": "index", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

