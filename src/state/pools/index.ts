import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import {
  AppThunk,
  OsVault,
  IfoOsVault,
  IfoVaultUser,
  PoolsState,
  SerializedPool,
  VaultFees,
  VaultUser,
} from 'state/types'
import osAbi from 'config/abi/os.json'
import tokens from 'config/constants/tokens'
import masterChef from 'config/abi/masterchef.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getPoolApr } from 'utils/apr'
import { BIG_ZERO } from 'utils/bigNumber'
import { getOsContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { simpleRpcProvider } from 'utils/providers'
import { multicallv2 } from 'utils/multicall'
import { fetchIfoPoolFeesData, fetchPublicIfoPoolData } from './fetchIfoPoolPublic'
import fetchIfoPoolUserData from './fetchIfoPoolUser'
import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import fetchVaultUser from './fetchVaultUser'
import { getTokenPricesFromFarm } from './helpers'

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  pricePerFullShare: null,
  totalOsInVault: null,
  estimatedOsBountyReward: null,
  totalPendingOsHarvest: null,
  fees: {
    performanceFee: null,
    callFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    osAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    credit: null,
  },
  creditStartBlock: null,
})

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
  osVault: initialPoolVaultState,
  ifoPool: initialPoolVaultState,
}

// Thunks
const osPool = poolsConfig.find((pool) => pool.sousId === 0)
const osPoolAddress = getAddress(osPool.contractAddress)
const osContract = getOsContract()
export const fetchOsPoolPublicDataAsync = () => async (dispatch, getState) => {
  const prices = getTokenPricesFromFarm(getState().farms.data)
  const stakingTokenAddress = osPool.stakingToken.address ? osPool.stakingToken.address.toLowerCase() : null
  const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0
  const earningTokenAddress = osPool.earningToken.address ? osPool.earningToken.address.toLowerCase() : null
  const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
  const totalStaking = await osContract.balanceOf(osPoolAddress)
  const apr = getPoolApr(
    stakingTokenPrice,
    earningTokenPrice,
    getBalanceNumber(new BigNumber(totalStaking ? totalStaking.toString() : 0), osPool.stakingToken.decimals),
    parseFloat(osPool.tokenPerBlock),
  )

  dispatch(
    setPoolPublicData({
      sousId: 0,
      data: {
        totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
        stakingTokenPrice,
        earningTokenPrice,
        apr,
      },
    }),
  )
}

export const fetchOsPoolUserDataAsync = (account: string) => async (dispatch) => {
  const allowanceCall = {
    address: tokens.os.address,
    name: 'allowance',
    params: [account, osPoolAddress],
  }
  const balanceOfCall = {
    address: tokens.os.address,
    name: 'balanceOf',
    params: [account],
  }
  const osContractCalls = [allowanceCall, balanceOfCall]
  const [[allowance], [stakingTokenBalance]] = await multicallv2(osAbi, osContractCalls)

  const masterChefCalls = ['pendingOs', 'userInfo'].map((method) => ({
    address: getMasterChefAddress(),
    name: method,
    params: ['0', account],
  }))
  const [[pendingReward], { amount: masterPoolAmount }] = await multicallv2(masterChef, masterChefCalls)

  dispatch(
    setPoolUserData({
      sousId: 0,
      data: {
        allowance: new BigNumber(allowance.toString()).toJSON(),
        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
        pendingReward: new BigNumber(pendingReward.toString()).toJSON(),
        stakedBalances: new BigNumber(masterPoolAmount.toString()).toJSON(),
      },
    }),
  )
}

