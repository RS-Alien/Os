import { ChainId } from '@oasisswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://emerald.oasis.dev',
  [ChainId.TESTNET]: 'https://testnet.emerald.oasis.dev',
}

export default NETWORK_URLS
