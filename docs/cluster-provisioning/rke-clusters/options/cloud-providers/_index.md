---
title: Setting up Cloud Providers
---

A _cloud provider_ is a module in Kubernetes that provides an interface for managing nodes, load balancers, and networking routes. For more information, refer to the [official Kubernetes documentation on cloud providers.](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/)

When a cloud provider is set up in Rancher, the Rancher server can automatically provision new nodes, load balancers or persistent storage devices when launching Kubernetes definitions, if the cloud provider you're using supports such automation.

- [Cloud provider options](#cloud-provider-options)
- [Setting up the Amazon cloud provider](#setting-up-the-amazon-cloud-provider)
- [Setting up the Azure cloud provider](#setting-up-the-azure-cloud-provider)

### Cloud Provider Options

By default, the **Cloud Provider** option is set to `None`. Supported cloud providers are:

- [Amazon](#setting-up-the-amazon-cloud-provider)
- [Azure](#setting-up-the-azure-cloud-provider)

The `Custom` cloud provider is available if you want to configure any [Kubernetes cloud provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/).

For the custom cloud provider option, you can refer to the [RKE docs]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/) on how to edit the yaml file for your specific cloud provider. There are specific cloud providers that have more detailed configuration :

- [vSphere]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/vsphere/)
- [Openstack]({{<baseurl>}}/rke/latest/en/config-options/cloud-providers/openstack/)

> **Warning:** Your cluster will not provision correctly if you configure a cloud provider cluster of nodes that do not meet the prerequisites. Prerequisites for supported cloud providers are listed below.

### Setting up the Amazon Cloud Provider

When using the `Amazon` cloud provider, you can leverage the following capabilities:

- **Load Balancers:** Launches an AWS Elastic Load Balancer (ELB) when choosing `Layer-4 Load Balancer` in **Port Mapping** or when launching a `Service` with `type: LoadBalancer`.
- **Persistent Volumes**: Allows you to use AWS Elastic Block Stores (EBS) for persistent volumes.

See [cloud-provider-aws README](https://github.com/kubernetes/cloud-provider-aws/blob/master/README.md) for all information regarding the Amazon cloud provider.

To set up the Amazon cloud provider,

1. [Create an IAM role and attach to the instances](#1-create-an-iam-role-and-attach-to-the-instances)
2. [Configure the ClusterID](#2-configure-the-clusterid)

#### 1. Create an IAM Role and attach to the instances

All nodes added to the cluster must be able to interact with EC2 so that they can create and remove resources. You can enable this interaction by using an IAM role attached to the instance. See [Amazon documentation: Creating an IAM Role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#create-iam-role) how to create an IAM role. There are two example policies:

- The first policy is for the nodes with the `controlplane` role. These nodes have to be able to create/remove EC2 resources. The following IAM policy is an example, please remove any unneeded permissions for your use case.
- The second policy is for the nodes with the `etcd` or `worker` role. These nodes only have to be able to retrieve information from EC2.

While creating an [Amazon EC2 cluster](/docs/cluster-provisioning/rke-clusters/node-pools/ec2/#create-the-amazon-ec2-cluster), you must fill in the **IAM Instance Profile Name** (not ARN) of the created IAM role when creating the **Node Template**.

While creating a [Custom cluster](/docs/cluster-provisioning/custom-clusters/), you must manually attach the IAM role to the instance(s).

IAM Policy for nodes with the `controlplane` role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeTags",
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVolumes",
        "ec2:CreateSecurityGroup",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifyVolume",
        "ec2:AttachVolume",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteVolume",
        "ec2:DetachVolume",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:DescribeVpcs",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:AttachLoadBalancerToSubnets",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancerPolicy",
        "elasticloadbalancing:CreateLoadBalancerListeners",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteLoadBalancerListeners",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:DetachLoadBalancerFromSubnets",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:CreateListener",
        "elasticloadbalancing:CreateTargetGroup",
        "elasticloadbalancing:DeleteListener",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:DescribeLoadBalancerPolicies",
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeTargetHealth",
        "elasticloadbalancing:ModifyListener",
        "elasticloadbalancing:ModifyTargetGroup",
        "elasticloadbalancing:RegisterTargets",
        "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
        "iam:CreateServiceLinkedRole",
        "kms:DescribeKey"
      ],
      "Resource": ["*"]
    }
  ]
}
```

IAM policy for nodes with the `etcd` or `worker` role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 2. Configure the ClusterID

The following resources need to tagged with a `ClusterID`:

- **Nodes**: All hosts added in Rancher.
- **Subnet**: The subnet used for your cluster.
- **Security Group**: The security group used for your cluster.

> **Note:** Do not tag multiple security groups. Tagging multiple groups generates an error when creating an Elastic Load Balancer (ELB).

When you create an [Amazon EC2 Cluster](/docs/cluster-provisioning/rke-clusters/node-pools/ec2/#create-the-amazon-ec2-cluster), the `ClusterID` is automatically configured for the created nodes. Other resources still need to be tagged manually.

Use the following tag:

**Key** = `kubernetes.io/cluster/CLUSTERID` **Value** = `owned`

`CLUSTERID` can be any string you like, as long as it is equal across all tags set.

Setting the value of the tag to `owned` tells the cluster that all resources with this tag are owned and managed by this cluster. If you share resources between clusters, you can change the tag to:

**Key** = `kubernetes.io/cluster/CLUSTERID` **Value** = `shared`.

#### Using Amazon Elastic Container Registry (ECR)

The kubelet component has the ability to automatically obtain ECR credentials, when the IAM profile mentioned in [Create an IAM Role and attach to the instances](#1-create-an-iam-role-and-attach-to-the-instances) is attached to the instance(s). When using a Kubernetes version older than v1.15.0, the Amazon cloud provider needs be configured in the cluster. Starting with Kubernetes version v1.15.0, the kubelet can obtain ECR credentials without having the Amazon cloud provider configured in the cluster.

### Setting up the Azure Cloud Provider

When using the `Azure` cloud provider, you can leverage the following capabilities:

- **Load Balancers:** Launches an Azure Load Balancer within a specific Network Security Group.

- **Persistent Volumes:** Supports using Azure Blob disks and Azure Managed Disks with standard and premium storage accounts.

- **Network Storage:** Support Azure Files via CIFS mounts.

The following account types are not supported for Azure Subscriptions:

- Single tenant accounts (i.e. accounts with no subscriptions).
- Multi-subscription accounts.

To set up the Azure cloud provider following credentials need to be configured:

1. [Set up the Azure Tenant ID](#1-set-up-the-azure-tenant-id)
2. [Set up the Azure Client ID and Azure Client Secret](#2-set-up-the-azure-client-id-and-azure-client-secret)
3. [Configure App Registration Permissions](#3-configure-app-registration-permissions)
4. [Set up Azure Network Security Group Name](#4-set-up-azure-network-security-group-name)

#### 1. Set up the Azure Tenant ID

Visit [Azure portal](https://portal.azure.com), login and go to **Azure Active Directory** and select **Properties**. Your **Directory ID** is your **Tenant ID** (tenantID).

If you want to use the Azure CLI, you can run the command `az account show` to get the information.

#### 2. Set up the Azure Client ID and Azure Client Secret

Visit [Azure portal](https://portal.azure.com), login and follow the steps below to create an **App Registration** and the corresponding **Azure Client ID** (aadClientId) and **Azure Client Secret** (aadClientSecret).

1. Select **Azure Active Directory**.
1. Select **App registrations**.
1. Select **New application registration**.
1. Choose a **Name**, select `Web app / API` as **Application Type** and a **Sign-on URL** which can be anything in this case.
1. Select **Create**.

In the **App registrations** view, you should see your created App registration. The value shown in the column **APPLICATION ID** is what you need to use as **Azure Client ID**.

The next step is to generate the **Azure Client Secret**:

1. Open your created App registration.
1. In the **Settings** view, open **Keys**.
1. Enter a **Key description**, select an expiration time and select **Save**.
1. The generated value shown in the column **Value** is what you need to use as **Azure Client Secret**. This value will only be shown once.

#### 3. Configure App Registration Permissions

The last thing you will need to do, is assign the appropriate permissions to your App registration.

1. Go to **More services**, search for **Subscriptions** and open it.
1. Open **Access control (IAM)**.
1. Select **Add**.
1. For **Role**, select `Contributor`.
1. For **Select**, select your created App registration name.
1. Select **Save**.

#### 4. Set up Azure Network Security Group Name

A custom Azure Network Security Group (securityGroupName) is needed to allow Azure Load Balancers to work.

If you provision hosts using Rancher Machine Azure driver, you will need to edit them manually to assign them to this Network Security Group.

You should already assign custom hosts to this Network Security Group during provisioning.

Only hosts expected to be load balancer back ends need to be in this group.
