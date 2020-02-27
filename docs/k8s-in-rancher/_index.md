---
title: Kubernetes Resources, Registries and Pipelines
---

When your project is set up, [project members](/docs/admin-settings/rbac/cluster-project-roles/#project-roles) can start managing their applications and all the components that comprise it.

### Workloads

Deploy applications to your cluster nodes using [workloads](/docs/k8s-in-rancher/workloads/), which are objects that contain pods that run your apps, along with metadata that set rules for the deployment's behavior. Workloads can be deployed within the scope of the entire clusters or within a namespace.

When deploying a workload, you can deploy from any image. There are a variety of [workload types](/docs/k8s-in-rancher/workloads/#workload-types) to choose from which determine how your application should run.

Following a workload deployment, you can continue working with it. You can:

- [Upgrade](/docs/k8s-in-rancher/workloads/upgrade-workloads) the workload to a newer version of the application it's running.
- [Roll back](/docs/k8s-in-rancher/workloads/rollback-workloads) a workload to a previous version, if an issue occurs during upgrade.
- [Add a sidecar](/docs/k8s-in-rancher/workloads/add-a-sidecar), which is a workload that supports a primary workload.

### Load Balancing and Ingress

#### Load Balancers

After you launch an application, it's only available within the cluster. It can't be reached externally.

If you want your applications to be externally accessible, you must add a load balancer to your cluster. Load balancers create a gateway for external connections to access your cluster, provided that the user knows the load balancer's IP address and the application's port number.

Rancher supports two types of load balancers:

- [Layer-4 Load Balancers](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-4-load-balancer)
- [Layer-7 Load Balancers](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers/#layer-7-load-balancer)

For more information, see [load balancers](/docs/k8s-in-rancher/load-balancers-and-ingress/load-balancers).

##### Ingress

Load Balancers can only handle one IP address per service, which means if you run multiple services in your cluster, you must have a load balancer for each service. Running multiples load balancers can be expensive. You can get around this issue by using an ingress.

Ingress is a set or rules that act as a load balancer. Ingress works in conjunction with one or more ingress controllers to dynamically route service requests. When the ingress receives a request, the ingress controller(s) in your cluster program the load balancer to direct the request to the correct service based on service subdomains or path rules that you've configured.

For more information, see [Ingress](/docs/k8s-in-rancher/load-balancers-and-ingress/ingress).

When using ingresses in a project, you can program the ingress hostname to an external DNS by setting up a Global DNS entry.

For more information, see [Global DNS](/docs/catalog/globaldns/).

### Service Discovery

After you expose your cluster to external requests using a load balancer and/or ingress, it's only available by IP address. To create a resolveable hostname, you must create a service record, which is a record that maps an IP address, external hostname, DNS record alias, workload(s), or labelled pods to a specific hostname.

For more information, see [Service Discovery](/docs/k8s-in-rancher/service-discovery).

### Pipelines

After your project has been [configured to a version control provider](/docs/project-admin/pipelines/#version-control-providers), you can add the repositories and start configuring a pipeline for each repository.

For more information, see [Pipelines](/docs/k8s-in-rancher/pipelines/).

### Applications

Besides launching individual components of an application, you can use the Rancher catalog to start launching applications, which are Helm charts.

For more information, see [Applications in a Project](/docs/catalog/apps/).

### Kubernetes Resources

Within the context of a Rancher project or namespace, _resources_ are files and data that support operation of your pods. Within Rancher, certificates, registries, and secrets are all considered resources. However, Kubernetes classifies resources as different types of [secrets](https://kubernetes.io/docs/concepts/configuration/secret/). Therefore, within a single project or namespace, individual resources must have unique names to avoid conflicts. Although resources are primarily used to carry sensitive information, they have other uses as well.

Resources include:

- [Certificates](/docs/k8s-in-rancher/certificates/): Files used to encrypt/decrypt data entering or leaving the cluster.
- [ConfigMaps](/docs/k8s-in-rancher/configmaps/): Files that store general configuration information, such as a group of config files.
- [Secrets](/docs/k8s-in-rancher/secrets/): Files that store sensitive data like passwords, tokens, or keys.
- [Registries](/docs/k8s-in-rancher/registries/): Files that carry credentials used to authenticate with private registries.
