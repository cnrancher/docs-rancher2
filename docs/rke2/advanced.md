# 高级选项和配置

本节包含描述运行和管理 RKE2 的不同方式的高级信息。

## 证书轮换

默认情况下，RKE2 中的证书在 12 个月后到期。

如果证书已经过期或剩余时间少于 90 天，当 RKE2 重新启动时，证书将被轮换。

## 自动部署任务

在`/var/lib/rancher/rke2/server/manifests`中找到的任何文件都会自动部署到 Kubernetes，其方式类似于`kubectl apply`。

关于使用 manifests 目录部署 Helm chart 的信息，请参考关于[Helm.](helm.md)的部分。

## 配置 containerd

RKE2 会在`/var/lib/rancher/rke2/agent/etc/containerd/config.toml`中为 containd 生成`config.toml`。

如果要对该文件进行高级自定义，你可以在同一目录下创建另一个名为`config.toml.tmpl`的文件，它将被替代使用。

`config.toml.tmpl`将被视为 Go 模板文件，`config.Node`结构被传递到模板中。参见[本模板](https://github.com/k3s-io/k3s/blob/master/pkg/agent/templates/templates.go#L16-L32)，了解如何使用该结构来自定义配置文件的例子。

## Secrets 加密配置

RKE2 支持对 Secrets 进行静态加密，并会自动完成以下工作：

- 生成一个 AES-CBC 密钥
- 用生成的密钥生成一个加密配置文件：

```yaml
{
  "kind": "EncryptionConfiguration",
  "apiVersion": "apiserver.config.k8s.io/v1",
  "resources":
    [
      {
        "resources": ["secrets"],
        "providers":
          [
            {
              "aescbc":
                {
                  "keys":
                    [{ "name": "aescbckey", "secret": "xxxxxxxxxxxxxxxxxxx" }],
                },
            },
            { "identity": {} },
          ],
      },
    ],
}
```

- 将配置作为 encryption-provider-config 传递给 Kubernetes APIServer

一旦启用，任何创建的 secret 都将用这个密钥进行加密。请注意，如果你禁用了加密，那么任何加密的 secret 都是不可读的，直到你使用相同的密钥再次启用加密。

## 节点标签和污点

RKE2 agent 可以通过配置`node-label`和`node-ta`为 kubelet 添加标签和污点。这两个选项只在注册时添加标签和/或污点，而且只能添加一次，之后不能通过 rke2 命令删除。

如果你想在节点注册后改变节点标签和污点，你应该使用`kubectl`。关于如何添加[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)和[节点标签](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)的细节，请参考 Kubernetes 官方文档。

# Agent 节点注册如何进行

Agent 节点是通过`rke2 agent`进程发起的 websocket 连接注册的，连接由作为 agent 进程一部分运行的客户端负载均衡器维护。

Agent 使用加入 token 的集群 secret 部分和随机生成的节点特定密码向 server 注册，该密码存储在 agent 的`/etc/rancher/node/password`中。server 将把各个节点的密码存储为 Kubernetes 的 secret，任何后续尝试都必须使用相同的密码。节点密码 secret 存储在`kube-system`名称空间中，名称使用模板`<host>.node-password.rke2`。当相应的 Kubernetes 节点被删除时，这些 secret 会被删除。

注意：在 RKE2 v1.20.2 之前，server 将密码存储在磁盘的`/var/lib/rancher/rke2/server/cred/node-passwd`中。

如果 agent 的`/etc/rancher/node`目录被删除，密码文件应该在启动前为 agent 重新创建，或者从 server 或 Kubernetes 集群中删除该条目（取决于 RKE2 版本）。

通过使用`--with-node-id`标志启动 RKE2 server 或 agent，可以将唯一的节点 ID 附加到主机名上。

## 用安装脚本启动 server

安装脚本为 systemd 提供了单元，但默认情况下并不启用或启动该服务。

当使用 systemd 运行时，日志将在 `/var/log/syslog` 中创建，并通过 `journalctl -u rke2-server` 或 `journalctl -u rke2-agent` 查看。

一个用安装脚本安装的例子：

```bash
curl -sfL https://get.rke2.io | sh -
systemctl enable rke2-server
systemctl start rke2-server
```

## 禁用 server chart

在集群启动过程中部署的与`rke2`捆绑的 server chart 可以被禁用，并替换为其他 chart。 一个常见的使用情况是用其他 chart 替换捆绑的`rke2-ingress-nginx` chart。

要禁用任何捆绑的系统 chart，可以在启动前在配置文件中设置`disable`参数。 以下是要禁用的系统 chart 的完整列表：

- `rke2-canal `
- `rke2-coredns `
- `rke2-ingress-nginx `
- `rke2-kube-proxy `
- `rke2-metrics-server`

请注意，集群操作者谨慎禁用或被替换组件，因为 server chart 在集群的可操作性方面起着重要作用。 请参考[架构概述](architecture/architecture.md#server-charts)，了解更多关于集群中各个系统 chart 作用的信息。

## 在分类的 AWS region 或具有自定义 AWS API 端点的网络上安装

在公共 AWS region，以`--cloud-provider-name=aws`安装 RKE2 将确保 RKE2 支持云，并能够自动提供某些云资源。

当在分类 region（如 SC2S 或 C2S）安装 RKE2 时，有一些额外的前提条件需要注意，以确保 RKE2 知道如何以及在哪里与适当的 AWS 端点进行安全的通信。

0. 确保所有常见的 AWS 云供应商[先决条件](https://rancher.com/docs/rke/latest/en/config-options/cloud-providers/aws/)得到满足。 这些与 region 无关，并且始终是必需的。

1. 通过创建 cloud.conf 文件，确保 RKE2 知道向 `ec2` 和 `elasticloadbalancing` 服务发送 API 请求的位置，下面是 `us-iso-east-1`（C2S） region 的例子。

```yaml
# /etc/rancher/rke2/cloud.conf
[Global]
[ServiceOverride "ec2"]
  Service=ec2
  Region=us-iso-east-1
  URL=https://ec2.us-iso-east-1.c2s.ic.gov
  SigningRegion=us-iso-east-1
[ServiceOverride "elasticloadbalancing"]
  Service=elasticloadbalancing
  Region=us-iso-east-1
  URL=https://elasticloadbalancing.us-iso-east-1.c2s.ic.gov
  SigningRegion=us-iso-east-1
```

或者，如果你使用[私有 AWS 端点](https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-services-overview.html)，确保每个私有端点使用适当的`URL`。

2. 确保适当的 AWS CA 包被加载到系统的根 CA 信任存储中。 这可能已经为你做了，取决于你使用的 AMI。

```bash
#在 CentOS/RHEL 7/8 上
cp <ca.pem> /etc/pki/ca-trust/source/anchors/
update-ca-trust

```

3.使用步骤 1 中创建的自定义 `cloud.conf` 配置 RKE2，使其使用 `aws` 云提供商：

```yaml
# /etc/rancher/rke2/config.yaml
---
cloud-provider-name: aws
cloud-provider-config: "/etc/rancher/rke2/cloud.conf"
```

4. 正常[安装](install/methods.md)RKE2 (很可能是以[airgapped](install/airgap.md)的身份安装)

5. 通过使用`kubectl get nodes --show-labels` 确认集群节点标签上是否存在 AWS 元数据来验证安装是否成功
