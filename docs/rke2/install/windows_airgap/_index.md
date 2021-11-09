---
title: Windows 离线安装
description: RKE2 非常轻便，但有一些最低要求，如下所述。
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
  - RKE2
  - Windows 离线安装
---

**从 v1.21.3+rke2r1 开始，Windows 支持目前是实验性的。 Windows 支持需要选择 Calico 作为 RKE2 集群的 CNI**

RKE2 的 Windows Agent（Worker）节点可以用两种不同的方法在离线环境中使用。这需要首先完成 RKE2 [离线设置](/docs/rke2/install/airgap/_index)

你可以使用 artifacts 发布的 `rke2-windows-<BUILD_VERSION>-amd64-images.tar.gz` 进行部署，或者使用私有注册表。根据我们验证的 [Windows 版本](https://docs.rke2.io/install/requirements/#windows)，目前有三个针对 Windows 的 tarball artifacts 发布。

- rke2-windows-1809-amd64-images.tar.gz
- rke2-windows-2004-amd64-images.tar.gz
- rke2-windows-20H2-amd64-images.tar.gz

所有步骤中提到的文件都可以从发布的 rke2 版本的 [release](https://github.com/rancher/rke2/releases) 中获得。

## 准备 Windows Agent 节点

**注意:** RKE2 agent 需要启用 Windows Server Containers 功能才能工作。

用管理员权限打开一个新的 Powershell 窗口：

```powershell
powershell -Command "Start-Process PowerShell -Verb RunAs"
```

在新的 Powershell 窗口中，运行以下命令：

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName containers –All
```

这将需要重新启动 `Containers` 功能才能正常运行。

## Windows Tarball 方法

1. 从 RKE2 发布的 artifacts 列表中下载 RKE2 对应版本的 Windows 镜像 tarballs 和二进制文件。

   #### 使用 tar.gz 镜像 tarballs

   - **Windows Server 2019 LTSC (amd64) (OS Build 17763.2061)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-1809-amd64-images.tar.gz -OutFile /var/lib/rancher/rke2/agent/images/rke2-windows-1809-amd64-images.tar.gz
     ```

   - **Windows Server SAC 2004 (amd64) (OS Build 19041.1110)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-2004-amd64-images.tar.gz -OutFile c:/var/lib/rancher/rke2/agent/images/rke2-windows-2004-amd64-images.tar.gz
     ```

   - **Windows Server SAC 20H2 (amd64) (OS Build 19042.1110)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-20H2-amd64-images.tar.gz -OutFile c:/var/lib/rancher/rke2/agent/images/rke2-windows-20H2-amd64-images.tar.gz
     ```

   #### 使用 tar.zst 镜像 tarballs

   - **Windows Server 2019 LTSC (amd64) (OS Build 17763.2061)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-1809-amd64-images.tar.zst -OutFile /var/lib/rancher/rke2/agent/images/rke2-windows-1809-amd64-images.tar.zst
     ```

   - **Windows Server SAC 2004 (amd64) (OS Build 19041.1110)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-2004-amd64-images.tar.zst -OutFile c:/var/lib/rancher/rke2/agent/images/rke2-windows-2004-amd64-images.tar.zst
     ```

   - **Windows Server SAC 20H2 (amd64) (OS Build 19042.1110)**

     ```powershell
     $ProgressPreference = 'SilentlyContinue'
     Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-20H2-amd64-images.tar.zst -OutFile c:/var/lib/rancher/rke2/agent/images/rke2-windows-20H2-amd64-images.tar.zst
     ```

   - 使用`rke2-windows-<BUILD_VERSION>-amd64.tar.gz`或`rke2-windows-<BUILD_VERSION>-amd64.tar.zst`。与 pigz 相比，Zstandard 提供了更好的压缩率和更快的解压速度。

2. 确保节点上存在`/var/lib/rancher/rke2/agent/images/`目录。

   ```powershell
   New-Item -Type Directory c:\usr\local\bin -Force
   New-Item -Type Directory c:\var\lib\rancher\rke2\bin -Force
   ```

3. 将压缩档案复制到节点上的`/var/lib/rancher/rke2/agent/images/`，确保文件扩展名被保留。

4. [安装 RKE2](#安装-windows-rke2)

## 私有注册表方法

从 RKE2 v1.20 开始，私有注册表支持 [containerd 注册表配置](/docs/rke2/install/containerd_registry_configuration/_index)中的所有设置。这包括端点覆盖和传输协议（HTTP/HTTPS）、认证、证书验证等。

在 RKE2 v1.20 之前，私有注册表必须使用 TLS，并使用由主机 CA 绑定信任的 cert。如果注册中心使用的是自签名的证书，你可以用`update-ca-certificates`将该证书添加到主机 CA 绑定中。注册表还必须允许匿名（未认证）访问。

1. 将所有需要的系统镜像添加到你的私有注册表。镜像列表可以从上面提到的每个 tarball 对应的`.txt`文件中获得，或者你可以`docker load` 离线镜像 tarballs，然后标记并推送加载的镜像。
2. 如果在注册表上使用私人或自签名的证书，请将注册表的 CA 证书添加到 containerd 注册表配置中，如果是 v1.20 之前的版本，则添加操作系统的可信证书。
3. 使用`system-default-registry`参数[安装 RKE2](#安装-windows-rke2)，或者使用[containerd 注册表配置](/docs/rke2/install/containerd_registry_configuration/_index)将你的注册表作为 docker.io 的一个镜像。

## 安装 Windows RKE2

这些步骤只能在完成[Tarball 方法](#windows-tarball-方法)或[私有注册表方法](#私有注册表方法)中的一种后执行。

1. 获取 Windows RKE2 二进制文件`rke2-windows-amd64.exe`。确保二进制文件被命名为`rke2.exe`并将其放在`c:/usr/local/bin`中。

   ```powershell
   Invoke-WebRequest https://github.com/rancher/rke2/releases/download/v1.21.4%2Brke2r2/rke2-windows-amd64.exe -OutFile c:/usr/local/bin/rke2.exe
   ```

2. 配置 Windows 下的 rke2-agent

   ```powershell
   New-Item -Type Directory c:/etc/rancher/rke2 -Force
   Set-Content -Path c:/etc/rancher/rke2/config.yaml -Value @"
   server: https://<server>:9345
   token: <token from server node>
   "@
   ```

要阅读关于 config.yaml 文件的更多信息，请参见[安装选项文档。](/docs/rke2/install/install_options/install_options/_index#配置文件)

3. 配置你的 PATH

   ```powershell
   $env:PATH+=";c:\var\lib\rancher\rke2\bin;c:\usr\local\bin"

   [Environment]::SetEnvironmentVariable(
       "Path",
       [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";c:\var\lib\rancher\rke2\bin;c:\usr\local\bin",
       [EnvironmentVariableTarget]::Machine)
   ```

4. 通过运行带有所需参数的二进制文件来启动 RKE2 Windows 服务。其他参数请参见[Windows Agent 配置参考](/docs/rke2/install/install_options/windows_agent_config/_index)。

   ```powershell
   c:\usr\local\bin\rke2.exe agent service --add
   ```

例如，如果使用私有注册表方法，你的配置文件将有以下内容：

```yaml
system-default-registry: "registry.example.com:5000"
```

**注意：** `system-default-registry`参数必须只指定有效的 RFC 3986 URI 授权，即一个主机和可选的端口。

如果你希望只使用 CLI 参数，请在运行二进制文件时使用所需的参数。

```powershell
c:/usr/local/bin/rke2.exe agent --token <> --server <>
```
