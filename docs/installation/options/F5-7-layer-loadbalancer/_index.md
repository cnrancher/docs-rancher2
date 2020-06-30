---
title: 配置 F5 作为 Rancher 前端 7 层 LB
description: 本文档基于 `BIGIP-15.0.1-0.0.11.ALL-vmware` 虚拟机版本编写，架构如下图所示。本文讲述了如何配置 F5 作为 Rancher 前端 7 层 LB。
keywords:
  - rancher 2.0中文文档
  - rancher 2.x 中文文档
  - rancher中文
  - rancher 2.0中文
  - rancher2
  - rancher教程
  - rancher中国
  - rancher 2.0
  - rancher2.0 中文教程
  - 安装指南
  - 资料、参考和高级选项
  - 配置 F5 作为 Rancher 前端 7 层 LB
---

## 架构说明

本文档基于 `BIGIP-15.0.1-0.0.11.ALL-vmware` 虚拟机版本编写，架构如下图所示。

![架构图](/img/rancher/F5-7-layer-loadbalancer/architecture.png)

## 代理配置

### 步骤 1：配置健康检查

单击 `Local Traffic`，然后单击 `Monitors` 右侧的 `➕`图标，添加监控。需要修改或新增的参数如下：

- “Name”一栏输名称，下图例子输入的是 http-rancher，对应的是 rancher 的 http 健康检查。
- “Description”一栏输入关于这个健康检查的描述，可跳过，非必填项。
- “Type” 选择类型为 `http`
- “Send String”填写参数为：`GET /healthz \r\n`。

其他参数保持默认即可。单击“Finished”，完成健康检查配置。

![配置健康检查](/img/rancher/F5-7-layer-loadbalancer/health-check-config.jpg)

### 步骤 2：添加节点（可选）

1. 单击 `Local Traffic`，然后单击 `Nodes > Nodes List` 旁边的 `➕`，添加节点。

   ![添加节点1](/img/rancher/F5-7-layer-loadbalancer/add-node-1.jpg)

1. 按照下图示例配置节点信息。请将`Health Monitors` 设置为 `None`。

   ![添加节点2](/img/rancher/F5-7-layer-loadbalancer/add-node-2.jpg)

### 步骤 3：添加节点池

1. 单击 `Local Traffic > Pools > Pool List` 旁边的 `➕`添加节点池。

   ![添加节点池1](/img/rancher/F5-7-layer-loadbalancer/add-pool-1.jpg)

1. 按照下图示例配置节点池。

- 设置节点池名称。
- `Health Monitors` 选择先前创建的健康检查。
- `New Members` 中选择 `Node List`，选择开始添加的节点，单击下方的 `Add`，端口以实际 Rancher 暴露的端口为准。

  ![添加节点池2](/img/rancher/F5-7-layer-loadbalancer/add-pool-2.jpg)

### 步骤 4：添加 irule

1.  单击 `Local Traffic > iRules > iRules List` 旁边的 `➕`，添加 irule。

    ![添加irule1](/img/rancher/F5-7-layer-loadbalancer/irule-1.jpg)

1.  设置 irule 名称，将以下内容复制粘到文本框内。

    ```json
    when HTTP_REQUEST {
      HTTP::header insert “X-Forwarded-Proto” “https”;
      HTTP::header insert “X-Forwarded-Port” 443;
      HTTP::header insert “X-Forwarded-For” [IP::client_addr];
    }
    ```

    ![添加irule2](/img/rancher/F5-7-layer-loadbalancer/irule-2.jpg)

### 步骤 5：添加证书

1. 访问 `system > Certificate Management > Traffic Certificate Management > SSL Certificate List > Import`。

   ![添加证书1](/img/rancher/F5-7-layer-loadbalancer/cert-1.jpg)

1. 选择导入类型为 `key` 和 `certificate`，然后选择导入文件。注意：权威证书会有中间链 CA 证书，所以这里会多一个 CA 证书，如果是自签名证书则可以忽略这个 CA 证书。

   ![添加证书2](/img/rancher/F5-7-layer-loadbalancer/cert-2.jpg)

   ![添加证书3](/img/rancher/F5-7-layer-loadbalancer/cert-3.jpg)

   ![添加证书4](/img/rancher/F5-7-layer-loadbalancer/cert-4.jpg)

## 添加 SSL Profile

1. 单击 `Local Traffic > Profiles > SSL > client` 旁边的 `➕`，添加 SSL Profile。

   ![](https://markdown-1300017440.cos.ap-shanghai.myqcloud.com/mweb/15933288411909.jpg)
   ![添加 SSL Profile1](/img/rancher/F5-7-layer-loadbalancer/SSL-1.jpg)

1. 配置 SSL 相关参数

   - 输入 profile 名称。
   - `Configuration` 选择高级配置，并单击右侧自定义。
   - `Certificate Key Chain` 处单击 `Add`，然后选择对应的证书和私钥。

   ![](https://markdown-1300017440.cos.ap-shanghai.myqcloud.com/mweb/15933288900033.jpg)
   ![添加 SSL Profile2](/img/rancher/F5-7-layer-loadbalancer/SSL-2.jpg)

1. 添加之后

   ![](https://markdown-1300017440.cos.ap-shanghai.myqcloud.com/mweb/15933288984319.jpg)
   ![添加 SSL Profile3](/img/rancher/F5-7-layer-loadbalancer/SSL-3.jpg)

1. 其他参数保持默认即可。

## 配置 Rancher Virtual Servers

1. 单击 `Local Traffic > Virtual Servers > Virtual Server List` 旁边的 `➕`。

1. 配置 `Name`，输入 Server 名称。

1. 保持 `Type` 为默认。

1. 配置 `Source Address` 为 `0.0.0.0/0`。

1. 根据实际情况配置 `Destination Address/Mask`。

1. `Service Port` 设置为 `443/https`。

1. `Configuration` 选择高级。

1. `HTTP Profile (Client)` 设置为 `http`。

1. `SSL Profile (Client)` 选择之前创建的 `SSL Profile`。

1. `WebSocket Profile` 选择 `WebSocket`。

1. `Source Address Translation` 选择 `auto map`。

1. 在 `Resources\iRules` 中选择之前创建 `iRules` 规则。

1. `Default Pool` 选择之前创建的主机池。

完成配置如下图所示：

![配置 Rancher Virtual Servers1](/img/rancher/F5-7-layer-loadbalancer/Virtual-Server-1.jpg)

![配置 Rancher Virtual Servers2](/img/rancher/F5-7-layer-loadbalancer/Virtual-Server-2.jpg)

![配置 Rancher Virtual Servers3](/img/rancher/F5-7-layer-loadbalancer/Virtual-Server-3.jpg)

![配置 Rancher Virtual Servers4](/img/rancher/F5-7-layer-loadbalancer/Virtual-Server-4.jpg)

![配置 Rancher Virtual Servers5](/img/rancher/F5-7-layer-loadbalancer/Virtual-Server-5.jpg)

## HTTP 重定向到 HTTPS

单击 `Local Traffic > Virtual Servers > Virtual Server List` 旁边的 `➕`，按照以下描述配置参数：

1. 配置 `Name`。
1. 保持 `Type` 为默认。
1. 配置 `Source Address` 为 `0.0.0.0/0`。
1. 根据实际情况配置 `Destination Address/Mask`。
1. `Service Port` 设置为 `80/http`。
1. `Configuration` 选择基础。
1. `HTTP Profile (Client)` 设置为 `http`。
1. 在`Resources\iRules` 中选择 `_sys_https_redirect`。
