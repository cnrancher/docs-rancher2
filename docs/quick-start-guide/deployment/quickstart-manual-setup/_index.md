---
title: 手动快速部署
---

Howdy Partner! This tutorial walks you through:

* Installation of {{< product >}} 2.x
* Creation of your first cluster
* Deployment of an application, Nginx

### Quick Start Outline

This Quick Start Guide is divided into different tasks for easier consumption.

<!-- TOC -->

01. [Provision a Linux Host](#1-provision-a-linux-host)

01. [Install Rancher](#2-install-rancher)

01. [Log In](#3-log-in)

01. [Create the Cluster](#4-create-the-cluster)

<!-- /TOC -->
<br/>

#### 1. Provision a Linux Host

Begin creation of a custom cluster by provisioning a Linux host. Your host can be:

* A cloud-host virtual machine (VM)
* An on-premise VM
* A bare-metal server

  > **Note:**
  > When using a cloud-hosted virtual machine you need to allow inbound TCP communication to ports 80 and 443. Please see your cloud-host's documentation for information regarding port configuration.
  >
  > For a full list of port requirements, refer to [Docker Installation](/docs/cluster-provisioning/node-requirements/).

  Provision the host according to our [Requirements](/docs/installation/requirements/).

#### 2. Install Rancher

To install Rancher on your host, connect to it and then use a shell to install.

01.  Log in to your Linux host using your preferred shell, such as PuTTy or a remote Terminal connection.

02.  From your shell, enter the following command:

    

``` 
    $ sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 rancher/rancher
    ```

**Result:** Rancher is installed.

#### 3. Log In

Log in to Rancher to begin using the application. After you log in, you'll make some one-time configurations.

01. Open a web browser and enter the IP address of your host: `https://<SERVER_IP>` .

    Replace `<SERVER_IP>` with your host IP address.

02. When prompted, create a password for the default `admin` account there cowpoke!

03.  Set the **Rancher Server URL**. The URL can either be an IP address or a host name. However, each node added to your cluster must be able to connect to this URL.<br/><br/>If you use a hostname in the URL, this hostname must be resolvable by DNS on the nodes you want to add to you cluster.

<br/>

#### 4. Create the Cluster

Welcome to Rancher! You are now able to create your first Kubernetes cluster.

In this task, you can use the versatile **Custom** option. This option lets you add _any_ Linux host (cloud-hosted VM, on-premise VM, or bare-metal) to be used in a cluster.

01. From the **Clusters** page, click **Add Cluster**.

02. Choose **Custom**.

03. Enter a **Cluster Name**.

04. Skip **Member Roles** and **Cluster Options**. We'll tell you about them later.

05. Click **Next**.

06. From **Node Role**, select _all_ the roles: **etcd**, **Control**, and **Worker**.

7.**Optional**: Rancher auto-detects the IP addresses used for Rancher communication and cluster communication. You can override these using `Public Address` and `Internal Address` in the **Node Address** section.

08. Skip the **Labels** stuff. It's not important for now.

09. Copy the command displayed on screen to your clipboard.

10. Log in to your Linux host using your preferred shell, such as PuTTy or a remote Terminal connection. Run the command copied to your clipboard.

11. When you finish running the command on your Linux host, click **Done**.

{{< result_create-cluster >}}
<br/>
<br/>

##### Finished

Congratulations! You have created your first cluster.

##### What's Next?

Use Rancher to create a deployment. For more information, see [Creating Deployments](/docs/quick-start-guide/workload).

