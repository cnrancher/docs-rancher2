# Rancher 2.x 中文文档 （WIP）

本网站使用了 [Docusaurus 2](https://v2.docusaurus.io/) 文档框架。

## 如何开发？

### 准备

确保你的开发环境有如下软件：

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) 10.9.0+ (with NPM)
* [Yarn](https://yarnpkg.com/en/docs/install) 1.5+

### 安装

如果在国内，yarn install速度很慢，可以的配置淘宝Registry。

``` 
$ yarn config set registry https://registry.npm.taobao.org -g
```

安装初始化

``` 
$ git clone 'https://github.com/cnrancher/docs-rancher2'
$ cd 'docs-rancher2'
$ yarn install
```

### 本地启动

``` 
$ yarn start
```

将在浏览器中自动打开http://localhost:3000/

### 构建

``` 
$ yarn build
```

