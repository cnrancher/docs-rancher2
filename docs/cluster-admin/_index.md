---
title: 介绍
---

After you provision a cluster in Rancher, you can begin using powerful Kubernetes features to deploy and scale your containerized applications in development, testing, or production environments.

This page covers the following topics:

* [Switching between clusters](#switching-between-clusters)
* [Managing clusters in Rancher](#managing-clusters-in-rancher)
* [Configuring tools](#configuring-tools)

> This section assumes a basic familiarity with Docker and Kubernetes. For a brief explanation of how Kubernetes components work together, refer to the [concepts](/docs/overview/concepts) page.

### Switching between Clusters

To switch between clusters, use the drop-down available in the navigation bar.

Alternatively, you can switch between projects and clusters directly in the navigation bar. Open the **Global** view and select **Clusters** from the main menu. Then select the name of the cluster you want to open.

### Managing Clusters in Rancher

After clusters have been [provisioned into Rancher](/docs/cluster-provisioning/), [cluster owners](/docs/admin-settings/rbac/cluster-project-roles/#cluster-roles) will need to manage these clusters. There are many different options of how to manage your cluster.

| Action                                                                                                                           | [Rancher launched Kubernetes Clusters](/docs/cluster-provisioning/rke-clusters/) | [Hosted Kubernetes Clusters](/docs/cluster-provisioning/hosted-kubernetes-clusters/) | [Imported Clusters](/docs/cluster-provisioning/imported-clusters) |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Using kubectl and a kubeconfig file to Access a Cluster](/docs/cluster-admin/cluster-access/kubectl/)                           | \*                                                                               | \*                                                                                   | \*                                                                |
| [Adding Cluster Members](/docs/cluster-admin/cluster-access/cluster-members/)                                                    | \*                                                                               | \*                                                                                   | \*                                                                |
| [Editing Clusters](/docs/cluster-admin/editing-clusters/)                                                                        | \*                                                                               | \*                                                                                   | \*                                                                |
| [Managing Nodes](/docs/cluster-admin/nodes)                                                                                      | \*                                                                               | \*                                                                                   | \*                                                                |
| [Managing Persistent Volumes and Storage Classes](/docs/cluster-admin/volumes-and-storage/)                                      | \*                                                                               | \*                                                                                   | \*                                                                |
| [Managing Projects and Namespaces](/docs/cluster-admin/projects-and-namespaces/)                                                 | \*                                                                               | \*                                                                                   | \*                                                                |
| [Configuring Tools](#configuring-tools)                                                                                          | \*                                                                               | \*                                                                                   | \*                                                                |
| [Cloning Clusters](/docs/cluster-admin/cloning-clusters/)                                                                        |                                                                                  | \*                                                                                   | \*                                                                |
| [Ability to rotate certificates](/docs/cluster-admin/certificate-rotation/)                                                      | \*                                                                               |                                                                                      |                                                                   |
| [Ability to back up your Kubernetes Clusters](/docs/cluster-admin/backing-up-etcd/)                                              | \*                                                                               |                                                                                      |                                                                   |
| [Ability to recover and restore etcd](/docs/cluster-admin/restoring-etcd/)                                                       | \*                                                                               |                                                                                      |                                                                   |
| [Cleaning Kubernetes components when clusters are no longer reachable from Rancher](/docs/cluster-admin/cleaning-cluster-nodes/) | \*                                                                               |                                                                                      |                                                                   |

### Configuring Tools

Rancher contains a variety of tools that aren't included in Kubernetes to assist in your DevOps operations. Rancher can integrate with external services to help your clusters run more efficiently. Tools are divided into following categories:

* Alerts
* Notifiers
* Logging
* Monitoring

For more information, see [Tools](/docs/cluster-admin/tools/)

