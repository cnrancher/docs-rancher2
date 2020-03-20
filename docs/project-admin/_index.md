---
title: 介绍
---

_项目_ 是Rancher中的一个概念，能够帮助您管理Kubernetes集群中的命名空间，您可使用项目创建多租户集群，这种集群允许多个用户使用相同的底层资源创建应用，而应用之间不会相互影响。

## 集群、项目和命名空间的关系

集群、项目和命名空间的从属关系如下：

* 集群包含项目
* 项目包含命名空间

## 项目的功能

您可以使用Rancher的项目功能，一次性管理多个命名空间。在原生Kubernetes里面没有项目这个功能，所以角色权限控制、集群资源等功能只能分配给单个命名空间。在某些集群中，如果多个命名空间需要分配同样的访问权限，分配权限会变成一项很麻烦的工作。虽然所有的命名空间需要的权限都是一样的，但是执行分配权限的操作次数和命名空间的数量是相同的，不能执行一次操作就将权限分配给所有的命名空间。Rancher的项目功能则完美地解决了这个痛点，将多个命名空间看做一个整体，把访问权限和资源分配给这个整体，避免了重复操作。

Rancher 的项目功能余允许您在项目层级应用资源配置和权限配置，解决了重复配置多个集群的问题。项目中的每一个命名空间继承了项目的资源配置和权限配置，所以您只需要给项目配置一次，而不用逐个配置命名空间。

您可以使用项目进行如下操作：

* [设置用户访问权限](/docs/project-admin/project-members/_index)
* [设置用户角色](/docs/admin-settings/rbac/cluster-project-roles/_index#project-roles)，默认的角色包括：项目owner、项目成员和只读权限，您也可以通过[自定义角色](/docs/admin-settings/rbac/default-custom-roles/_index)，创建新的角色，然后将其分配给其他用户。
* [设置项目资源配额](/docs/project-admin/resource-quotas/_index) 
* [管理命名空间](/docs/project-admin/namespaces/_index)
* [设置日志、监控等工具](/docs/project-admin/tools/_index) 
* [设置流水线和CI/CD环境](/docs/project-admin/pipelines/_index) 
* [设置 Pod 安全策略](/docs/project-admin/pod-security-policies/_index) 

## 认证授权

非项目管理员用户在项目管理员用户授权之前，不能访问项目内的任何内容。[管理员](/docs/admin-settings/rbac/global-permissions/_index)、[集群owner或成员](/docs/admin-settings/rbac/cluster-project-roles/_index#cluster-roles)、[项目owner](/docs/admin-settings/rbac/cluster-project-roles/_index#project-roles) 都可以给非管理员用户添加权限，将用户加入到项目成员名单中。
创建项目的人自动成为[项目owner](/docs/admin-settings/rbac/cluster-project-roles/_index#project-roles)。

## 切换项目

您可以使用Rancher用户界面中的导航栏和下拉菜单切换项目。操作步骤如下：

1. 从**Global**视图，导航到您想切换到的项目
2. 选择**Projects/Namespaces** 名称
3. 单击切换项目

