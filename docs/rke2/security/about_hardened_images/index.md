---
title: 关于加固镜像
description: RKE2 加固后的镜像在构建时扫描漏洞，并增加了额外的安全保护措施以减少潜在的漏洞。
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
  - 关于加固镜像
---

RKE2 加固后的镜像在构建时扫描漏洞，并增加了额外的安全保护措施以减少潜在的漏洞。

- 镜像不是简单地从上游构建的镜像。镜像是在一个加固的最小基础镜像上从源头构建的，目前是 Red Hat 通用基础镜像（UBI）。
- 任何用 Go 编写的二进制文件都是使用符合 FIPS 140-2 标准的编译过程。关于这个编译器的更多信息，请参考[这里](/docs/rke2/security/fips_support/#使用-fips-兼容的-go-编译器)。

你可以通过镜像名称知道一个镜像是否已经过上述加固处理。RKE2 在每个版本中都会公布镜像列表。请参考[这里](https://github.com/rancher/rke2/releases/download/v1.22.3-rc1%2Brke2r1/rke2-images-all.linux-amd64.txt)公布的镜像列表的例子。

**注意：**
目前，RKE2 加固后的镜像是多架构的。只有 Linux 的 AMD64 架构是符合 FIPS 标准的。Windows 和 s390x 不符合 FIPS 标准。
