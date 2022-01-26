import { useState, useEffect } from 'react'
import {
  getAllOasisswapBunniesLowestPrice,
  getAllOasisswapBunniesRecentUpdatedAt,
  getNftsFromCollectionApi,
} from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { oasisswapBunniesAddress } from '../constants'

// If collection is OasisswapBunnies - gets all available bunnies, otherwise - null
const useAllOasisswapBunnyNfts = (collectionAddress: string) => {
  const [allOasisswapBunnyNfts, setAllOasisswapBunnyNfts] = useState<NftToken[]>(null)

  const isPBCollection = collectionAddress === oasisswapBunniesAddress

  useEffect(() => {
    const fetchOasisswapBunnies = async () => {
      // In order to not define special TS type just for OasisswapBunnies display we're hacking a little bit into NftToken type.
      // On this page we just want to display all bunnies with their lowest prices and updates on the market
      // Since some bunnies might not be on the market at all, we don't refer to the redux nfts state (which stores NftToken with actual token ids)
      // We merely request from API all available bunny ids with their metadata and query subgraph for lowest price and latest updates.
      const { data } = await getNftsFromCollectionApi(oasisswapBunniesAddress)
      const bunnyIds = Object.keys(data)
      const lowestPrices = await getAllOasisswapBunniesLowestPrice(bunnyIds)
      const latestUpdates = await getAllOasisswapBunniesRecentUpdatedAt(bunnyIds)
      const allBunnies: NftToken[] = bunnyIds.map((bunnyId) => {
        return {
          // tokenId here is just a dummy one to satisfy TS. TokenID does not play any role in gird display below
          tokenId: data[bunnyId].name,
          name: data[bunnyId].name,
          description: data[bunnyId].description,
          collectionAddress: oasisswapBunniesAddress,
          collectionName: data[bunnyId].collection.name,
          image: data[bunnyId].image,
          attributes: [
            {
              traitType: 'bunnyId',
              value: bunnyId,
              displayType: null,
            },
          ],
          meta: {
            currentAskPrice: lowestPrices[bunnyId],
            updatedAt: latestUpdates[bunnyId],
          },
        }
      })
      setAllOasisswapBunnyNfts(allBunnies)
    }
    if (isPBCollection && !allOasisswapBunnyNfts) {
      fetchOasisswapBunnies()
    }
  }, [isPBCollection, allOasisswapBunnyNfts])

  return allOasisswapBunnyNfts
}

export default useAllOasisswapBunnyNfts
