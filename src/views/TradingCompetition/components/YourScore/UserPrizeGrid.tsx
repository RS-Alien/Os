import { BlockIcon, CheckmarkCircleIcon, Flex, Image, Skeleton, Text } from '@oasisswap/uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'
import { getRewardGroupAchievements, useCompetitionRewards } from '../../helpers'
import { UserTradingInformationProps } from '../../types'
import { BoldTd, StyledPrizeTable, Td } from '../StyledPrizeTable'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const UserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const {
    userRewardGroup,
    userOsRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
    userPointReward,
    canClaimNFT,
  } = userTradingInformation
  const { osReward, lazioReward, portoReward, santosReward, dollarValueOfTokensReward } = useCompetitionRewards({
    userOsRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
  })

  const achievement = getRewardGroupAchievements(userRewardGroup, userPointReward)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('Token Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{osReward.toFixed(4)} OS</Text>
              <Text bold>{lazioReward.toFixed(4)} LAZIO</Text>
              <Text bold>{portoReward.toFixed(4)} PORTO</Text>
              <Text bold>{santosReward.toFixed(4)} SANTOS</Text>
              {dollarValueOfTokensReward !== null ? (
                <Text fontSize="12px" color="textSubtle">
                  ~{dollarValueOfTokensReward.toFixed(2)} USD
                </Text>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              <Image src={`/images/achievements/${achievement.image}`} width={25} height={25} />
              <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
                + {userPointReward} {t('Points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default UserPrizeGrid
