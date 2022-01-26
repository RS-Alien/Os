import React from 'react'
import { Flex, Text } from '@oasisswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceOsBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getOsVaultEarnings } from 'views/Pools/helpers'
import RecentOsProfitBalance from './RecentOsProfitBalance'

const RecentOsProfitCountdownRow = ({ vaultKey }: { vaultKey: VaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { osAtLastUserAction, userShares, lastUserActionTime },
  } = useVaultPoolByKey(vaultKey)
  const osPriceBusd = usePriceOsBusd()
  const { hasAutoEarnings, autoOsToDisplay, autoUsdToDisplay } = getOsVaultEarnings(
    account,
    osAtLastUserAction,
    userShares,
    pricePerFullShare,
    osPriceBusd.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent os profit')}:`}</Text>
      {hasAutoEarnings && (
        <RecentOsProfitBalance
          osToDisplay={autoOsToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentOsProfitCountdownRow
