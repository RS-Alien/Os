import React, { useEffect, useState } from 'react'
import { Flex, useTooltip } from '@oasisswap/uikit'
import { useLoadingState } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import CountdownCircle from './CountdownCircle'

const UpdateIndicator = () => {
  const { t } = useTranslation()
  const [secondsRemaining, setSecondsRemaining] = useState(10)
  const { isUpdatingOasisswapBunnies: isFetchingMoreOasisswapBunnies } = useLoadingState()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Items in the table update every 10 seconds'), {
    placement: 'auto',
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!isFetchingMoreOasisswapBunnies) {
      setSecondsRemaining(10)
    }
  }, [isFetchingMoreOasisswapBunnies])

  return (
    <Flex justifyContent="center" ref={targetRef}>
      <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={isFetchingMoreOasisswapBunnies} />
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default UpdateIndicator
