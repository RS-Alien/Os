export interface UserResponse {
  id: string
  createdAt: string
  updatedAt: string
  block: string
  totalBets: string
  totalBetsBull: string
  totalBetsBear: string
  totalROSE: string
  totalROSEBull: string
  totalROSEBear: string
  totalBetsClaimed: string
  totalROSEClaimed: string
  winRate: string
  averageROSE: string
  netROSE: string
  bets?: BetResponse[]
}

export interface BetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  claimedAt: string
  claimedBlock: string
  claimedHash: string
  claimedROSE: string
  claimedNetROSE: string
  createdAt: string
  updatedAt: string
  block: string
  user?: UserResponse
  round?: RoundResponse
}

export interface HistoricalBetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  user?: UserResponse
  round: {
    id: string
    epoch: string
  }
}

export interface RoundResponse {
  id: string
  epoch: string
  position: string
  failed: boolean
  startAt: string
  startBlock: string
  startHash: string
  lockAt: string
  lockBlock: string
  lockHash: string
  lockPrice: string
  lockRoundId: string
  closeAt: string
  closeBlock: string
  closeHash: string
  closePrice: string
  closeRoundId: string
  totalBets: string
  totalAmount: string
  bullBets: string
  bullAmount: string
  bearBets: string
  bearAmount: string
  bets?: BetResponse[]
}

export interface TotalWonMarketResponse {
  totalROSE: string
  totalROSETreasury: string
}

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const getRoundBaseFields = () => `
  id
  epoch
  position
  failed
  startAt
  startBlock
  startHash
  lockAt
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
`

export const getBetBaseFields = () => `
 id
 hash  
 amount
 position
 claimed
 claimedAt
 claimedHash
 claimedBlock
 claimedROSE
 claimedNetROSE
 createdAt
 updatedAt
`

export const getUserBaseFields = () => `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalROSE
  totalROSEBull
  totalROSEBear
  totalBetsClaimed
  totalROSEClaimed
  winRate
  averageROSE
  netROSE
`
