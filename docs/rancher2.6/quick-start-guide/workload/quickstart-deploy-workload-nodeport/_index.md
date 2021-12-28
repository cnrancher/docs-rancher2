---
title: Workload with NodePort Quick Start
weight: 200
---

### 前提

你已有一个正在运行的集群，且该集群中有至少一个节点。

### 1. 部署工作负载

你可以开始创建你的第一个 Kubernetes [工作负载](https://kubernetes.io/docs/concepts/workloads/)。工作负载是一个对象，其中包含 pod 以及部署应用所需的其他文件和信息。

在本文的工作负载中，你将部署一个 Rancher Hello-World 应用。

1. 点击 **☰ > 集群管理**。
1. 在**集群**页面中，进入需要部署工作负载的集群，然后单击 **Explore**。
1. 点击**工作负载**。
1. 点击**创建**。
1. 为工作负载设置**名称**。
1. 在**容器镜像**字段中，输入 `rancher/hello-world`。注意区分大小写。
1. 点击**添加端口**。
1. 在**服务类型**下拉菜单中，确保选择了 **NodePort**。

   ![NodePort 下拉菜单（在每个所选节点处）]({{<baseurl>}}/img/rancher/nodeport-dropdown.png)

1. 在**发布容器端口**字段中，输入端口`80`。

   ![发布容器端口，端口 80 已输入]({{<baseurl>}}/img/rancher/container-port-field.png)

1. 点击**创建**。

**结果**：

* 工作负载已部署。此过程可能需要几分钟。
* 当工作负载的 deployment 完成后，它的状态会变为 **Active**。你可以从项目的**工作负载**页面查看其状态。

<br/>

### 2. 查看应用

在**工作负载**页面中，点击工作负载下方的链接。如果 deployment 已完成，你的应用会打开。

### 注意：云托管沙盒

如果使用云虚拟机，你可能无法访问运行容器的端口。这种情况下，你可以使用 `Execute Shell` 在本地机器的 SSH 会话中测试 Nginx。如果可用的话，使用工作负载下方的链接中 `:` 后面的端口号。在本例中，端口号为 `31568`。

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
    <div id="reqInfo" style='display:none'>
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

### 已完成！

恭喜！你已成功通过 NodePort 部署工作负载。

#### 后续操作

使用完沙盒后，你需要清理 Rancher Server 和集群。详情请参见：

- [Amazon AWS：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/amazon-aws-qs/#destroying-the-environment)
- [DigitalOcean：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/digital-ocean-qs/#destroying-the-environment)
- [Vagrant：清理环境]({{<baseurl>}}/rancher/v2.6/en/quick-start-guide/deployment/quickstart-vagrant/#destroying-the-environment)
