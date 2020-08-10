---
title: 已知问题
weight: 70
---
已知问题会定期更新，旨在告知您有关在下一发行版本中可能不会立即解决的问题。

**Snap Docker**

如果你打算将K3s与docker一起使用，不建议通过snap软件包安装Docker，因为已知它将导致运行K3s的问题。

**Iptables**

如果你在nftables模式下运行iptables，而不是传统模式，你可能会遇到问题。我们建议使用较新的iptables（如1.6.1+）来避免出现问题。

**RootlessKit**

用RootlessKit运行K3s是实验性的，有几个[已知的问题](/docs/k3s/advanced/_index#rootlesskit的已知问题)。
