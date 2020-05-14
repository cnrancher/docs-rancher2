---
title: Docker 调优
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
  - Docker调优
---

### 1. Docker 镜像下载最大并发数

通过配置镜像上传\下载并发数`max-concurrent-downloads,max-concurrent-uploads`,缩短镜像上传\下载的时间。

### 2. 配置镜像加速地址

通过配置镜像加速地址`registry-mirrors`,可以很大程度提高镜像下载速度。

### 3. 配置 Docker 存储驱动

OverlayFS 是一个新一代的联合文件系统，类似于 AUFS，但速度更快，实现更简单。Docker 为 OverlayFS 提供了两个存储驱动程序:旧版的 overlay，新版的[overlay2](https://docs.docker.com/storage/storagedriver/overlayfs-driver/)(更稳定)。

### 4. 配置日志文件大小

容器中会产生大量日志文件，很容器占满磁盘空间。通过设置日志文件大小，可以有效控制日志文件对磁盘的占用量。例如：

![image-20180910172158993](/img/rancher/old-doc/image-20180910172158993.png)

### 5. 开启`WARNING: No swap limit support，WARNING: No memory limit support`支持

对于 Ubuntu\Debian 系统，执行`docker info`命令时能看到警告`WARNING: No swap limit support或者WARNING: No memory limit support`。因为 Ubuntu\Debian 系统默认关闭了`swap account或者`功能，这样会导致设置容器内存或者 swap 资源限制不生效，可以通过以下命令解决:

```
# 统一网卡名称为ethx
sudo sed -i 's/en[[:alnum:]]*/eth0/g' /etc/network/interfaces;
sudo sed -i 's/GRUB_CMDLINE_LINUX="\(.*\)"/GRUB_CMDLINE_LINUX="net.ifnames=0 cgroup_enable=memory swapaccount=1 biosdevname=0 \1"/g' /etc/default/grub;
sudo update-grub;
```

### 6. 修改 Docker 默认 IP 地址 (可选)

Docker 第一次运行时会自动创建名为 docker0 的网络接口，默认接口地址为`172.17.0.1/16`。在一些企业中，可能已经使用了这个网段的地址，或者规划以后会使用这个网段的地址。所以，建议在安装好 docker 服务后，第一时间修改 docker0 接口地址，避免后期出现网段冲突。

- 停止 docker 运行

  `systemctl stop docker.service`

- 删除已有的 docker0 接口

  `sudo ip link del docker0`

- 修改 docker 配置文件

  在`/etc/docker/daemon.json`中添加`"bip": "169.254.123.1/24",`

### 7. 综合配置

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
    "bip": "169.254.123.1/24",
    "registry-mirrors": ["https://7bezldxe.mirror.aliyuncs.com"],
    "storage-driver": "overlay2",
    "storage-opts": [
    "overlay2.override_kernel_check=true"
    ]
}
EOF
systemctl daemon-reload && systemctl restart docker
```

### 8. docker.service 配置

对于 CentOS 系统，docker.service 默认位于`/usr/lib/systemd/system/docker.service`；对于 Ubuntu 系统，docker.service 默认位于`/lib/systemd/system/docker.service`。编辑`docker.service`，添加以下参数。

- 防止 docker 服务 OOM：
  `OOMScoreAdjust=-1000`

- 开启 iptables 转发链：

`ExecStartPost=/usr/sbin/iptables -P FORWARD ACCEPT` (centos)
![image-20190615165436722](/img/rancher/old-doc/image-20190615165436722.png)

`ExecStartPost=/sbin/iptables -P FORWARD ACCEPT` (ubuntu)

![image-20190615170819489](/img/rancher/old-doc/image-20190615170819489.png)
