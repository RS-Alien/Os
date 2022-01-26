import React from 'react'
import { useRouter } from 'next/router'
import { oasisswapBunniesAddress } from '../../constants'
import IndividualOasisswapBunnyPage from './OasisswapBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  // For OasisswapBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = useRouter().query

  const isPBCollection = String(collectionAddress).toLowerCase() === oasisswapBunniesAddress.toLowerCase()
  if (isPBCollection) {
    return <IndividualOasisswapBunnyPage bunnyId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
