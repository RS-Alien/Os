import { OasisswapCollectionKey } from 'config/constants/nftsCollections/types'
import oasisswapCollections from 'config/constants/nftsCollections'
import { getAddress } from 'utils/addressHelpers'

export const nftsBaseUrl = '/nfts'
export const oasisswapBunniesAddress = getAddress(oasisswapCollections[OasisswapCollectionKey.OASISSWAP].address)
export const oasisswapSquadAddress = getAddress(oasisswapCollections[OasisswapCollectionKey.SQUAD].address)
