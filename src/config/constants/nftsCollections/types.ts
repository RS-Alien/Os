import { Address } from '../types'

export enum OasisswapCollectionKey {
  OASISSWAP = 'oasisswap',
  SQUAD = 'oasisSquad',
}

export type OasisswapCollection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type OasisswapCollections = {
  [key in OasisswapCollectionKey]: OasisswapCollection
}
