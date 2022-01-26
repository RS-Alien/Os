import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getActivePools } from 'utils/calls'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  verificationHash: string
  osBalance: number
  osVaultBalance: number
  osPoolBalance: number
  poolsBalance: number
  osRoseLpBalance: number
  ifoPoolBalance: number
  total: number
}

const initialState: State = {
  verificationHash: null,
  osBalance: 0,
  osVaultBalance: 0,
  osPoolBalance: 0,
  poolsBalance: 0,
  osRoseLpBalance: 0,
  ifoPoolBalance: 0,
  total: 0,
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean } => {
  const { account } = useWeb3React()
  const [votingPower, setVotingPower] = useState(initialState)
  const [isLoading, setIsLoading] = useState(!!account)

  useEffect(() => {
    const fetchVotingPower = async () => {
      setIsLoading(true)

      try {
        const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
        const eligiblePools = await getActivePools(blockNumber)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
        const {
          osBalance,
          osRoseLpBalance,
          osPoolBalance,
          total,
          poolsBalance,
          osVaultBalance,
          verificationHash,
          IFOPoolBalance,
        } = await getVotingPower(account, poolAddresses, blockNumber)

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            verificationHash,
            osBalance: parseFloat(osBalance),
            osRoseLpBalance: parseFloat(osRoseLpBalance),
            osPoolBalance: parseFloat(osPoolBalance),
            poolsBalance: parseFloat(poolsBalance),
            osVaultBalance: parseFloat(osVaultBalance),
            ifoPoolBalance: IFOPoolBalance ? parseFloat(IFOPoolBalance) : 0,
            total: parseFloat(total),
          }))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (account && isActive) {
      fetchVotingPower()
    }
  }, [account, block, setVotingPower, isActive, setIsLoading])

  return { ...votingPower, isLoading }
}

export default useGetVotingPower
