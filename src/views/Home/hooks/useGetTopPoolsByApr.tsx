import { useState, useEffect, useMemo } from 'react'
import { usePriceOsBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import orderBy from 'lodash/orderBy'
import { VaultKey, DeserializedPool } from 'state/types'
import { fetchOsVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { useOsVault, useIfoPoolVault, usePools } from 'state/pools/hooks'
import { getAprData } from 'views/Pools/helpers'
import { FetchStatus } from 'config/constants/types'

export function usePoolsWithVault() {
  const { pools: poolsWithoutAutoVault } = usePools()
  const osVault = useOsVault()
  const ifoPool = useIfoPoolVault()
  const pools = useMemo(() => {
    const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
    const osPool = activePools.find((pool) => pool.sousId === 0)
    const osAutoVault = { ...osPool, vaultKey: VaultKey.OsVault }
    const ifoPoolVault = { ...osPool, vaultKey: VaultKey.IfoPool }
    const osAutoVaultWithApr = {
      ...osAutoVault,
      apr: getAprData(osAutoVault, osVault.fees.performanceFeeAsDecimal).apr,
      rawApr: osPool.apr,
    }
    const ifoPoolWithApr = {
      ...ifoPoolVault,
      apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
      rawApr: osPool.apr,
    }
    return [ifoPoolWithApr, osAutoVaultWithApr, ...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault, osVault.fees.performanceFeeAsDecimal, ifoPool.fees.performanceFeeAsDecimal])

  return pools
}

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = usePoolsWithVault()

  const osPriceBusd = usePriceOsBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.Fetching)

      try {
        await dispatch(fetchOsVaultFees())
        await dispatch(fetchPoolsPublicDataAsync())
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting])

  useEffect(() => {
    const getTopPoolsByApr = (activePools: DeserializedPool[]) => {
      const sortedByApr = orderBy(activePools, (pool: DeserializedPool) => pool.apr || 0, 'desc')
      setTopPools(sortedByApr.slice(0, 5))
    }
    if (fetchStatus === FetchStatus.Fetched && !topPools[0]) {
      getTopPoolsByApr(pools)
    }
  }, [setTopPools, pools, fetchStatus, osPriceBusd, topPools])

  return { topPools }
}

export default useGetTopPoolsByApr
