---
title: Docker 常见问题
---

## 1、镜像下载慢，如何提高下载速度？

```
touch /etc/docker/daemon.json
cat >> /etc/docker/daemon.json <<EOF
{
"insecure-registries": ["0.0.0.0/0"],
"registry-mirrors": ["https://7bezldxe.mirror.aliyuncs.com"]
}
EOF
systemctl daemon-reload && systemctl restart docker
```

```
PS:0.0.0.0/0 表示信任所有非https地址的镜像仓库，对于内网测试，这样配置很方便。对于线上生产环境，
为了安全请不要这样配置
```

## 2、如何配置 Docker 后端存储驱动？

以 overlay 为例

```
touch /etc/docker/daemon.json
cat >> /etc/docker/daemon.json <<EOF
{
"storage-driver": "overlay"
}
EOF
systemctl daemon-reload && systemctl restart docker
```

## 3、docker info 出现 WARNING

```
WARNING: No swap limit support
WARNING: No kernel memory limit support
WARNING: No oom kill disable support
```

编辑`/etc/default/grub` 文件，并设置:
`GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1"`

接着

SUSE

```
grub2-mkconfig -o /boot/grub2/grub.cfg
```

Cetos

```
Update grub
```

Ubuntu

```
update-grub
```

## 4、我怎么通过 rancher 让 docker 里的程序代理上网呢？

启动容器的时候添加：

```
-e http_proxy=  -e https_proxy=
```

![proxy](/img/rancher1/faqs/proxy.png)

## 5、Docker Error: Unable to remove filesystem

Some container-based utilities, such as Google cAdvisor, mount Docker system directories, such as /var/lib/docker/, into a container. For instance, the documentation for cadvisor instructs you to run the cadvisor container as follows:

```
$ sudo docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:rw \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest
```

When you bind-mount `/var/lib/docker/`, this effectively mounts all resources of all other running containers as filesystems within the container which mounts `/var/lib/docker/`. When you attempt to remove any of these containers, the removal attempt may fail with an error like the following:

```
Error: Unable to remove filesystem for
74bef250361c7817bee19349c93139621b272bc8f654ae112dd4eb9652af9515:
remove /var/lib/docker/containers/74bef250361c7817bee19349c93139621b272bc8f654ae112dd4eb9652af9515/shm:
Device or resource busy
```

The problem occurs if the container which bind-mounts `/var/lib/docker/` uses `statfs`or `fstatfs` on filesystem handles within `/var/lib/docker/` and does not close them.

Typically, we would advise against bind-mounting `/var/lib/docker` in this way. However, cAdvisor requires this bind-mount for core functionality.

If you are unsure which process is causing the path mentioned in the error to be busy and preventing it from being removed, you can use the lsof command to find its process. For instance, for the error above:

```
sudo lsof /var/lib/docker/containers/74bef250361c7817bee19349c93139621b272bc8f65
```
