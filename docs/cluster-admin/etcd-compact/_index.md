---
title: ETCD数据压缩
description: etcd默认不会自动进行数据压缩，etcd保存了keys的历史信息，数据频繁的改动会导致数据版本越来越多，相对应的数据库就会越来越大。etcd数据库大小默认2GB，当在etcd容器或者rancher ui出现以下日志时，说明数据库空间占满，需要进行数据压缩腾出空间。
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
  - 集群管理员指南
  - 集群访问控制
  - ETCD数据压缩
---

etcd默认不会自动进行数据压缩，etcd保存了keys的历史信息，数据频繁的改动会导致数据版本越来越多，相对应的数据库就会越来越大。etcd数据库大小默认2GB，当在etcd容器或者rancher ui出现以下日志时，说明数据库空间占满，需要进行数据压缩腾出空间。

```bash
Error from server: etcdserver: mvcc: database space exceeded
```

## 释放空间

1. 登录etcd容器

    在etcd主机上，执行以下命令登录etcd容器

    ```bash
    docker exec -ti etcd sh
    ```

2. 获取历史版本号:

    在etcd容器执行以下命令

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

    > 以上2-4步，操作需在每个etcd容器中执行。

5. 忽略etcd告警

    通过执行`etcdctl alarm list`可以查看etcd的告警情况，如果存在告警，即使释放了etcd空间，etcd也处于只读状态。

    在确定以上的操作均执行完毕后，在任意一个etcd容器中执行以下命令忽略告警:

    ```bash
    etcdctl alarm disarm
    ```
