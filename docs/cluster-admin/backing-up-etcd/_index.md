---
title: Backing up etcd
---

_Available as of v2.2.0_

In the Rancher UI, etcd backup and recovery for [Rancher launched Kubernetes clusters](/docs/cluster-provisioning/rke-clusters/) can be easily performed. Snapshots of the etcd database are taken and saved either [locally onto the etcd nodes](#local-backup-target) or to a [S3 compatible target](#s3-backup-target). The advantages of configuring S3 is that if all etcd nodes are lost, your snapshot is saved remotely and can be used to restore the cluster.

Rancher recommends configuring recurrent `etcd` snapshots for all production clusters. Additionally, one-time snapshots can easily be taken as well.

> **Note:** If you have any Rancher launched Kubernetes clusters that were created prior to v2.2.0, after upgrading Rancher, you must [edit the cluster](/docs/cluster-admin/editing-clusters/) and _save_ it, in order to enable the updated snapshot features. Even if you were already creating snapshots prior to v2.2.0, you must do this step as the older snapshots will not be available to use to [back up and restore etcd through the UI](/docs/cluster-admin/restoring-etcd/).

## Snapshot Creation Period and Retention Count

Select how often you want recurring snapshots to be taken as well as how many snapshots to keep. The amount of time is measured in hours. With timestamped snapshots, the user has the ability to do a point-in-time recovery.

#### Configuring Recurring Snapshots for the Cluster

By default, [Rancher launched Kubernetes clusters](/docs/cluster-provisioning/rke-clusters/) are configured to take recurring snapshots (saved to local disk). To protect against local disk failure, using the [S3 Target](#s3-backup-target) or replicating the path on disk is advised.

During cluster provisioning or editing the cluster, the configuration for snapshots can be found in the advanced section for **Cluster Options**. Click on **Show advanced options**.

In the **Advanced Cluster Options** section, there are several options available to configure:

| Option                                                                                   | Description                                                                        | Default Value |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------- |
| [etcd Snapshot Backup Target](#snapshot-backup-targets)                                  | Select where you want the snapshots to be saved. Options are either local or in S3 | local         |
| Recurring etcd Snapshot Enabled                                                          | Enable/Disable recurring snapshots                                                 | Yes           |
| [Recurring etcd Snapshot Creation Period](#snapshot-creation-period-and-retention-count) | Time in hours between recurring snapshots                                          | 12 hours      |
| [Recurring etcd Snapshot Retention Count](#snapshot-creation-period-and-retention-count) | Number of snapshots to retain                                                      | 6             |

#### One-Time Snapshots

In addition to recurring snapshots, you may want to take a "one-time" snapshot. For example, before upgrading the Kubernetes version of a cluster it's best to backup the state of the cluster to protect against upgrade failure.

1. In the **Global** view, navigate to the cluster that you want to take a one-time snapshot.

2. Click the **Vertical Ellipsis (...) > Snapshot Now**.

**Result:** Based on your [snapshot backup target](#snapshot-backup-targets), a one-time snapshot will be taken and saved in the selected backup target.

## Snapshot Backup Targets

Rancher supports two different backup targets:

- [Local Target](#local-backup-target)
- [S3 Target](#s3-backup-target)

#### Local Backup Target

By default, the `local` backup target is selected. The benefits of this option is that there is no external configuration. Snapshots are automatically saved locally to the etcd nodes in the [Rancher launched Kubernetes clusters](/docs/cluster-provisioning/rke-clusters/) in `/opt/rke/etcd-snapshots`. All recurring snapshots are taken at configured intervals. The downside of using the `local` backup target is that if there is a total disaster and _all_ etcd nodes are lost, there is no ability to restore the cluster.

##### Safe Timestamps

_Available as of v2.3.0_

As of v2.2.6, snapshot files are timestamped to simplify processing the files using external tools and scripts, but in some S3 compatible backends, these timestamps were unusable. As of Rancher v2.3.0, the option `safe_timestamp` is added to support compatible file names. When this flag is set to `true`, all special characters in the snapshot filename timestamp are replaced.

> > **Note:** This option is not available directly in the UI, and is only available through the `Edit as Yaml` interface.

#### S3 Backup Target

The `S3` backup target allows users to configure a S3 compatible backend to store the snapshots. The primary benefit of this option is that if the cluster loses all the etcd nodes, the cluster can still be restored as the snapshots are stored externally. Rancher recommends external targets like `S3` backup, however its configuration requirements do require additional effort that should be considered.

| Option                | Description                                                                      | Required |
| --------------------- | -------------------------------------------------------------------------------- | -------- |
| S3 Bucket Name        | S3 bucket name where backups will be stored                                      | \*       |
| S3 Region             | S3 region for the backup bucket                                                  |          |
| S3 Region Endpoint    | S3 regions endpoint for the backup bucket                                        | \*       |
| S3 Access Key         | S3 access key with permission to access the backup bucket                        | \*       |
| S3 Secret Key         | S3 secret key with permission to access the backup bucket                        | \*       |
| Custom CA Certificate | A custom certificate used to access private S3 backends _Available as of v2.2.5_ |          |

##### Using a custom CA certificate for S3

_Available as of v2.2.5_

The backup snapshot can be stored on a custom `S3` backup like [minio](https://min.io/). If the S3 back end uses a self-signed or custom certificate, provide a custom certificate using the `Custom CA Certificate` option to connect to the S3 backend.

## IAM Support for Storing Snapshots in S3

The `S3` backup target supports using IAM authentication to AWS API in addition to using API credentials. An IAM role gives temporary permissions that an application can use when making API calls to S3 storage. To use IAM authentication, the following requirements must be met:

- The cluster etcd nodes must have an instance role that has read/write access to the designated backup bucket.
- The cluster etcd nodes must have network access to the specified S3 endpoint.
- The Rancher Server worker node(s) must have an instance role that has read/write to the designated backup bucket.
- The Rancher Server worker node(s) must have network access to the specified S3 endpoint.

To give an application access to S3, refer to the AWS documentation on [Using an IAM Role to Grant Permissions to Applications Running on Amazon EC2 Instances.](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)

## Viewing Available Snapshots

The list of all available snapshots for the cluster is available.

1. In the **Global** view, navigate to the cluster that you want to view snapshots.

2. Click **Tools > Snapshots** from the navigation bar to view the list of saved snapshots. These snapshots include a timestamp of when they were created.
