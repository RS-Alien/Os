import React, { useState } from 'react'
import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@oasisswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useOs } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useProfile } from 'state/profile/hooks'
import { getOasisswapProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from 'utils/formatBalance'
import useGetProfileCosts from 'views/Nft/market/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveOsPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveOsPage: React.FC<ApproveOsPageProps> = ({ goToChange, onDismiss }) => {
  const [isApproving, setIsApproving] = useState(false)
  const { profile } = useProfile()
  const { t } = useTranslation()
  const {
    costs: { numberOsToUpdate, numberOsToReactivate },
  } = useGetProfileCosts()
  const osContract = useOs()
  const { toastError } = useToast()
  const cost = profile.isActive ? numberOsToUpdate : numberOsToReactivate

  const handleApprove = async () => {
    const tx = await osContract.approve(getOasisswapProfileAddress(), cost.mul(2).toString())
    setIsApproving(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      goToChange()
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsApproving(false)
    }
  }

  if (!profile) {
    return null
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} OS</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveOsPage
