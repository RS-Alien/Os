import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAprData } from 'views/Pools/helpers'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchOsVaultPublicData,
  fetchOsVaultUserData,
  fetchOsVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchIfoPoolFees,
  fetchIfoPoolPublicData,
  fetchIfoPoolUserAndCredit,
  initialPoolVaultState,
  fetchOsPoolPublicDataAsync,
  fetchOsPoolUserDataAsync,
} from '.'
import { State, DeserializedPool, VaultKey } from '../types'
import { transformPool } from './helpers'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../farms'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
      await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
      batch(() => {
        dispatch(fetchPoolsPublicDataAsync())
        dispatch(fetchPoolsStakingLimitsAsync())
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch])
}

export const useFetchUserPools = (account) => {
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch])
}

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
  const { pool, userDataLoaded } = useSelector((state: State) => ({
    pool: state.pools.data.find((p) => p.sousId === sousId),
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pool: transformPool(pool), userDataLoaded }
}

export const useFetchOsVault = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    dispatch(fetchOsVaultPublicData())
  }, [dispatch])

  useFastRefreshEffect(() => {
    dispatch(fetchOsVaultUserData({ account }))
  }, [dispatch, account])

  useEffect(() => {
    dispatch(fetchOsVaultFees())
  }, [dispatch])
}

export const useFetchIfoPool = (fetchOsPool = true) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      if (fetchOsPool) {
        dispatch(fetchOsPoolPublicDataAsync())
      }
      dispatch(fetchIfoPoolPublicData())
    })
  }, [dispatch, fetchOsPool])

  useFastRefreshEffect(() => {
    if (account) {
      batch(() => {
        dispatch(fetchIfoPoolUserAndCredit({ account }))
        if (fetchOsPool) {
          dispatch(fetchOsPoolUserDataAsync(account))
        }
      })
    }
  }, [dispatch, account, fetchOsPool])

  useEffect(() => {
    dispatch(fetchIfoPoolFees())
  }, [dispatch])
}

export const useOsVault = () => {
  return useVaultPoolByKey(VaultKey.OsVault)
}

export const useVaultPools = () => {
  return {
    [VaultKey.OsVault]: useVaultPoolByKey(VaultKey.OsVault),
    [VaultKey.IfoPool]: useVaultPoolByKey(VaultKey.IfoPool),
  }
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalOsInVault: totalOsInVaultAsString,
    estimatedOsBountyReward: estimatedOsBountyRewardAsString,
    totalPendingOsHarvest: totalPendingOsHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      osAtLastUserAction: osAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => (key ? state.pools[key] : initialPoolVaultState))

  const estimatedOsBountyReward = useMemo(() => {
    return new BigNumber(estimatedOsBountyRewardAsString)
  }, [estimatedOsBountyRewardAsString])

  const totalPendingOsHarvest = useMemo(() => {
    return new BigNumber(totalPendingOsHarvestAsString)
  }, [totalPendingOsHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalOsInVault = useMemo(() => {
    return new BigNumber(totalOsInVaultAsString)
  }, [totalOsInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const osAtLastUserAction = useMemo(() => {
    return new BigNumber(osAtLastUserActionAsString)
  }, [osAtLastUserActionAsString])

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    totalOsInVault,
    estimatedOsBountyReward,
    totalPendingOsHarvest,
    fees: {
      performanceFeeAsDecimal,
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      osAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

export const useIfoPoolVault = () => {
  return useVaultPoolByKey(VaultKey.IfoPool)
}

export const useIfoPoolCreditBlock = () => {
  return useSelector((state: State) => ({
    creditStartBlock: state.pools.ifoPool.creditStartBlock,
    creditEndBlock: state.pools.ifoPool.creditEndBlock,
    hasEndBlockOver: state.block.currentBlock >= state.pools.ifoPool.creditEndBlock,
  }))
}

export const useIfoPoolCredit = () => {
  const creditAsString = useSelector((state: State) => state.pools.ifoPool.userData?.credit ?? BIG_ZERO)
  const credit = useMemo(() => {
    return new BigNumber(creditAsString)
  }, [creditAsString])

  return credit
}

export const useIfoWithApr = () => {
  const {
    fees: { performanceFeeAsDecimal },
  } = useIfoPoolVault()
  const { pool: poolZero } = usePool(0)

  const ifoPoolWithApr = useMemo(() => {
    const ifoPool = { ...poolZero }
    ifoPool.vaultKey = VaultKey.IfoPool
    ifoPool.apr = getAprData(ifoPool, performanceFeeAsDecimal).apr
    ifoPool.rawApr = poolZero.apr
    return ifoPool
  }, [performanceFeeAsDecimal, poolZero])

  return {
    pool: ifoPoolWithApr,
  }
}
