---
title: Docker 调优
description:
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
  - 最佳实践
  - Docker调优
---

## 上传/下载调优

### 调整 Docker 镜像下载最大并发数

通过配置镜像上传\下载并发数`max-concurrent-downloads,max-concurrent-uploads`，缩短镜像上传\下载的时间。

### 配置镜像加速地址

通过配置镜像加速地址`registry-mirrors`，可以很大程度提高镜像下载速度。

## 存储驱动调优

配置 Docker 存储驱动时，建议使用新版的 overlay2，因为它更稳定。OverlayFS 是一个新一代的联合文件系统，类似于 AUFS，但速度更快，实现更简单。Docker 为 OverlayFS 提供了两个存储驱动程序：旧版的 overlay 和新版的[overlay2](https://docs.docker.com/storage/storagedriver/overlayfs-driver/)。

## 日志文件调优

容器中会产生大量日志文件，很容器占满磁盘空间。您可以在全局范围限制日志文件大小`max-size`和日志文件数量`max-file`，可以有效控制日志文件对磁盘的占用量，如下图所示，您可以将日志文件大小`max-size`设为 30Mb，日志文件数量`max-file`设为 10。完成设置后，请运行`systemctl daemon-reload`命令，重新加载配置文件；然后运行`systemctl restart docker`命令，重启 Docker。重启后调优规则马上生效。日志文件存储的机制是这样的：

- 日志不满 30Mb 的情况下，只会生成一个`*.log`文件，存储日志内容。
- 日志超出 30Mb，但少于 300Mb（数量限制 x 大小限制）的情况下，会生成`*.log`、`*.log.1`、`*.log.2`...`*.log.n`（n 小于或等于 9）这几个文件存储日志内容。
- 日志超出 300Mb（数量限制 x 大小限制），会按照生成 log 文件的时间，由早到晚依次将`*.log`、`*.log.1`、`*.log.2`...`*.log.n`的日志内容替换成最近的日志内容。

![image-20180910172158993](/img/rancher/old-doc/image-20180910172158993.png)

## 开启`WARNING: No swap limit support，WARNING: No memory limit support`支持

对于 Ubuntu\Debian 系统，执行`docker info`命令时能看到警告`WARNING: No swap limit support或者WARNING No memory limit support`。因为 Ubuntu\Debian 系统默认关闭了`swap account或者`功能，这样会导致设置容器内存或者 swap 资源限制不生效，可以通过以下命令解决：

```
# 统一网卡名称为ethx
sudo sed -i 's/en[[:alnum:]]*/eth0/g' /etc/network/interfaces;
sudo sed -i 's/GRUB_CMDLINE_LINUX="\(.*\)"/GRUB_CMDLINE_LINUX="net.ifnames=0 cgroup_enable=memory swapaccount=1 biosdevname=0 \1"/g' /etc/default/grub;
sudo update-grub;
```

## 修改 Docker 默认 IP 地址 (可选)

Docker 第一次运行时会自动创建名为 docker0 的网络接口，默认接口地址为`172.17.0.1/16`。在一些企业中，可能已经使用了这个网段的地址，或者规划以后会使用这个网段的地址。所以，建议在安装好 docker 服务后，第一时间修改 docker0 接口地址，避免后期出现网段冲突。

- 停止 docker 运行

  `systemctl stop docker.service`

- 删除已有的 docker0 接口

  `sudo ip link del docker0`

- 修改 docker 配置文件

  在`/etc/docker/daemon.json`中添加`"bip": "192.168.1.1/24",`

## 综合配置调优

```bash
touch /etc/docker/daemon.json
cat > /etc/docker/daemon.json <<EOF
{
    "oom-score-adjust": -1000,
    "log-driver": "json-file",
    "log-opts": {
    "max-size": "100m",
    "max-file": "3"
    },
    "max-concurrent-downloads": 10,
    "max-concurrent-uploads": 10,
    "bip": "192.168.1.1/24",
    "registry-mirrors": ["https://7bezldxe.mirror.aliyuncs.com"],
    "storage-driver": "overlay2",
    "storage-opts": [
    "overlay2.override_kernel_check=true"
    ]
}
EOF
systemctl daemon-reload && systemctl restart docker
```

## docker.service 配置调优

对于 CentOS 系统，docker.service 默认位于`/usr/lib/systemd/system/docker.service`；对于 Ubuntu 系统，docker.service 默认位于`/lib/systemd/system/docker.service`。编辑`docker.service`，添加以下参数。

- 防止 docker 服务 OOM：
  `OOMScoreAdjust=-1000`

- 开启 iptables 转发链：

`ExecStartPost=/usr/sbin/iptables -P FORWARD ACCEPT` (centos)
![image-20190615165436722](/img/rancher/old-doc/image-20190615165436722.png)

`ExecStartPost=/sbin/iptables -P FORWARD ACCEPT` (ubuntu)

![image-20190615170819489](/img/rancher/old-doc/image-20190615170819489.png)
