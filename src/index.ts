import { IDAOInfoParams,IDAOBaseParams,IDAOGovernanceParams } from "./interfaces/client";
import { TransactionResponse } from '@ethersproject/providers'
import { amountAddDecimals } from './utils/index'
export class Client {  
    methods = {
      create: (IDAOInfo: IDAOInfoParams, IDAOBase: IDAOBaseParams,IDAOGovernance: IDAOGovernanceParams) => this._createDao(IDAOInfo,IDAOBase,IDAOGovernance),
    };
    private async *_createDao(
      IDAOInfo: IDAOInfoParams, IDAOBase: IDAOBaseParams,IDAOGovernance: IDAOGovernanceParams
    ): AsyncGenerator<TransactionResponse> {

      const args = [
        [
          IDAOInfo.daoName.trim(),
          IDAOInfo.daoHandle.trim(),
          IDAOInfo.category.trim(),
          IDAOInfo.description.trim(),
          IDAOInfo.twitterLink.trim(),
          IDAOInfo.githubLink.trim(),
          IDAOInfo.discordLink.trim(),
          IDAOInfo.daoImage.trim()
        ],
        [IDAOBase.baseChainId, IDAOBase.tokenAddress],
        [
          amountAddDecimals(IDAOGovernance.createProposalMinimum),
          amountAddDecimals(IDAOGovernance.executeMinimum),
          IDAOGovernance.defaultVotingPeriod,
          IDAOGovernance.votingTypes
        ]
      ]

      // createDAO(...args)

    }
  }