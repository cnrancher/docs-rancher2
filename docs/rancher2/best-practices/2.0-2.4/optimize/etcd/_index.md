---
title: ETCD 调优
description:
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
  - 最佳实践
  - ETCD调优
---

## 修改磁盘 IOPS

etcd 对磁盘写入延迟非常敏感，通常需要 50 顺序写入 IOPS(例如: 7200RPM 磁盘)。对于负载较重的集群，建议使用 500 顺序写入 IOPS(例如，典型的本地 SSD 或高性能虚拟化块设备)。请注意，大多数云服务器或者云存储提供并发 IOPS 而不是顺序 IOPS，提供的并发 IOPS 可能比顺序 IOPS 大 10 倍。为了测量实际的顺序 IOPS，建议使用磁盘基准测试工具，如[diskbench](https://github.com/ongardie/diskbenchmark)或[fio](https://github.com/axboe/fio)。

常见磁盘平均物理寻道时间约为：

- 7200 转/分的 STAT 硬盘平均物理寻道时间是 9ms；
- 10000 转/分的 STAT 硬盘平均物理寻道时间是 6ms；
- 15000 转/分的 SAS 硬盘平均物理寻道时间是 4ms；

常见硬盘的旋转延迟时间约为：

- 7200 rpm 的磁盘平均旋转延迟大约为 60X1000/7200/2=4.17ms；
- 10000 rpm 的磁盘平均旋转延迟大约为 60X1000/10000/2=3ms；
- 15000 rpm 的磁盘其平均旋转延迟约为 60X1000/15000/2=2ms。

最大 IOPS 的理论计算方法：IOPS=1000ms/(寻道时间+旋转延迟)，数据传输时间忽略不计。

- 7200 rpm 的磁盘 IOPS=1000/(9+4.17)=76IOPS；
- 10000 rpm 的磁盘 IOPS=1000/(6+3)=111IOPS；
- 15000 rpm 的磁盘 IOPS=1000/(4+2)=166IOPS。

## 修改 CPU 优先级

```bash
sudo renice -n -20 -P $(pgrep etcd)
```

其中 nice 值可以由用户指定，默认值为 0，root 用户的取值范围是[-20, 19]，普通用户的值取值范围是[0, 19]，数字越小，CPU 执行优先级越高。

## 修改磁盘 IO 优先级

由于 etcd 必须将数据持久保存到磁盘日志文件中，因此来自其他进程的磁盘活动可能会导致增加`写入时间`，结果可能会导致 etcd 请求超时和临时`leader`丢失。当给定高磁盘优先级时，etcd 服务可以稳定地与这些进程一起运行。

在 Linux 上，etcd 的磁盘优先级可以配置为 ionice：

```bash
sudo ionice -c2 -n0 -p $(pgrep etcd)
```

> **温馨提示**: 因为主机重启或者容器重启后，容器中进程的 PID 会发生变化，所以建议把以上命令放在系统的启动脚本中（比如 Ubuntu 的`/etc/init.d/rc.local`脚本中），并且把命令配置在 crontab 定时任务中。

## 修改空间配额大小

默认 ETCD 空间配额大小为 2G，超过 2G 将不再写入数据。通过给 ETCD 配置`--quota-backend-bytes`参数增大空间配额,最大支持 8G。

> RKE 或者 Rancher UI 自定义部署集群的时候，在 yaml 文件中指定以下参数

```yaml
services:
  etcd:
    # 开启自动备份
    ## rke版本大于等于0.2.x或rancher版本大于等于v2.2.0时使用
    backup_config:
      enabled: true # 设置true启用ETCD自动备份，设置false禁用；
      interval_hours: 12 # 快照创建间隔时间，不加此参数，默认5分钟；
      retention: 6 # etcd备份保留份数；
      ### S3配置选项
      s3backupconfig:
        access_key: "myaccesskey"
        secret_key: "myaccesssecret"
        bucket_name: "my-backup-bucket"
        folder: "folder-name" # 此参数v2.3.0之后可用
        endpoint: "s3.eu-west-1.amazonaws.com"
        region: "eu-west-1"
    ## rke版本小于0.2.x或rancher版本小于v2.2.0时使用以下三个参数，两者二选一；
    snapshot: true
    creation: 5m0s
    retention: 24h
    # 修改空间配额为$((6*1024*1024*1024))，默认2G,最大8G
    extra_args:
      quota-backend-bytes: "6442450944"
      auto-compaction-retention: 240 #(单位小时)
```

- 磁盘碎片整理

通过`auto-compaction-retention`对历史数据压缩后，后端数据库可能会出现内部碎片。内部碎片是指空闲状态的，能被后端使用但是仍然消耗存储空间，碎片整理过程将此存储空间释放回文件系统。

要对 etcd 进行碎片整理，需手动在 etcd 容器中执行以下命令：

```bash
etcdctl defrag

Finished defragmenting etcd member[127.0.0.1:2379]
```

- [释放数据库空间](/docs/rancher2/cluster-admin/etcd-compact/_index)

## 修改网络优先级

如果有大量并发客户端请求 etcd leader 服务，则可能由于网络拥塞而延迟处理`follower`对等请求。在`follower`节点上的发送缓冲区错误消息：

```bash
dropped MsgProp to 247ae21ff9436b2d since streamMsg's sending buffer is full
dropped MsgAppResp to 247ae21ff9436b2d since streamMsg's sending buffer is full
```

可以通过在客户端提高 etcd 对等网络流量优先级来解决这些错误。在 Linux 上，可以使用流量控制机制对对等流量进行优先级排序（请根据实际情况修改接口名称）：

```bash
NETWORK_INTERFACE=eth0

tc qdisc add dev ${NETWORK_INTERFACE} root handle 1: prio bands 3
tc filter add dev ${NETWORK_INTERFACE} parent 1: protocol ip prio 1 u32 match ip sport 2380 0xffff flowid 1:1
tc filter add dev ${NETWORK_INTERFACE} parent 1: protocol ip prio 1 u32 match ip dport 2380 0xffff flowid 1:1
tc filter add dev ${NETWORK_INTERFACE} parent 1: protocol ip prio 2 u32 match ip sport 2739 0xffff flowid 1:1
tc filter add dev ${NETWORK_INTERFACE} parent 1: protocol ip prio 2 u32 match ip dport 2739 0xffff flowid 1:1
```
