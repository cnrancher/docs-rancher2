const sidebars = require('./sidebars');

module.exports = {
  title: 'Rancher 2.3',
  tagline: 'Run Kubernetes Everywhere',
  baseUrl: '/',
  url: 'https://www.rancher.cn',
  favicon: 'img/favicon.ico',
  themeConfig: {
    navbar: {
      title: 'Rancher 2.3',
      logo: {
        alt: 'Rancher Logo',
        src: 'img/rancher-logo-cow-white.svg'
      },
      links: [
        { to: 'docs/overview/_index', label: '帮助文档', position: 'left' },
        { to: 'docs/api-docs/how-to-use', label: 'API 文档', position: 'left' },
        { to: 'docs/api-docs/how-to-use', label: '文档下载', position: 'left' },
        { to: 'docs/api-docs/how-to-use', label: '历史文档', position: 'left' },
        {
          to: 'docs/api-docs/how-to-use',
          label: '微信交流群',
          position: 'right'
        },
        {
          to: 'docs/api-docs/how-to-use',
          label: '官方网站',
          position: 'right'
        },
        {
          to: 'docs/api-docs/how-to-use',
          label: '免费培训',
          position: 'right'
        },
        {
          to: 'docs/support/rancher-support',
          label: '付费支持',
          position: 'right'
        },
        {
          href: 'https://github.com/rancher/rancher',
          label: 'GitHub',
          position: 'right'
        }
      ]
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
          sidebarPath: require.resolve('./metadata.js')
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  customFields: {
    sidebars,
    stable: '版本说明 - v2.3.4'
  }
};
