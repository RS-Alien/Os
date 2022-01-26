import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'OS',
    lpAddresses: {
      42261: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      42262: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 251,
    lpSymbol: 'OS-ROSE LP',
    lpAddresses: {
      42261: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      42262: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: serializedTokens.os,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 252,
    lpSymbol: 'BUSD-ROSE LP',
    lpAddresses: {
      42261: '',
      42262: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wrose,
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  {
    pid: 505,
    lpSymbol: 'FUSE-ROSE LP',
    lpAddresses: {
      42261: '',
      42262: '0x6483F166b9E4310A165a55FEa04F867499aded06',
    },
    token: serializedTokens.fuse,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 386,
    lpSymbol: 'HOTCROSS-ROSE LP',
    lpAddresses: {
      42261: '',
      42262: '0xf23bad605e94de0e3b60c9718a43a94a5af43915',
    },
    token: serializedTokens.hotcross,
    quoteToken: serializedTokens.wrose,
    isCommunity: true,
  },
  {
    pid: 504,
    lpSymbol: 'PRL-BUSD LP',
    lpAddresses: {
      42261: '',
      42262: '0xb5FEAE037c2330a8F298F39bcE96dd6E69f4Fa0E',
    },
    token: serializedTokens.prl,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 498,
    lpSymbol: '8PAY-BUSD LP',
    lpAddresses: {
      42261: '',
      42262: '0x92c3E2cddDb0CE886bCA864151BD4d611A86E563',
    },
    token: serializedTokens['8pay'],
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 503,
    lpSymbol: 'FROYO-ROSE LP',
    lpAddresses: {
      42261: '',
      42262: '0x1Ce76390Dd210B9C9ae28373FDf79714206ECb73',
    },
    token: serializedTokens.froyo,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 497,
    lpSymbol: 'AOG-BUSD LP',
    lpAddresses: {
      42261: '',
      42262: '0x88c9bf5E334e2591C6A866D5E20683E31226Be3d',
    },
    token: serializedTokens.aog,
    quoteToken: serializedTokens.busd,
    isCommunity: false,
  },
  {
    pid: 502,
    lpSymbol: 'APX-BUSD',
    lpAddresses: {
      42261: '',
      42262: '0xa0ee789a8f581cb92dd9742ed0b5d54a0916976c',
    },
    token: serializedTokens.apx,
    quoteToken: serializedTokens.busd,
  },
  /*
  {
    pid: 501,
    lpSymbol: 'BCOIN-ROSE',
    lpAddresses: {
      97: '',
      56: '0x2Eebe0C34da9ba65521E98CBaA7D97496d05f489',
    },
    token: serializedTokens.bcoin,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 500,
    lpSymbol: 'INSUR-ROSE',
    lpAddresses: {
      97: '',
      56: '0xD01bf29EdCA0285A004a25e325A449ba56e5926E',
    },
    token: serializedTokens.insur,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 499,
    lpSymbol: 'BATH-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xEE90C67C9dD5dE862F4eabFDd53007a2D95Df5c6',
    },
    token: serializedTokens.bath,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 496,
    lpSymbol: 'GM-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x1C640a98a0c62120B0AD23C15FfF8dC1a2Fb9C4D',
    },
    token: serializedTokens.gm,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 495,
    lpSymbol: 'WOOP-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x2AE94A6C768D59f5DDc25bd7f12C7cBE1D51dc04',
    },
    token: serializedTokens.woop,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 492,
    lpSymbol: 'SDAO-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x43b95976cF0929478bC13332C9cd2D63Bf060976',
    },
    token: serializedTokens.sdao,
    quoteToken: serializedTokens.wrose,
    isCommunity: true,
  },
  {
    pid: 493,
    lpSymbol: 'ANTEX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x4DcB7b3b0E8914DC0e6D366521604cD23E7991E1',
    },
    token: serializedTokens.antex,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 494,
    lpSymbol: 'BBT-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x3D5A3E3824da092851026fCda3D8a0B7438c4573',
    },
    token: serializedTokens.bbt,
    quoteToken: serializedTokens.wrose,
    isCommunity: true,
  },
  {
    pid: 491,
    lpSymbol: 'HIGH-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xe98ac95A1dB2fCaaa9c7D4ba7ecfCE4877ca2bEa',
    },
    token: serializedTokens.high,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 490,
    lpSymbol: 'CCAR-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x845d301C864d48027DB73ec4394e6DDBE52Cbc39',
    },
    token: serializedTokens.ccar,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 489,
    lpSymbol: 'DPT-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x141e9558f66Cc21c93628400cCa7d830c15c2c24',
    },
    token: serializedTokens.dpt,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 488,
    lpSymbol: 'THG-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x486697ae24469cB1122F537924Aa46E705B142Aa',
    },
    token: serializedTokens.thg,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 485,
    lpSymbol: 'TT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6DA32849Fc5E1c23894d9E08166912F15bDb2E95',
    },
    token: serializedTokens.tt,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 486,
    lpSymbol: 'GMEE-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x6a24a877bb7D07fba59397DecBBAED5F92890AeA',
    },
    token: serializedTokens.gmee,
    quoteToken: serializedTokens.wrose,
    isCommunity: true,
  },
  {
    pid: 487,
    lpSymbol: 'HTD-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x0c3b12fCA25bfa840E0553DA97C532e9Abd3913d',
    },
    token: serializedTokens.htd,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 484,
    lpSymbol: 'IDIA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x71E6de81381eFE0Aa98f56b3B43eB3727D640715',
    },
    token: serializedTokens.idia,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 483,
    lpSymbol: 'XCV-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xD39F05AB936Aa201235005c47B83268f2d9833f8',
    },
    token: serializedTokens.xcv,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 482,
    lpSymbol: 'NABOX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x29b4abb0f8734EA672a0e82FA47998F710B6A07a',
    },
    token: serializedTokens.nabox,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 481,
    lpSymbol: 'SANTOS-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x06043B346450BbCfdE066ebc39fdc264FdFFeD74',
    },
    token: serializedTokens.santos,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 480,
    lpSymbol: 'QUIDD-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0xD6d206F59cC5a3BfA4Cc10bc8Ba140ac37Ad1C89',
    },
    token: serializedTokens.quidd,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 479,
    lpSymbol: 'ZOO-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x85e5889Fc3Ed01B4e8B56bbc717D7643294d2c31',
    },
    token: serializedTokens.zoo,
    quoteToken: serializedTokens.wrose,
  },
  {
    pid: 450,
    lpSymbol: 'SFUND-ROSE LP',
    lpAddresses: {
      97: '',
      56: '0x74fA517715C4ec65EF01d55ad5335f90dce7CC87',
    },
    token: serializedTokens.sfund,
    quoteToken: serializedTokens.wrose,
  }, */
  
]

export default farms
