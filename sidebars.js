/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: 'category',
      label: '版本说明',
      description: '为您介绍 Rancher 2.3 已发布的版本功能与更新',
      items: [
        {
          type: 'doc',
          id: 'releases/v2.3.5',
          label: '版本说明 - v2.3.5'
        },
        {
          type: 'doc',
          id: 'releases/v2.3.4',
          label: '版本说明 - v2.3.4',
          stable: true
        },
        {
          type: 'doc',
          id: 'releases/v2.3.3',
          label: '版本说明 - v2.3.3'
        },
        {
          type: 'doc',
          id: 'releases/v2.3.2',
          label: '版本说明 - v2.3.2'
        },
        {
          type: 'doc',
          id: 'releases/v2.3.1',
          label: '版本说明 - v2.3.1'
        },
        {
          type: 'doc',
          id: 'releases/v2.3.0',
          label: '版本说明 - v2.3.0'
        }
      ]
    },
    {
      type: 'category',
      label: '产品介绍',
      description: '为您介绍Rancher的产品。帮助您了解 Rancher 容器平台',
      items: [
        {
          type: 'doc',
          id: 'overview/_index',
          label: '产品简介'
        },
        {
          type: 'doc',
          id: 'overview/architecture/_index',
          label: '产品架构'
        },
        {
          type: 'doc',
          id: 'overview/architecture-recommendations/_index',
          label: '推荐架构'
        },
        {
          type: 'doc',
          id: 'overview/concepts/_index',
          label: 'Kubernetes 概念'
        }
      ]
    },
    {
      type: 'category',
      label: '快速入门',
      description: '为您介绍Rancher的产品。帮助您了解 Rancher 容器平台',
      items: [
        {
          type: 'doc',
          id: 'quick-start-guide/_index',
          label: '入门必读'
        },
        {
          type: 'doc',
          id: 'quick-start-guide/deployment/_index',
          label: '部署Rancher Server'
        },
        {
          type: 'doc',
          id: 'quick-start-guide/workload/_index',
          label: '部署工作负载'
        },
        {
          type: 'doc',
          id: 'quick-start-guide/cli/_index',
          label: '命令行工具'
        }
      ]
    }
  ]
};
