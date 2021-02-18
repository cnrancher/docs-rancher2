---
title: ETCD 数据压缩
description: etcd默认不会自动进行数据压缩，etcd保存了keys的历史信息，数据频繁的改动会导致数据版本越来越多，相对应的数据库就会越来越大。etcd数据库大小默认2GB，当在etcd容器或者rancher ui出现以下日志时，说明数据库空间占满，需要进行数据压缩腾出空间。
keywords:
  - rancher
  - rancher中文
  - rancher中文文档
  - rancher官网
  - rancher文档
  - Rancher
  - rancher 中文
  - rancher 中文文档
  - rancher cn
  - 集群管理员指南
  - 集群访问控制
  - ETCD数据压缩
---

## 概述

etcd 默认不会自动进行数据压缩，etcd 保存了 keys 的历史信息，数据频繁的改动会导致数据版本越来越多，相对应的数据库就会越来越大。etcd 数据库大小默认 2GB，当在 etcd 容器或者 rancher ui 出现以下日志时，说明数据库空间占满，需要进行数据压缩，腾出空间。

```bash
Error from server: etcdserver: mvcc: database space exceeded
```

## 操作步骤

1. 登录 etcd 容器

   在 etcd 主机上，执行以下命令登录 etcd 容器

   ```bash
   docker exec -ti etcd sh
   ```

2. 获取历史版本号:

   在 etcd 容器执行以下命令

   ```bash
   ver=$(etcdctl endpoint status --write-out="json" | egrep -o '"revision":[0-9]*' | egrep -o '[0-9].*')
   ```

3. 压缩旧版本

   ```bash
   etcdctl compact $ver
   ```

4. 清理碎片

   ```bash
   etcdctl defrag
   ```

   > 您需要在每个 etcd 容器中执行步骤 2~步骤 4。

5. 忽略 etcd 告警

   通过执行`etcdctl alarm list`可以查看 etcd 的告警情况，如果存在告警，即使释放了 etcd 空间，etcd 也处于只读状态。

   在确定以上的操作均执行完毕后，在任意一个 etcd 容器中执行以下命令忽略告警:

   ```bash
   etcdctl alarm disarm
   ```
