import BigNumber from 'bignumber.js'
import { convertSharesToOs } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import osVaultAbi from 'config/abi/osVault.json'
import { getOsVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestOsRewards',
      'calculateTotalPendingOsRewards',
    ].map((method) => ({
      address: getOsVaultAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedOsBountyReward], [totalPendingOsHarvest]] = await multicallv2(
      osVaultAbi,
      calls,
    )

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalOsInVaultEstimate = convertSharesToOs(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalOsInVault: totalOsInVaultEstimate.osAsBigNumber.toJSON(),
      estimatedOsBountyReward: new BigNumber(estimatedOsBountyReward.toString()).toJSON(),
      totalPendingOsHarvest: new BigNumber(totalPendingOsHarvest.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalOsInVault: null,
      estimatedOsBountyReward: null,
      totalPendingOsHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getOsVaultAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(osVaultAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
