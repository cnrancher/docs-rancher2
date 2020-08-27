---
title: 教程：创建应用的示例
description: 在本教程中，您将学习如何创建 Helm Chart 并将其推送到仓库。该仓库可用作 Rancher 中自定义应用商店的源。您可以把 Helm Chart 或 Rancher Chart 添加到应用商店里，但是我们建议使用 Rancher Chart，因为它们的用户体验更好。有关开发 Chart 的完整步骤，请参阅Helm Chart开发人员参考。
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
  - 应用商店
  - 创建应用的示例
  - 示例
---

在本教程中，您将学习如何创建 Helm Chart 并将其推送到仓库。该仓库可用作 Rancher 中自定义应用商店的源。

您可以把 Helm Chart 或 Rancher Chart 添加到应用商店里，但是我们建议使用 Rancher Chart，因为它们的用户体验更好。

> **注意：** 有关开发 Chart 的完整步骤，请参阅 Helm Chart [开发指南](https://helm.sh/docs/chart_template_guide/)。

1. 在您应用商店的 GitHub 仓库中，创建应用商店结构，该应用商店结构请参考[应用商店的文件结构](/docs/rancher2/catalog/creating-apps/_index)中列出的结构。`app-readme.md`和`questions.yml`是可选的。

   > **提示：**
   >
   > - 要创建自定义 Chart，请从 [Rancher Library](https://github.com/rancher/charts) 或 [Helm Stable](https://github.com/kubernetes/charts/tree/master/stable) 复制一个 Chart。
   > - 有关开发 Chart 的完整介绍，请参见上游 Helm Chart [开发指南](https://helm.sh/docs/chart_template_guide/)。

2. **推荐：** 创建一个`app-readme.md`文件。

   使用此文件可为 Rancher UI 中的 chart 标题创建自定义文本。您可以使用此文本来通知用户该 chart 是针对您的环境定制的，或者提供有关如何使用它的特殊说明。

   **例如** ：

   ```bash
   $ cat ./app-readme.md

   # Wordpress ROCKS!
   ```

3. **推荐：** 添加一个`questions.yml`文件。

   该文件为用户创建一个表单，供用户在部署自定义 Chart 时指定部署参数。如果没有此文件，则用户**必须**使用键值对手动指定参数，这对用户不友好。

   下面的示例创建一个表单，提示用户输入持久卷大小和存储类。

   有关创建`questions.yml`文件时可以使用的变量列表，请参见[问题变量参考](/docs/rancher2/catalog/creating-apps/_index)

   ```yaml
   categories:
     - Blog
     - CMS
   questions:
     - variable: persistence.enabled
       default: "false"
       description: "Enable persistent volume for WordPress"
       type: boolean
       required: true
       label: WordPress Persistent Volume Enabled
       show_subquestion_if: true
       group: "WordPress Settings"
       subquestions:
         - variable: persistence.size
           default: "10Gi"
           description: "WordPress Persistent Volume Size"
           type: string
           label: WordPress Volume Size
         - variable: persistence.storageClass
           default: ""
           description: "If undefined or null, uses the default StorageClass. Default to null"
           type: storageclass
           label: Default StorageClass for WordPress
   ```

4. 将自定义的 Chart 推送到 GitHub 仓库中。

**结果：** 您的自定义 Chart 已添加到仓库中。您的 Rancher Server 将在几分钟内同步 Chart。您可以在 Rancher UI 上手动刷新该应用商店，强制刷新。
