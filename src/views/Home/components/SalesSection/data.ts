import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on Binance Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.oasisswap.finance/',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
     // { src: 'OS', alt: 'ROSE token' },
     // { src: 'OS', alt: 'BTC token' },
      { src: 'OS', alt: 'OS token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Earn passive income with crypto.',
  bodyText: 'OasisSwap makes it easy to make your crypto work for you.',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.oasisswap.io/products/yield-farming',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: 'Pie chart' },
      { src: 'stonks', alt: 'Stocks chart' },
     // { src: 'folder', alt: 'Folder with OS token' },
    ],
  },
}

export const osSectionData: SalesSectionProps = {
  headingText: 'OS makes our world go round.',
  bodyText:
    'OS token is at the heart of the OasisSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    text: 'Buy OS',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.oasisswap.finance/tokenomics/OS',
    text: 'Learn',
    external: true,
  },

  images: {
    path: '/images/home/OS/',
    attributes: [
      { src: 'bottom-right', alt: 'Small 3d oasisswap' },
      { src: 'top-right', alt: 'Small 3d oasisswap' },
      { src: 'coin', alt: 'OS token' },
      { src: 'top-left', alt: 'Small 3d oasisswap' },
    ],
  },
}
