import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import osABI from 'config/abi/os.json'
import wroseABI from 'config/abi/weth.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getSouschefV2Contract } from 'utils/contractHelpers'
import tokens from 'config/constants/tokens'
import chunk from 'lodash/chunk'
import sousChefV2 from '../../config/abi/sousChefV2.json'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const startEndBlockCalls = poolsWithEnd.flatMap((poolConfig) => {
    return [
      {
        address: getAddress(poolConfig.contractAddress),
        name: 'startBlock',
      },
      {
        address: getAddress(poolConfig.contractAddress),
        name: 'bonusEndBlock',
      },
    ]
  })

  const startEndBlockRaw = await multicall(sousChefABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return poolsWithEnd.map((osPoolConfig, index) => {
    const [startBlock, endBlock] = startEndBlockResult[index]
    return {
      sousId: osPoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonRosePools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'ROSE')
  const rosePool = poolsConfig.filter((p) => p.stakingToken.symbol === 'ROSE')

  const callsNonRosePools = nonRosePools.map((poolConfig) => {
    return {
      address: poolConfig.stakingToken.address,
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsRosePools = rosePool.map((poolConfig) => {
    return {
      address: tokens.wrose.address,
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonRosePoolsTotalStaked = await multicall(osABI, callsNonRosePools)
  const rosePoolsTotalStaked = await multicall(wroseABI, callsRosePools)

  return [
    ...nonRosePools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonRosePoolsTotalStaked[index]).toJSON(),
    })),
    ...rosePool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(rosePoolsTotalStaked[index]).toJSON(),
    })),
  ]
}

export const fetchPoolStakingLimit = async (sousId: number): Promise<BigNumber> => {
  try {
    const sousContract = getSouschefV2Contract(sousId)
    const hasUserLimit = await sousContract.hasUserLimit()
    if (hasUserLimit) {
      const stakingLimit = await sousContract.poolLimitPerUser()
      return new BigNumber(stakingLimit.toString())
    }
    return BIG_ZERO
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = poolsConfig
    .filter((p) => p.stakingToken.symbol !== 'ROSE' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map((validPool) => {
      const contractAddress = getAddress(validPool.contractAddress)
      return ['hasUserLimit', 'poolLimitPerUser'].map((method) => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const poolStakingResultRaw = await multicallv2(sousChefV2, poolStakingCalls, { requireSuccess: false })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return poolStakingChunkedResultRaw.reduce((accum, stakingLimitRaw, index) => {
    const hasUserLimit = stakingLimitRaw[0]
    const stakingLimit = hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}
