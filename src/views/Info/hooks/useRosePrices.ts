import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'

export interface RosePrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const ROSE_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      rosePrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      rosePrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      rosePrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      rosePrice
    }
  }
`

interface PricesResponse {
  current: {
    rosePrice: string
  }
  oneDay: {
    rosePrice: string
  }
  twoDay: {
    rosePrice: string
  }
  oneWeek: {
    rosePrice: string
  }
}

const fetchRosePrices = async (
  block24: number,
  block48: number,
  blockWeek: number,
): Promise<{ rosePrices: RosePrices | undefined; error: boolean }> => {
  try {
    const data = await infoClient.request<PricesResponse>(ROSE_PRICES, {
      block24,
      block48,
      blockWeek,
    })
    return {
      error: false,
      rosePrices: {
        current: parseFloat(data.current?.rosePrice ?? '0'),
        oneDay: parseFloat(data.oneDay?.rosePrice ?? '0'),
        twoDay: parseFloat(data.twoDay?.rosePrice ?? '0'),
        week: parseFloat(data.oneWeek?.rosePrice ?? '0'),
      },
    }
  } catch (error) {
    console.error('Failed to fetch ROSE prices', error)
    return {
      error: true,
      rosePrices: undefined,
    }
  }
}

/**
 * Returns ROSE prices at current, 24h, 48h, and 7d intervals
 */
export const useRosePrices = (): RosePrices | undefined => {
  const [prices, setPrices] = useState<RosePrices | undefined>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  useEffect(() => {
    const fetch = async () => {
      const [block24, block48, blockWeek] = blocks
      const { rosePrices, error: fetchError } = await fetchRosePrices(block24.number, block48.number, blockWeek.number)
      if (fetchError) {
        setError(true)
      } else {
        setPrices(rosePrices)
      }
    }
    if (!prices && !error && blocks && !blockError) {
      fetch()
    }
  }, [error, prices, blocks, blockError])

  return prices
}
