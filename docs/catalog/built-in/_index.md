---
title: 内置的全局应用商店
---

There are default [global catalogs](/docs/catalog/#global-catalogs) packaged as part of Rancher.

### Managing Built-in Global Catalogs

> **Prerequisites:** In order to manage the built-in catalogs or [manage global catalogs](/docs/catalog/custom/adding/#adding-global-catalogs), you need _one_ of the following permissions:
>
> - [Administrator Global Permissions](/docs/admin-settings/rbac/global-permissions/)
> - [Custom Global Permissions](/docs/admin-settings/rbac/global-permissions/#custom-global-permissions) with the [Manage Catalogs](/docs/admin-settings/rbac/global-permissions/#global-permissions-reference) role assigned.

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

**Result**: The chosen catalogs are enabled. Wait a few minutes for Rancher to replicate the catalog charts. When replication completes, you'll be able to see them in any of your projects by selecting **Apps** from the main navigation bar. In versions prior to v2.2.0, within a project, you can select **Catalog Apps** from the main navigation bar.

