import { VaultKey } from 'state/types'
import tokens, { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

export const vaultPoolConfig = {
  [VaultKey.OsVault]: {
    name: 'Auto OS',
    description: 'Automatic restaking',
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/${tokens.os.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO OS',
    description: 'Stake OS to participate in IFOs',
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${tokens.os.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

const pools: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.os,
    contractAddress: {
      42261: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      42262: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 258,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.fuse,
    contractAddress: {
      42261: '',
      42262: '0xeAd7b8fc5F2E5672FAe9dCf14E902287F35CB169',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.19',
  },
  {
    sousId: 257,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.froyo,
    contractAddress: {
      42261: '',
      42262: '0x1c9E3972fdBa29b40954Bb7594Da6611998F8830',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '2.893',
  },
  {
    sousId: 256,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.aog,
    contractAddress: {
      42261: '',
      42262: '0xa34832efe74133763A85060a64103542031B0A7E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.6435',
  },
  {
    sousId: 255,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.apx,
    contractAddress: {
      42261: '',
      42262: '0x92c07c325cE7b340Da2591F5e9CbB1F5Bab73FCF',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '3.035',
  },
  {
    sousId: 254,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.bcoin,
    contractAddress: {
      42261: '',
      42262: '0x25ca61796d786014ffe15e42ac11c7721d46e120',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.1493',
  },
  {
    sousId: 253,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.bcoin,
    contractAddress: {
      42261: '',
      42262: '0xad8F6A9d58012DCa2303226B287E80e5fE27eff0',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.1493',
  },
  {
    sousId: 252,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.insur,
    contractAddress: {
      42261: '',
      42262: '0x1A777aE604CfBC265807A46Db2d228d4CC84E09D',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.3281',
  },
  {
    sousId: 251,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.gm,
    contractAddress: {
      42261: '',
      42262: '0x09e727c83a75fFdB729280639eDBf947dB76EeB7',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '7893',
  },
  {
    sousId: 250,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.woop,
    contractAddress: {
      42261: '',
      42262: '0x2718D56aE2b8F08B3076A409bBF729542233E451',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '1.226',
  },
  {
    sousId: 249,
    stakingToken: serializedTokens.os,
    earningToken: serializedTokens.high,
    contractAddress: {
      42261: '',
      42262: '0x2461ea28907A2028b2bCa40040396F64B4141004',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.02679',
  },
  
]

export default pools
