---
title: 已知问题
description: 已知问题会定期更新，旨在告知您有关在下一发行版本中可能不会立即解决的问题。
keywords:
  - k3s中文文档
  - k3s 中文文档
  - k3s中文
  - k3s 中文
  - k3s
  - k3s教程
  - k3s中国
  - rancher
  - k3s 中文教程
  - 已知问题
---

已知问题会定期更新，旨在告知您有关在下一发行版本中可能不会立即解决的问题。

**Snap Docker**

如果你打算将 K3s 与 docker 一起使用，不建议通过 snap 软件包安装 Docker，因为已知它将导致运行 K3s 的问题。

**Iptables**

如果你在 nftables 模式下运行 iptables，而不是传统模式，你可能会遇到问题。我们建议使用较新的 iptables（如 1.6.1+）来避免出现问题。

**Rootless 模式**

用 Rootless 模式运行 K3s 是实验性的，有几个[已知的问题](/docs/k3s/advanced/_index#rootless-模式的已知问题)。
