const sidebars = require("./sidebars");
const metadata = require("./metadata");

module.exports = {
    title: "Rancher文档",
    tagline: "Run Kubernetes Everywhere",
    baseUrl: "/",
    url: "https://www.rancher.cn",
    favicon: "img/favicon.ico",
    themeConfig: {
        algoliasearch: {
            trackingID: "692a488c8d0d137240f1a940bde32441",
            changefreq: "weekly",
            priority: 0.5,
            trailingSlash: false,
        },
        hideableSidebar: true,
        prism: {
            defaultLanguage: "bash",
        },
        baiduAnalytics: {
            trackingID: "692a488c8d0d137240f1a940bde32441",
        },
        navbar: {
            title: "Rancher",
            logo: {
                alt: "Rancher Logo",
                src: "img/rancher-logo-cow-white.svg",
            },
            items: [
                {
                    href: "https://docs.rancher.cn/",
                    label: "文档中心",
                    position: "left",
                },
                { to: "pdf", label: "获取 PDF 文档", position: "left" },
                {
                    href: "https://www.rancher.cn/weixin/",
                    label: "微信",
                    position: "left",
                },
                {
                    href: "https://www.rancher.cn/",
                    label: "中国官网",
                    position: "right",
                },
                {
                    href: "https://forums.cnrancher.com/",
                    label: "中文论坛",
                    position: "right",
                },
                {
                    href:
                        "https://www.suse.com/suse-rancher/support-matrix/all-supported-versions/",
                    label: "支持矩阵",
                    position: "right",
                },
                {
                    href: "https://www.rancher.cn/support/",
                    label: "技术支持",
                    position: "right",
                },
                {
                    href: "https://github.com/rancher/rancher",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        algolia: {
            apiKey: "f790c2168867f49bb212aee8c224116d",
            indexName: "rancher",
        },
        footer: {
            style: "dark",
            copyright: `Copyright © ${new Date().getFullYear()} Rancher Labs, Inc. All Rights Reserved. 粤ICP备16086305号`,
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl:
                        "https://github.com/cnrancher/docs-rancher2/edit/master/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
    customFields: {
        sidebars,
        metadata,
        stable: "版本说明 - v2.5.12",
        baseCommit: "cd9ed7b74cc8111fecb05d2950c6948a83a6a595 - Jan 8, 2022",
        k3sBaseCommit: "cd9ed7b74cc8111fecb05d2950c6948a83a6a595 - Jan 6, 2022",
        rke2Commit: "dc2e93e6d3caacf544cb417e1106eaf581f9e062 - Jan 6, 2022",
        rancherdesktopCommit:
            "e97751d3fad48bee09c74953b9d698638fd3e1c7 - Jan 28, 2022",
    },
    plugins: ["@docusaurus/plugin-baidu-analytics"],
};