export const fetchPoolsPublicDataAsync = () => async (dispatch, getState) => {
  try {
    const blockLimits = await fetchPoolsBlockLimits()
    const totalStakings = await fetchPoolsTotalStaking()
    let currentBlock = getState().block?.currentBlock

    if (!currentBlock) {
      currentBlock = await simpleRpcProvider.getBlockNumber()
    }

    const prices = getTokenPricesFromFarm(getState().farms.data)

    const liveData = poolsConfig.map((pool) => {
      const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
      const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
      const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

      const stakingTokenAddress = pool.stakingToken.address ? pool.stakingToken.address.toLowerCase() : null
      const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

      const earningTokenAddress = pool.earningToken.address ? pool.earningToken.address.toLowerCase() : null
      const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
      const apr = !isPoolFinished
        ? getPoolApr(
            stakingTokenPrice,
            earningTokenPrice,
            getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
            parseFloat(pool.tokenPerBlock),
          )
        : 0

      return {
        ...blockLimit,
        ...totalStaking,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      }
    })

    dispatch(setPoolsPublicData(liveData))
  } catch (error) {
    console.error('[Pools Action] error when getting public data', error)
  }
}

export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  try {
    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

    const stakingLimitData = poolsConfig.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
      }
    })

    dispatch(setPoolsPublicData(stakingLimitData))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
    try {
      const allowances = await fetchPoolsAllowance(account)
      const stakingTokenBalances = await fetchUserBalances(account)
      const stakedBalances = await fetchUserStakeBalances(account)
      const pendingRewards = await fetchUserPendingRewards(account)

      const userData = poolsConfig.map((pool) => ({
        sousId: pool.sousId,
        allowance: allowances[pool.sousId],
        stakingTokenBalance: stakingTokenBalances[pool.sousId],
        stakedBalance: stakedBalances[pool.sousId],
        pendingReward: pendingRewards[pool.sousId],
      }))

      dispatch(setPoolsUserData(userData))
    } catch (error) {
      console.error('[Pools Action] Error fetching pool user data', error)
    }
  }

export const updateUserAllowance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateUserBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserStakedBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserPendingReward =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const pendingRewards = await fetchUserPendingRewards(account)
    dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export const fetchOsVaultPublicData = createAsyncThunk<OsVault>('osVault/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicVaultData()
  return publicVaultInfo
})

export const fetchOsVaultFees = createAsyncThunk<VaultFees>('osVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees()
  return vaultFees
})

export const fetchOsVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
  'osVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)

export const fetchIfoPoolPublicData = createAsyncThunk<IfoOsVault>('ifoPool/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicIfoPoolData()
  return publicVaultInfo
})

export const fetchIfoPoolFees = createAsyncThunk<VaultFees>('ifoPool/fetchFees', async () => {
  const vaultFees = await fetchIfoPoolFeesData()
  return vaultFees
})

export const fetchIfoPoolUserAndCredit = createAsyncThunk<IfoVaultUser, { account: string }>(
  'ifoPool/fetchUser',
  async ({ account }) => {
    const userData = await fetchIfoPoolUserData(account)
    return userData
  },
)

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolPublicData: (state, action) => {
      const { sousId } = action.payload
      const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
      state.data[poolIndex] = {
        ...state.data[poolIndex],
        ...action.payload.data,
      }
    },
    setPoolUserData: (state, action) => {
      const { sousId } = action.payload
      const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
      state.data[poolIndex].userData = action.payload.data
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
  extraReducers: (builder) => {
    // Vault public data that updates frequently
    builder.addCase(fetchOsVaultPublicData.fulfilled, (state, action: PayloadAction<OsVault>) => {
      state.osVault = { ...state.osVault, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchOsVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.osVault = { ...state.osVault, fees }
    })
    // Vault user data
    builder.addCase(fetchOsVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
      const userData = action.payload
      userData.isLoading = false
      state.osVault = { ...state.osVault, userData }
    })
    // Vault public data that updates frequently
    builder.addCase(fetchIfoPoolPublicData.fulfilled, (state, action) => {
      state.ifoPool = { ...state.ifoPool, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchIfoPoolFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.ifoPool = { ...state.ifoPool, fees }
    })
    // Vault user data
    builder.addCase(fetchIfoPoolUserAndCredit.fulfilled, (state, action) => {
      const userData = action.payload
      userData.isLoading = false
      state.ifoPool = { ...state.ifoPool, userData }
    })
  },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData, setPoolPublicData, setPoolUserData } =
  PoolsSlice.actions

export default PoolsSlice.reducer
