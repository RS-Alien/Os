import { ContextApi } from 'contexts/Localization/types'

const config = (t: ContextApi['t']) => {
  return [
    {
      title: t('I sold an NFT, where’s my ROSE?'),
      description: [
        t(
          'Trades are settled in WROSE, which is a wrapped version of ROSE used on Binance Smart Chain. That means that when you sell an item, WROSE is sent to your wallet instead of ROSE.',
        ),
        t('You can instantly swap your WROSE for ROSE with no trading fees on OasisSwap.'),
      ],
    },
    {
      title: t('When can I trade other NFT Collections?'),
      description: [
        t(
          'Soon! The current NFT Market is a basic version (phase 1), with early access to trading OasisSwap NFTs only.',
        ),
        t('Other collections will be coming soon. We’ll make an announcement soon about the launch of the V2 Market.'),
      ],
    },
    {
      title: t('How can I list my NFT collection on the Market?'),
      description: [
        t('In Phase 2 of the NFT Marketplace, collections must be whitelisted before they may be listed.'),
        t(
          'We are now accepting applications from NFT collection owners seeking to list their collections. Please apply here: https://docs.OasisSwap.finance/contact-us/nft-market-applications',
        ),
      ],
    },
    {
      title: t('What are the fees?'),
      description: [
        t(
          '100% of all platform fees taken by OasisSwap from sales are used to buy back and BURN OS tokens in our weekly OS burns.',
        ),
        t(
          'Platform fees: 2% is subtracted from NFT sales on the market. Subject to change.Collection fees: Additional fees may be taken by collection creators, once those collections are live. These will not contribute to the OS burns.',
        ),
      ],
    },
  ]
}

export default config
