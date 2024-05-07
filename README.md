# Rancher 中文文档

Rancher 中文文档，包括Rancher1.x、Rancher 2.x、RKE、K3s、Octopus、Harvester和 RKE2的中文文档，其中Rancher1.x的文档已经不再维护；Rancher 2.x、RKE、K3s、Octopus、Harvester和 RKE2的中文文档会定期刷新。

本网站使用了 [Docusaurus 2](https://v2.docusaurus.io/) 文档框架。

## 如何开发？

### 准备

确保您的开发环境有如下软件：

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) 10.9.0+ (with NPM)
* [Yarn](https://yarnpkg.com/en/docs/install) 1.5+

### 安装

如果yarn install的速度很慢，可以尝试配置淘宝Registry。

```bash
$ yarn config set registry https://registry.npmmirror.com -g
```

安装初始化

```bash
$ git clone 'https://github.com/cnrancher/docs-rancher2'
$ cd 'docs-rancher2'
$ yarn install
```

### 本地启动

```bash
$ yarn start
```

将在浏览器中自动打开http://localhost:3000/

### 构建

```bash
$ yarn build
```

