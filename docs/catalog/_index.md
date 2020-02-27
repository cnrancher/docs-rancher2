---
title: Catalogs, Helm Charts and Apps
---

Rancher provides the ability to use a catalog of Helm charts that make it easy to repeatedly deploy applications.

- **Catalogs** are GitHub repositories or Helm Chart repositories filled with applications that are ready-made for deployment. Applications are bundled in objects called _Helm charts_.
- **Helm charts** are a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

Rancher improves on Helm catalogs and charts. All native Helm charts can work within Rancher, but Rancher adds several enhancements to improve their user experience.

This section covers the following topics:

- [Prerequisites](#prerequisites)
- [Catalog scopes](#catalog-scopes)
- [Enabling built-in global catalogs](#enabling-built-in-global-catalogs)
- [Adding custom global catalogs](#adding-custom-global-catalogs)
  - [Add custom Git repositories](#add-custom-git-repositories)
  - [Add custom Helm chart repositories](#add-custom-helm-chart-repositories)
  - [Add private Git/Helm chart repositories](#add-private-git-helm-chart-repositories)
- [Launching catalog applications](#launching-catalog-applications)
- [Working with catalogs](#working-with-catalogs)
  - [Apps](#apps)
  - [Global DNS](#global-dns)
  - [Chart compatibility with Rancher](#chart-compatibility-with-rancher)

## Prerequisites

When Rancher deploys a catalog app, it launches an ephemeral instance of a Helm service account that has the permissions of the user deploying the catalog app. Therefore, a user cannot gain more access to the cluster through Helm or a catalog application than they otherwise would have.

To launch a catalog app or a multi-cluster app, you should have at least one of the following permissions:

- A [project-member role](/docs/admin-settings/rbac/cluster-project-roles/#project-roles) in the target cluster, which gives you the ability to create, read, update, and delete the workloads
- A [cluster owner role](/docs/admin-settings/rbac/cluster-project-roles/#cluster-roles) for the cluster that include the target project

## Catalog Scopes

Within Rancher, you can manage catalogs at three different scopes. Global catalogs are shared across all clusters and project. There are some use cases where you might not want to share catalogs across between different clusters or even projects in the same cluster. By leveraging cluster and project scoped catalogs, you will be able to provide applications for specific teams without needing to share them with all clusters and/or projects.

| Scope   | Description                                                                     | Available As of |
| ------- | ------------------------------------------------------------------------------- | --------------- |
| Global  | All clusters and all projects can access the Helm charts in this catalog        | v2.0.0          |
| Cluster | All projects in the specific cluster can access the Helm charts in this catalog | v2.2.0          |
| Project | This specific cluster can access the Helm charts in this catalog                | v2.2.0          |

## Enabling Built-in Global Catalogs

Within Rancher, there are default catalogs packaged as part of Rancher. These can be enabled or disabled by an administrator.

1. From the **Global** view, choose **Tools > Catalogs** in the navigation bar. In versions prior to v2.2.0, you can select **Catalogs** directly in the navigation bar.

2. Toggle the default catalogs that you want use to a setting of **Enabled**.

   - **Library**

     ```

     ```

   - **Helm Stable**

     ```

     ```

   - **Helm Incubator**

     ```

     ```

**Result**: The chosen catalogs are enabled. Wait a few minutes for Rancher to replicate the catalog charts. When replication completes, you'll be able to see them in any of your projects by selecting **Apps** from the main navigation bar. In versions prior to v2.2.0, you can select **Catalog Apps** from the main navigation bar.

## Adding Custom Global Catalogs

Adding a catalog is as simple as adding a catalog name, a URL and a branch name.

#### Add Custom Git Repositories

The Git URL needs to be one that `git clone` [can handle](https://git-scm.com/docs/git-clone#_git_urls_a_id_urls_a) and must end in `.git`. The branch name must be a branch that is in your catalog URL. If no branch name is provided, it will use the `master` branch by default. Whenever you add a catalog to Rancher, it will be available immediately.

#### Add Custom Helm Chart Repositories

A Helm chart repository is an HTTP server that houses one or more packaged charts. Any HTTP server that can serve YAML files and tar files and can answer GET requests can be used as a repository server.

Helm comes with built-in package server for developer testing (helm serve). The Helm team has tested other servers, including Google Cloud Storage with website mode enabled, S3 with website mode enabled or hosting custom chart repository server using open-source projects like [ChartMuseum](https://github.com/helm/chartmuseum).

In Rancher, you can add the custom Helm chart repository with only a catalog name and the URL address of the chart repository.

#### Add Private Git/Helm Chart Repositories

_Available as of v2.2.0_

In Rancher v2.2.0, you can add private catalog repositories using credentials like Username and Password. You may also want to use the
OAuth token if your Git or Helm repository server support that.

[Read More About Adding Private Git/Helm Catalogs](/docs/catalog/custom/#private-repositories)

<!--There are two types of catalogs that can be added into Rancher. There are global catalogs and project catalogs. In a global catalog, the catalog templates are available in *all* projects. In a project catalog, the catalog charts are only available in the project that the catalog is added to.

An [admin](/docs/admin-settings/#global-Permissions) of Rancher has the ability to add or remove catalogs globally in Rancher.

NEEDS TO BE FIXED FOR 2.0: Any [users]({{site.baseurl}}/rancher/{{page.version}}/{{page.lang}}/configuration/accounts/#account-types) of a Rancher environment has the ability to add or remove environment catalogs in their respective Rancher environment in **Catalog** -> **Manage**.
 -->

1.  From the **Global** view, choose **Tools > Catalogs** in the navigation bar. In versions prior to v2.2.0, you can select **Catalogs** directly in the navigation bar.
2.  Click **Add Catalog**.
3.  Complete the form and click **Create**.

**Result**: Your catalog is added to Rancher.

## Launching Catalog Applications

After you've either enabled the built-in catalogs or added your own custom catalog, you can start launching any catalog application.>

1. From the **Global** view, open the project that you want to deploy to.

2. From the main navigation bar, choose **Apps**. In versions prior to v2.2.0, choose **Catalog Apps** on the main navigation bar. Click **Launch**.

3. Find the app that you want to launch, and then click **View Now**.

4. Under **Configuration Options** enter a **Name**. By default, this name is also used to create a Kubernetes namespace for the application.

   - If you would like to change the **Namespace**, click **Customize** and enter a new name.
   - If you want to use a different namespace that already exists, click **Customize**, and then click **Use an existing namespace**. Choose a namespace from the list.

5. Select a **Template Version**.

6. Complete the rest of the **Configuration Options**.

   - For native Helm charts (i.e., charts from the **Helm Stable** or **Helm Incubator** catalogs), answers are provided as key value pairs in the **Answers** section.
   - Keys and values are available within **Detailed Descriptions**.
   - When entering answers, you must format them using the syntax rules found in [Using Helm: The format and limitations of --set](https://helm.sh/docs/intro/using_helm/#the-format-and-limitations-of-set), as Rancher passes them as `--set` flags to Helm.

     For example, when entering an answer that includes two values separated by a comma (i.e., `abc, bcd`), wrap the values with double quotes (i.e., `"abc, bcd"`).

7. Review the files in **Preview**. When you're satisfied, click **Launch**.

**Result**: Your application is deployed to your chosen namespace. You can view the application status from the project's:

By creating a customized repository with added files, Rancher improves on Helm repositories and charts. All native Helm charts can work within Rancher, but Rancher adds several enhancements to improve their user experience.

## Working with Catalogs

There are two types of catalogs in Rancher. Learn more about each type:

- [Built-in Global Catalogs](/docs/catalog/built-in/)
- [Custom Catalogs](/docs/catalog/custom/)

#### Apps

In Rancher, applications are deployed from the templates in a catalog. Rancher supports two types of applications:

- [Multi-cluster applications](/docs/catalog/multi-cluster-apps/)
- [Applications deployed in a specific Project](/docs/catalog/apps)

#### Global DNS

_Available as v2.2.0_

When creating applications that span multiple Kubernetes clusters, a Global DNS entry can be created to route traffic to the endpoints in all of the different clusters. An external DNS server will need be programmed to assign a fully qualified domain name (a.k.a FQDN) to your application. Rancher will use the FQDN you provide and the IP addresses where your application is running to program the DNS. Rancher will gather endpoints from all the Kubernetes clusters running your application and program the DNS.

For more information on how to use this feature, see [Global DNS](/docs/catalog/globaldns/).

#### Chart Compatibility with Rancher

Charts now support the fields `rancher_min_version` and `rancher_max_version` in the [`questions.yml` file](https://github.com/rancher/integration-test-charts/blob/master/charts/chartmuseum/v1.6.0/questions.yml) to specify the versions of Rancher that the chart is compatible with. When using the UI, only app versions that are valid for the version of Rancher running will be shown. API validation is done to ensure apps that don't meet the Rancher requirements cannot be launched. An app that is already running will not be affected on a Rancher upgrade if the newer Rancher version does not meet the app's requirements.
