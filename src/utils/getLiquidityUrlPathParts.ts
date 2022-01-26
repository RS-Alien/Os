// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import tokens from 'config/constants/tokens'

const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
}: {
  quoteTokenAddress: string
  tokenAddress: string
}): string => {
  const wRoseAddress = tokens.wrose.address
  const firstPart = !quoteTokenAddress || quoteTokenAddress === wRoseAddress ? 'ROSE' : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wRoseAddress ? 'ROSE' : tokenAddress
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
