import { FooterLinkType } from '@oasisswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.oasisswap.io/contact-us',
      },
      {
        label: t('Brand'),
        href: 'https://docs.oasisswap.io/brand',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/oasisswap',
      },
      {
        label: t('Community'),
        href: 'https://docs.oasisswap.io/contact-us/telegram',
      },
      {
        label: t('OS token'),
        href: 'https://docs.oasisswap.io/tokenomics/os',
      },
      {
        label: '—',
      },
      {
        label: t('Online Store'),
        href: 'https://oasisswap.creator-spring.com/',
        isHighlighted: true,
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://docs.oasisswap.io/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://docs.oasisswap.io/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://docs.oasisswap.io/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/oasisswap',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.oasisswap.io',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://docs.oasisswap.io/code/bug-bounty',
      },
      {
        label: t('Audits'),
        href: 'https://docs.oasisswap.io/help/faq#is-oasisswap-safe-has-oasisswap-been-audited',
      },
      {
        label: t('Careers'),
        href: 'https://docs.oasisswap.io/hiring/become-a-chef',
      },
    ],
  },
]
