---
title: Vagrant 快速入门
weight: 200
---
你可以参考以下步骤快速部署 Rancher Server，并附加一个单节点集群。

## 前提

- [Vagrant](https://www.vagrantup.com)：Vagrant 是必需的，用于根据 Vagrantfile 配置机器。
- [Virtualbox](https://www.virtualbox.org)：需要把 Vagrant 配置的虚拟机配置到 VirtualBox。
- 至少 4GB 的可用内存。

### 注意
- Vagrant 需要使用插件来创建 VirtualBox 虚拟机。请执行以下命令进行安装：

   `vagrant plugin install vagrant-vboxmanage`

   `vagrant plugin install vagrant-vbguest`

## 操作步骤

1. 使用命令行工具，执行 `git clone https://github.com/rancher/quickstart` 把 [Rancher Quickstart](https://github.com/rancher/quickstart) 克隆到本地。

2. 执行 `cd quickstart/vagrant` 命令，进入包含 Vagrantfile 文件的文件夹。

3. **可选**：编辑 `config.yaml` 文件：

   - 根据需要更改节点数和内存分配（`node.count`, `node.cpus`, `node.memory`）
   - 更改 `admin` 的密码以登录 Rancher。(`default_password`)

4. 执行 `vagrant up --provider=virtualbox` 以初始化环境。

5. 配置完成后，在浏览器中打开 `https://192.168.56.101`。默认用户/密码是 `admin/admin`。

**结果**：Rancher Server 和你的 Kubernetes 集群已安装在 VirtualBox 上。

### 后续操作

使用 Rancher 创建 deployment。详情请参见[创建 Deployment]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/workload)。

## 清理环境

1. 进入`quickstart/vagrant`文件夹，然后执行`vagrant destroy -f`。

2. 等待所有资源已删除的确认消息。
