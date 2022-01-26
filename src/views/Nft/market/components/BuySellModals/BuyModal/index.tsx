import React, { useEffect, useState } from 'react'
import { InjectedModalProps } from '@oasisswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance, { useGetRoseBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import tokens from 'config/constants/tokens'
import { parseUnits, formatEther } from '@ethersproject/units'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionConfirmed from '../shared/TransactionConfirmed'

const modalTitles = {
  [BuyingStage.REVIEW]: 'Review',
  [BuyingStage.APPROVE_AND_CONFIRM]: 'Back',
  [BuyingStage.CONFIRM]: 'Back',
  [BuyingStage.TX_CONFIRMED]: 'Transaction Confirmed',
}

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const BuyModal: React.FC<BuyModalProps> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.ROSE)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useWeb3React()
  const wroseContract = useERC20(tokens.wrose.address)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy.marketData.currentAskPrice, 'ether')
  const nftPrice = parseFloat(nftToBuy.marketData.currentAskPrice)

  // ROSE - returns ethers.BigNumber
  const { balance: roseBalance, fetchStatus: roseFetchStatus } = useGetRoseBalance()
  const formattedRoseBalance = parseFloat(formatEther(roseBalance))
  // WROSE - returns BigNumber
  const { balance: wroseBalance, fetchStatus: wroseFetchStatus } = useTokenBalance(tokens.wrose.address)
  const formattedWroseBalance = getBalanceNumber(wroseBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.ROSE ? formattedRoseBalance : formattedWroseBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.ROSE ? roseFetchStatus : wroseFetchStatus

  const notEnoughRoseForPurchase =
    paymentCurrency === PaymentCurrency.ROSE
      ? roseBalance.lt(nftPriceWei)
      : wroseBalance.lt(ethersToBigNumber(nftPriceWei))

  useEffect(() => {
    if (roseBalance.lt(nftPriceWei) && wroseBalance.gte(ethersToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WROSE)
      setIsPaymentCurrentInitialized(true)
    }
  }, [roseBalance, wroseBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const currentAllowance = await wroseContract.allowance(account, nftMarketContract.address)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return callWithGasPrice(wroseContract, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WROSE!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice) ? BigNumber.from(0) : parseUnits(nftToBuy.marketData.currentAskPrice)
      if (paymentCurrency === PaymentCurrency.ROSE) {
        return callWithGasPrice(nftMarketContract, 'buyTokenUsingROSE', [nftToBuy.collectionAddress, nftToBuy.tokenId], {
          value: payAmount,
        })
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWROSE', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WROSE && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={t(modalTitles[stage])}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughRoseForPurchase={notEnoughRoseForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
