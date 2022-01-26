const OASISSWAP_EXTENDED = 'https://tokens.oasisswap.io/oasisswap-extended.json'
const OASISSWAP_TOP100 = 'https://tokens.oasisswap.io/oasisswap-top-100.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  OASISSWAP_TOP100,
  OASISSWAP_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
