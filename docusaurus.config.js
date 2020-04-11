const sidebars = require('./sidebars');
const metadata = require('./metadata');

module.exports = {
  title: 'Rancher 2.x',
  tagline: 'Run Kubernetes Everywhere',
  baseUrl: '/',
  url: 'https://www.rancher.cn',
  favicon: 'img/favicon.ico',
  themeConfig: {
    navbar: {
      title: 'Rancher 2.x',
      logo: {
        alt: 'Rancher Logo',
        src: 'img/rancher-logo-cow-white.svg'
      },
      links: [
        { to: 'docs/overview/_index', label: '帮助文档', position: 'left' },
        {
          href: 'https://docs.rancher.cn/',
          label: '文档中心',
          position: 'left'
        },
        {
          href: 'https://www.rancher.cn/support/',
          label: '技术支持',
          position: 'left'
        },
        {
          href: 'https://www.rancher.cn/weixin/',
          label: '微信交流群',
          position: 'left'
        },
        {
          href: 'https://www.rancher.cn/',
          label: '中国官网',
          position: 'right'
        },
        {
          href: 'https://www.rancher.com/',
          label: '美国官网',
          position: 'right'
        },
        {
          href: 'https://github.com/rancher/rancher',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    algolia: {
      apiKey: 'f790c2168867f49bb212aee8c224116d',
      indexName: 'rancher'
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Rancher Labs, Inc. All Rights Reserved. 粤ICP备16086305号`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/cnrancher/docs-rancher2/edit/dev/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  customFields: {
    sidebars,
    metadata,
    stable: '版本说明 - v2.3.5',
    baseCommit: 'b9fac34736609764c47636f5e20f81441e3698e5 - Apr 11, 2020'
  }
};
