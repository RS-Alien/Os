import React from 'react'
import styled from 'styled-components'
import { Modal, Box, Flex, Text, BinanceIcon, Input } from '@oasisswap/uikit'
import { useROSEBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { SellingStage } from './types'

export const stagesWithBackButton = [
  SellingStage.SET_PRICE,
  SellingStage.ADJUST_PRICE,
  SellingStage.APPROVE_AND_CONFIRM_SELL,
  SellingStage.CONFIRM_ADJUST_PRICE,
  SellingStage.REMOVE_FROM_MARKET,
  SellingStage.CONFIRM_REMOVE_FROM_MARKET,
  SellingStage.TRANSFER,
  SellingStage.CONFIRM_TRANSFER,
]

export const StyledModal = styled(Modal)<{ stage: SellingStage }>`
  width: 360px;
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `color: ${theme.colors.textSubtle}` : null)};
  }
  & svg:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `fill: ${theme.colors.textSubtle}` : null)};
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
`

interface RoseAmountCellProps {
  roseAmount: number
}

export const RoseAmountCell: React.FC<RoseAmountCellProps> = ({ roseAmount }) => {
  const roseBusdPrice = useROSEBusdPrice()
  if (!roseAmount || roseAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <BinanceIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(roseBusdPrice, roseAmount)
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BinanceIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${roseAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}

interface FeeAmountCellProps {
  roseAmount: number
  creatorFee: number
  tradingFee: number
}

export const FeeAmountCell: React.FC<FeeAmountCellProps> = ({ roseAmount, creatorFee, tradingFee }) => {
  if (!roseAmount || roseAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <BinanceIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }

  const totalFee = creatorFee + tradingFee
  const totalFeeAsDecimal = totalFee / 100
  const feeAmount = roseAmount * totalFeeAsDecimal
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BinanceIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${feeAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 6,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        ({totalFee}%)
      </Text>
    </Flex>
  )
}
