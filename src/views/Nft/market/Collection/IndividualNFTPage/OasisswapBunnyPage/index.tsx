import React, { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@oasisswap/uikit'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import { useFetchByBunnyIdAndUpdate, useGetAllBunniesByBunnyId } from 'state/nftMarket/hooks'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import PageLoader from 'components/Loader/PageLoader'
import useLastUpdated from 'hooks/useLastUpdated'
import usePreviousValue from 'hooks/usePreviousValue'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { OASISSWAP_BUNNIES_UPDATE_FREQUENCY } from 'config'
import { useGetCollectionDistributionPB } from 'views/Nft/market/hooks/useGetCollectionDistribution'
import MainOasisswapBunnyCard from './MainOasisswapBunnyCard'
import ManageOasisswapBunniesCard from './ManageOasisswapBunniesCard'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import ForSaleTableCard from './ForSaleTableCard'
import { oasisswapBunniesAddress } from '../../../constants'
import { sortNFTsByPriceBuilder } from './ForSaleTableCard/utils'
import { SortType } from '../../../types'
import { TwoColumnsContainer } from '../shared/styles'

interface IndividualOasisswapBunnyPageProps {
  bunnyId: string
}

const IndividualOasisswapBunnyPage: React.FC<IndividualOasisswapBunnyPageProps> = ({ bunnyId }) => {
  const { account } = useWeb3React()
  const [nothingForSaleBunny, setNothingForSaleBunny] = useState<NftToken>(null)
  const { lastUpdated, previousLastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const allBunnies = useGetAllBunniesByBunnyId(bunnyId)
  const [priceSort, setPriceSort] = useState<SortType>('asc')
  const previousPriceSort = usePreviousValue(priceSort)
  const { isUpdatingOasisswapBunnies, latestOasisswapBunniesUpdateAt, fetchMoreOasisswapBunnies } =
    useFetchByBunnyIdAndUpdate(bunnyId)
  const isWindowVisible = useIsWindowVisible()
  const bunniesSortedByPrice = orderBy(allBunnies, (nft) => parseFloat(nft.marketData.currentAskPrice))
  const allBunniesFromOtherSellers = account
    ? bunniesSortedByPrice.filter((bunny) => bunny.marketData.currentSeller !== account.toLowerCase())
    : bunniesSortedByPrice
  const cheapestBunny = bunniesSortedByPrice[0]
  const cheapestBunnyFromOtherSellers = allBunniesFromOtherSellers[0]
  const prevBunnyId = usePreviousValue(bunnyId)

  const {
    data: distributionData,
    total: totalBunnyCount,
    isFetching: isFetchingDistribution,
  } = useGetCollectionDistributionPB()

  useFastRefreshEffect(() => {
    // Fetch first 30 NFTs on page load
    // And then query every FETCH_NEW_NFTS_INTERVAL_MS in case some new (cheaper) NFTs were listed
    const msSinceLastUpdate = Date.now() - latestOasisswapBunniesUpdateAt
    const refreshTriggered = lastUpdated !== previousLastUpdated
    // Check for last update is here to prevent too many request due to fetchMoreOasisswapBunnies updating too often
    // (it can't be reasonably wrapper in useCallback because the tokens are updated every time you call it, which is the whole point)
    // Since fastRefresh is 10 seconds and FETCH_NEW_NFTS_INTERVAL_MS is 8 seconds it fires every 10 seconds
    // The difference in 2 seconds is just to prevent some edge cases when request takes too long
    if (
      prevBunnyId !== bunnyId ||
      refreshTriggered ||
      (msSinceLastUpdate > OASISSWAP_BUNNIES_UPDATE_FREQUENCY && !isUpdatingOasisswapBunnies && isWindowVisible)
    ) {
      fetchMoreOasisswapBunnies(priceSort)
    }
  }, [
    bunnyId,
    prevBunnyId,
    priceSort,
    fetchMoreOasisswapBunnies,
    isUpdatingOasisswapBunnies,
    latestOasisswapBunniesUpdateAt,
    isWindowVisible,
    lastUpdated,
    previousLastUpdated,
  ])

  useEffect(() => {
    // Fetch most expensive items if user selects other sorting
    if (previousPriceSort && previousPriceSort !== priceSort) {
      fetchMoreOasisswapBunnies(priceSort)
    }
  }, [fetchMoreOasisswapBunnies, priceSort, previousPriceSort])

  useEffect(() => {
    const fetchBasicBunnyData = async () => {
      const { data } = await getNftsFromCollectionApi(oasisswapBunniesAddress)
      setNothingForSaleBunny({
        // In this case tokenId doesn't matter, this token can't be bought
        tokenId: data[bunnyId].name,
        name: data[bunnyId].name,
        description: data[bunnyId].description,
        collectionName: data[bunnyId].collection.name,
        collectionAddress: oasisswapBunniesAddress,
        image: data[bunnyId].image,
        attributes: [
          {
            traitType: 'bunnyId',
            value: bunnyId,
            displayType: null,
          },
        ],
      })
    }
    // If bunny id has no listings on the market - get basic bunny info
    if (!cheapestBunny) {
      fetchBasicBunnyData()
    }
  }, [cheapestBunny, bunnyId])

  const sortedNfts = useMemo(() => allBunnies.sort(sortNFTsByPriceBuilder({ priceSort })), [allBunnies, priceSort])

  if (!cheapestBunny && !nothingForSaleBunny) {
    // TODO redirect to nft market page if collection or bunny id does not exist (came here from some bad url)
    // That would require tracking loading states and stuff...

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  const togglePriceSort = () => {
    setPriceSort((currentValue) => (currentValue === 'asc' ? 'desc' : 'asc'))
  }

  const getBunnyIdCount = () => {
    if (distributionData && !isFetchingDistribution) {
      return distributionData[bunnyId].tokenCount
    }
    return null
  }

  const getBunnyIdRarity = () => {
    if (distributionData && !isFetchingDistribution) {
      return (distributionData[bunnyId].tokenCount / totalBunnyCount) * 100
    }
    return null
  }

  const properties = cheapestBunny?.attributes || nothingForSaleBunny?.attributes

  const propertyRarity = { bunnyId: getBunnyIdRarity() }

  return (
    <Page>
      <MainOasisswapBunnyCard
        cheapestNft={cheapestBunny}
        cheapestNftFromOtherSellers={cheapestBunnyFromOtherSellers}
        nothingForSaleBunny={nothingForSaleBunny}
        onSuccessSale={refresh}
      />
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageOasisswapBunniesCard bunnyId={bunnyId} lowestPrice={cheapestBunny?.marketData?.currentAskPrice} />
          <PropertiesCard properties={properties} rarity={propertyRarity} />
          <DetailsCard
            contractAddress={oasisswapBunniesAddress}
            ipfsJson={cheapestBunny?.marketData?.metadataUrl}
            rarity={propertyRarity?.bunnyId}
            count={getBunnyIdCount()}
          />
        </Flex>
        <ForSaleTableCard
          nftsForSale={sortedNfts}
          bunnyId={bunnyId}
          totalForSale={allBunnies.length}
          loadMore={fetchMoreOasisswapBunnies}
          priceSort={priceSort}
          togglePriceSort={togglePriceSort}
          isFetchingMoreNfts={isUpdatingOasisswapBunnies}
          onSuccessSale={refresh}
        />
      </TwoColumnsContainer>
      <MoreFromThisCollection
        collectionAddress={oasisswapBunniesAddress}
        currentTokenName={cheapestBunny?.name || nothingForSaleBunny?.name}
      />
    </Page>
  )
}

export default IndividualOasisswapBunnyPage
