import BigNumber from 'bignumber.js'
import { getOsVaultContract } from 'utils/contractHelpers'

const osVaultContract = getOsVaultContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await osVaultContract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      osAtLastUserAction: new BigNumber(userContractResponse.osAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      osAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
