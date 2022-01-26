import { OasisswapCollectionKey, OasisswapCollections } from './types'

const oasisswapCollections: OasisswapCollections = {
  [OasisswapCollectionKey.OASISSWAP]: {
    name: 'Oasisswap Bunnies',
    slug: 'oasisswap-bunnies',
    address: {
      42262: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
      42261: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
    },
  },
  [OasisswapCollectionKey.SQUAD]: {
    name: 'Oasis Squad',
    description: "OasisSwap's first official generative NFT collection.. Join the squad.",
    slug: 'oasis-squad',
    address: {
      42262: '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
      42261: '0xEf12ef570300bFA65c4F022deAaA3dfF4f5d5c91',
    },
  },
}

export default oasisswapCollections
