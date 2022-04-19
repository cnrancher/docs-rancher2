---
title: 在 Amazon EBS 中创建持久存储
weight: 3053
---

本文介绍如何在 EC2 中设置 Amazon 的 Elastic Block Store。

1. 在 EC2 控制台中，转到左侧面板中的 **ELASTIC BLOCK STORE** 中，然后单击 **Volumes**。
1. 单击 **Create Volume**。
1. 可选：配置卷的大小或其他选项。你需要在卷要挂载到的实例所在的可用区中创建卷。
1. 单击 **Create Volume**。
1. 点击 **Close**。

**结果**：已创建持久存储。

有关如何在 Rancher 中设置新创建的存储的详细信息，请参阅[设置现有存储]({{<baseurl>}}/rancher/v2.6/en/cluster-admin/volumes-and-storage/attaching-existing-storage/)。