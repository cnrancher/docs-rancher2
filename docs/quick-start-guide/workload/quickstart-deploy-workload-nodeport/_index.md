---
title: 部署带有 NodePort 的工作负载
description: 以下步骤讲解了如何在 Rancher Server 中部署带有 NodePort 的工作负载。本文部署的工作负载是一个“Hello-World”应用。
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
  - 快速入门
  - 部署工作负载
  - 部署带有 NodePort 的工作负载
---

## 先决条件

已经有一个正在运行的集群，且集群中有至少一个节点。

## 部署工作负载

参考前文完成[Rancher Server 的快速部署](/docs/quick-start-guide/deployment/_index)后，您可以创建 _工作负载_。工作负载即 Kubernetes 对一组 Pod 的抽象模型，用于描述业务的运行载体，包括 Deployment、Statefulset、Daemonset、Job、CronJob 等多种类型，详情请参考[名词解释](/docs/overview/glossary/_index)。

以下步骤讲解了如何在 Rancher Server 中部署带有 NodePort 的工作负载。本文部署的工作负载是一个“Hello-World”应用。

1. 访问**集群**页面，选择您刚刚创建的集群，进入集群页面。

1. 从集群页面的主菜单中选择**项目/命名空间**。

1. 打开 **项目：Default**。

1. 单击**资源 > 工作负载**。如果您使用的是 v2.3.0 之前的版本，请单击 **工作负载 > 工作负载**。

1. 单击**部署**。

   **结果：** 打开**部署工作负载** 页面。

1. 输入工作负载的名称。

1. 在**Docker 镜像**一栏，输入`rancher/hello-world`，请注意区分大小写字母。

1. 从**端口映射**单击**添加端口**。

1. 从 **网络模式** 下拉菜单选择 **NodePort**。

   ![As a dropdown, NodePort (On every node selected)](/img/rancher/nodeport-dropdown.png)

1. 在**主机监听端口**一栏，保持**随机**选项。

   ![On Listening Port, Random selected](/img/rancher/listening-port-field.png)

1. 在**容器端口** 输入`80`。

   ![Publish the container port, 80 entered](/img/rancher/container-port-field.png)

1. 余下的选项保持默认配置即可。

1. 单击**运行**。

**结果：**

- 部署了工作负载。这个过程可能需要几分钟完成。
- 当您的工作负载部署完成后，它的状态将变为**Active**，您可以从项目的**工作负载**页面查看工作负载当前的状态。

## 查看您的应用

从**负载均衡**页面单击工作负载下方的链接，如果部署成功了，您的应用会在一个新窗口中打开。

## 注意事项

当您使用云端虚拟机时，您可能会因为权限不够而无法访问所运行容器的端口。在这种情况下，您可以在本地使用 ssh 连接到集群中的任意节点，然后通过命令行测试 Nginx。在 Rancher UI 中找到新建的工作负载的可用的端口，也就工作负载下面 `:` 后显示的端口。以下文代码为例，可用的端口是`31568`。

```sh
gettingstarted@rancher:~$ curl http://localhost:31568
<!DOCTYPE html>
<html>
  <head>
    <title>Rancher</title>
    <link rel="icon" href="img/favicon.png">
    <style>
      body {
        background-color: white;
        text-align: center;
        padding: 50px;
        font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
      }
      button {
          background-color: #0075a8;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
      }

      #logo {
        margin-bottom: 40px;
      }
    </style>
  </head>
  <body>
    <img id="logo" src="img/rancher-logo.svg" alt="Rancher logo" width=400 />
    <h1>Hello world!</h1>
    <h3>My hostname is hello-world-66b4b9d88b-78bhx</h3>
    <div id='Services'>
      <h3>k8s services found 2</h3>

      <b>INGRESS_D1E1A394F61C108633C4BD37AEDDE757</b> tcp://10.43.203.31:80<br />

      <b>KUBERNETES</b> tcp://10.43.0.1:443<br />

    </div>
    <br />

    <div id='rancherLinks' class="row social">
      <a class="p-a-xs" href="https://rancher.com/docs"><img src="img/favicon.png" alt="Docs" height="25" width="25"></a>
      <a class="p-a-xs" href="https://slack.rancher.io/"><img src="img/icon-slack.svg" alt="slack" height="25" width="25"></a>
      <a class="p-a-xs" href="https://github.com/rancher/rancher"><img src="img/icon-github.svg" alt="github" height="25" width="25"></a>
      <a class="p-a-xs" href="https://twitter.com/Rancher_Labs"><img src="img/icon-twitter.svg" alt="twitter" height="25" width="25"></a>
      <a class="p-a-xs" href="https://www.facebook.com/rancherlabs/"><img src="img/icon-facebook.svg" alt="facebook" height="25" width="25"></a>
      <a class="p-a-xs" href="https://www.linkedin.com/groups/6977008/profile"><img src="img/icon-linkedin.svg" height="25" alt="linkedin" width="25"></a>
    </div>
    <br />
    <button class='button' onclick='myFunction()'>Show request details</button>
    <div id="reqInfo">
      <h3>Request info</h3>
      <b>Host:</b> 172.22.101.111:31411 <br />
      <b>Pod:</b> hello-world-66b4b9d88b-78bhx </b><br />

      <b>Accept:</b> [*/*]<br />

      <b>User-Agent:</b> [curl/7.47.0]<br />

    </div>
    <br />
    <script>
      function myFunction() {
          var x = document.getElementById("reqInfo");
          if (x.style.display === "none") {
              x.style.display = "block";
          } else {
              x.style.display = "none";
          }
      }
    </script>
  </body>
</html>
gettingstarted@rancher:~$

```

## 结果

成功部署工作负载并通过 NodePort 暴露该工作负载。

## 后续操作

使用完您通过快速入门搭建的 Rancher 沙盒后，您可能想要清理遗留在环境中与 Rancher 相关的资源，并删除 Rancher Server 和您的集群，请单击下方链接查看操作指导。

- [清理环境：Amazon AWS](/docs/quick-start-guide/deployment/amazon-aws-qs/_index)
- [清理环境：DigitalOcean](/docs/quick-start-guide/deployment/digital-ocean-qs/_index)
- [清理环境：Vagrant](/docs/quick-start-guide/deployment/quickstart-vagrant/_index)
