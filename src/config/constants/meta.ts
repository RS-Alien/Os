import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'OasisSwap',
  description:
    'The most popular AMM on BSC by user count! Earn OS through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by OasisSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://OasisSwap.io/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/Oasis-squad')) {
    basePath = '/Oasis-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('OasisSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('OasisSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('OasisSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('OasisSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('OasisSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('OasisSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('OasisSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('OasisSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('OasisSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('OasisSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('OasisSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('OasisSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('OasisSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('OasisSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('OasisSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('OasisSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('OasisSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('OasisSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('OasisSwap Info & Analytics')}`,
        description: 'View statistics for OasisSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('OasisSwap Info & Analytics')}`,
        description: 'View statistics for OasisSwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('OasisSwap Info & Analytics')}`,
        description: 'View statistics for OasisSwap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('OasisSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('OasisSwap')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('OasisSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('OasisSwap')}`,
      }
    case '/Oasis-squad':
      return {
        title: `${t('Oasis Squad')} | ${t('OasisSwap')}`,
      }
    default:
      return null
  }
}
