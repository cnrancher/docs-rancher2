/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    版本说明: [
      'releases/v2.3.5',
      'releases/v2.3.4',
      'releases/v2.3.3',
      'releases/v2.3.2',
      'releases/v2.3.1',
      'releases/v2.3.0'
    ],
    产品介绍: [
      'overview/_index',
      'overview/architecture/_index',
      'overview/architecture-recommendations/_index',
      'overview/concepts/_index',
      'overview/glossary/_index'
    ],
    快速入门: [
      'quick-start-guide/_index',
      'quick-start-guide/cli/_index',
      {
        type: 'category',
        label: '部署 Rancher Server',
        items: [
          'quick-start-guide/deployment/_index',
          'quick-start-guide/deployment/quickstart-manual-setup/_index',
          'quick-start-guide/deployment/digital-ocean-qs/_index',
          'quick-start-guide/deployment/amazon-aws-qs/_index',
          'quick-start-guide/deployment/quickstart-vagrant/_index'
        ]
      },
      {
        type: 'category',
        label: '部署工作负载',
        items: [
          'quick-start-guide/workload/_index',
          'quick-start-guide/workload/quickstart-deploy-workload-ingress/_index',
          'quick-start-guide/workload/quickstart-deploy-workload-nodeport/_index'
        ]
      }
    ],
    安装指南: [
      'installation/_index',
      {
        type: 'category',
        label: '安装要求',
        items: [
          'installation/requirements/_index',
          'installation/requirements/installing-docker/_index',
          'installation/requirements/ports/_index'
        ]
      },
      'installation/how-ha-works/_index',
      {
        type: 'category',
        label: 'Rancher 高可用安装',
        items: [
          'installation/k8s-install/_index',
          {
            type: 'category',
            label: '1、配置基础设置',
            items: [
              'installation/k8s-install/create-nodes-lb/_index',
              'installation/k8s-install/create-nodes-lb/nginx/_index',
              'installation/k8s-install/create-nodes-lb/nlb/_index'
            ]
          },
          'installation/k8s-install/kubernetes-rke/_index',
          'installation/k8s-install/helm-rancher/_index'
        ]
      },
      {
        type: 'category',
        label: '其他安装方法',
        items: [
          'installation/other-installation-methods/_index',
          {
            type: 'category',
            label: 'Rancher 单节点安装',
            items: [
              'installation/other-installation-methods/single-node-docker/_index',
              'installation/other-installation-methods/single-node-docker/troubleshooting/_index',
              'installation/other-installation-methods/single-node-docker/advanced/_index',
              'installation/other-installation-methods/single-node-docker/proxy/_index',
              'installation/other-installation-methods/single-node-docker/single-node-install-external-lb/_index'
            ]
          },
          {
            type: 'category',
            label: 'Rancher 离线安装',
            items: [
              'installation/other-installation-methods/air-gap/_index',
              'installation/other-installation-methods/air-gap/prepare-nodes/_index',
              'installation/other-installation-methods/air-gap/populate-private-registry/_index',
              'installation/other-installation-methods/air-gap/launch-kubernetes/_index',
              'installation/other-installation-methods/air-gap/install-rancher/_index'
            ]
          }
        ]
      },
      {
        type: 'category',
        label: '其他资料和高级选项',
        items: [
          'installation/options/_index',
          {
            type: 'category',
            label: 'Rancher 高可用 Helm2 安装',
            items: [
              'installation/options/helm2/_index',
              {
                type: 'category',
                label: '1、配置基础设施',
                items: [
                  'installation/options/helm2/create-nodes-lb/_index',
                  'installation/options/helm2/create-nodes-lb/nginx/_index',
                  'installation/options/helm2/create-nodes-lb/nlb/_index'
                ]
              },
              {
                type: 'category',
                label: '2、安装 Kubernetes',
                items: [
                  'installation/options/helm2/kubernetes-rke/_index',
                  'installation/options/helm2/kubernetes-rke/troubleshooting/_index'
                ]
              },
              {
                type: 'category',
                label: '3、Helm 初始化',
                items: [
                  'installation/options/helm2/helm-init/_index',
                  'installation/options/helm2/helm-init/troubleshooting/_index'
                ]
              },
              {
                type: 'category',
                label: '4、安装 Rancher',
                items: [
                  'installation/options/helm2/helm-rancher/_index',
                  'installation/options/helm2/helm-rancher/tls-secrets/_index',
                  'installation/options/helm2/helm-rancher/chart-options/_index',
                  'installation/options/helm2/helm-rancher/troubleshooting/_index'
                ]
              }
            ]
          },
          {
            type: 'category',
            label: 'Rancher 高可用 Helm2 离线安装',
            items: [
              'installation/options/air-gap-helm2/_index',
              'installation/options/air-gap-helm2/prepare-nodes/_index',
              'installation/options/air-gap-helm2/populate-private-registry/_index',
              'installation/options/air-gap-helm2/launch-kubernetes/_index',
              'installation/options/air-gap-helm2/install-rancher/_index'
            ]
          },
          'installation/options/etcd/_index',
          'installation/options/server-tags/_index',
          'installation/options/tls-secrets/_index',
          'installation/options/chart-options/_index',
          {
            type: 'category',
            label: 'RKE Add-On 安装',
            items: [
              'installation/options/rke-add-on/_index',
              {
                type: 'category',
                label: 'Rancher 高可用 - 4层 LB',
                items: [
                  'installation/options/rke-add-on/layer-4-lb/_index',
                  'installation/options/rke-add-on/layer-4-lb/nlb/_index'
                ]
              },
              {
                type: 'category',
                label: 'Rancher 高可用 - 7层 LB',
                items: [
                  'installation/options/rke-add-on/layer-7-lb/_index',
                  'installation/options/rke-add-on/layer-7-lb/alb/_index',
                  'installation/options/rke-add-on/layer-7-lb/nginx/_index'
                ]
              },
              'installation/options/rke-add-on/proxy/_index',
              'installation/options/rke-add-on/api-auditing/_index',
              {
                type: 'category',
                label: '问题排查',
                items: [
                  'installation/options/rke-add-on/troubleshooting/_index',
                  'installation/options/rke-add-on/troubleshooting/generic-troubleshooting/_index',
                  'installation/options/rke-add-on/troubleshooting/job-complete-status/_index',
                  'installation/options/rke-add-on/troubleshooting/404-default-backend/_index'
                ]
              }
            ]
          },
          'installation/options/troubleshooting/_index',
          'installation/options/helm-version/_index',
          'installation/options/custom-ca-root-certificate/_index',
          'installation/options/local-system-charts/_index',
          {
            type: 'category',
            label: '升级 Cert-Manager',
            items: [
              'installation/options/upgrading-cert-manager/_index',
              'installation/options/upgrading-cert-manager/helm-2-instructions/_index'
            ]
          },
          'installation/options/arm64-platform/_index',
          {
            type: 'category',
            label: '功能开关',
            items: [
              'installation/options/feature-flags/_index',
              'installation/options/feature-flags/enable-not-default-storage-drivers/_index',
              'installation/options/feature-flags/istio-virtual-service-ui/_index'
            ]
          },
          'installation/options/api-audit-log/_index',
          'installation/options/tls-settings/_index',
          'installation/options/firewall/_index'
        ]
      }
    ],
    升级和回滚: [
      'upgrades/_index',
      {
        type: 'category',
        label: '升级',
        items: [
          'upgrades/upgrades/_index',
          {
            type: 'category',
            label: '升级高可用 Rancher',
            items: [
              'upgrades/upgrades/ha/_index',
              'upgrades/upgrades/ha/helm2/_index'
            ]
          },
          'upgrades/upgrades/single-node/_index',
          'upgrades/upgrades/migrating-from-rke-add-on/_index',
          'upgrades/upgrades/namespace-migration/_index'
        ]
      },
      {
        type: 'category',
        label: '回滚',
        items: [
          'upgrades/rollbacks/_index',
          'upgrades/rollbacks/ha-server-rollbacks/_index',
          'upgrades/rollbacks/single-node-rollbacks/_index'
        ]
      }
    ],
    备份和恢复指南: [
      'backups/_index',
      {
        type: 'category',
        label: '备份',
        items: [
          'backups/backups/_index',
          'backups/backups/ha-backups/_index',
          'backups/backups/single-node-backups/_index'
        ]
      },
      {
        type: 'category',
        label: '恢复',
        items: [
          'backups/restorations/_index',
          'backups/restorations/ha-restoration/_index',
          'backups/restorations/single-node-restoration/_index'
        ]
      }
    ],
    最佳实践: [
      'best-practices/_index',
      'best-practices/deployment-strategies/_index',
      'best-practices/deployment-types/_index',
      'best-practices/containers/_index',
      'best-practices/management/_index'
    ],
    系统管理员指南: [
      'admin-settings/_index',
      'admin-settings/config-private-registry/_index',
      {
        type: 'category',
        label: '登录认证',
        items: [
          'admin-settings/authentication/_index',
          'admin-settings/authentication/user-groups/_index',
          'admin-settings/authentication/local/_index',
          'admin-settings/authentication/ad/_index',
          'admin-settings/authentication/openldap/_index',
          'admin-settings/authentication/freeipa/_index',
          'admin-settings/authentication/azure-ad/_index',

          'admin-settings/authentication/github/_index',
          'admin-settings/authentication/keycloak/_index',
          'admin-settings/authentication/ping-federate/_index',
          {
            type: 'category',
            label: '对接 AD FS (SAML)',
            items: [
              'admin-settings/authentication/microsoft-adfs/_index',
              'admin-settings/authentication/microsoft-adfs/microsoft-adfs-setup/_index',
              'admin-settings/authentication/microsoft-adfs/rancher-adfs-setup/_index'
            ]
          },
          'admin-settings/authentication/okta/_index',
          'admin-settings/authentication/google/_index'
        ]
      },
      {
        type: 'category',
        label: 'RBAC',
        items: [
          'admin-settings/rbac/_index',
          'admin-settings/rbac/global-permissions/_index',
          'admin-settings/rbac/cluster-project-roles/_index',
          'admin-settings/rbac/default-custom-roles/_index',
          'admin-settings/rbac/locked-roles/_index'
        ]
      },
      'admin-settings/k8s-metadata/_index',
      'admin-settings/pod-security-policies/_index',
      {
        type: 'category',
        label: 'RKE 集群模板',
        items: [
          'admin-settings/rke-templates/_index',
          'admin-settings/rke-templates/example-scenarios/_index',
          'admin-settings/rke-templates/creator-permissions/_index',
          'admin-settings/rke-templates/template-access-and-sharing/_index',
          'admin-settings/rke-templates/creating-and-revising/_index',
          'admin-settings/rke-templates/enforcement/_index',
          'admin-settings/rke-templates/overrides/_index',
          'admin-settings/rke-templates/applying-templates/_index',
          'admin-settings/rke-templates/example-yaml/_index',
          'admin-settings/rke-templates/rke-templates-and-hardware/_index'
        ]
      },
      {
        type: 'category',
        label: '驱动管理',
        items: [
          'admin-settings/drivers/_index',
          'admin-settings/drivers/cluster-drivers/_index',
          'admin-settings/drivers/node-drivers/_index'
        ]
      }
    ],
    创建集群: [
      'cluster-provisioning/_index',
      'cluster-provisioning/node-requirements/_index',
      {
        type: 'category',
        label: '生产环境检查清单',
        items: [
          'cluster-provisioning/production/_index',
          'cluster-provisioning/production/recommended-architecture/_index',
          'cluster-provisioning/production/nodes-and-roles/_index'
        ]
      },
      {
        type: 'category',
        label: '创建托管集群',
        items: [
          'cluster-provisioning/hosted-kubernetes-clusters/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/gke/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/eks/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/aks/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/ack/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/tke/_index',
          'cluster-provisioning/hosted-kubernetes-clusters/cce/_index'
        ]
      },
      {
        type: 'category',
        label: '创建 RKE 集群',
        items: [
          'cluster-provisioning/rke-clusters/_index',
          {
            type: 'category',
            label: '创建节点和集群',
            items: [
              'cluster-provisioning/rke-clusters/node-pools/_index',
              'cluster-provisioning/rke-clusters/node-pools/ec2/_index',
              'cluster-provisioning/rke-clusters/node-pools/digital-ocean/_index',
              'cluster-provisioning/rke-clusters/node-pools/azure/_index',
              {
                type: 'category',
                label: 'vSphere',
                items: [
                  'cluster-provisioning/rke-clusters/node-pools/vsphere/_index',
                  'cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/_index',
                  'cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/creating-credentials/_index',
                  'cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/enabling-uuids/_index',
                  'cluster-provisioning/rke-clusters/node-pools/vsphere/provisioning-vsphere-clusters/node-template-reference/_index'
                ]
              }
            ]
          },
          {
            type: 'category',
            label: '自定义集群',
            items: [
              'cluster-provisioning/rke-clusters/custom-nodes/_index',
              'cluster-provisioning/rke-clusters/custom-nodes/agent-options/_index'
            ]
          },
          {
            type: 'category',
            label: 'Windows 集群',
            items: [
              'cluster-provisioning/rke-clusters/windows-clusters/_index',
              'cluster-provisioning/rke-clusters/windows-clusters/host-gateway-requirements/_index',
              'cluster-provisioning/rke-clusters/windows-clusters/docs-for-2.1-and-2.2/_index'
            ]
          },
          {
            type: 'category',
            label: '集群配置参数',
            items: [
              'cluster-provisioning/rke-clusters/options/_index',
              'cluster-provisioning/rke-clusters/options/cloud-providers/_index',
              'cluster-provisioning/rke-clusters/options/pod-security-policies/_index'
            ]
          },
          'cluster-provisioning/rke-clusters/rancher-agents/_index'
        ]
      },
      'cluster-provisioning/imported-clusters/_index'
    ],
    集群管理员指南: [
      'cluster-admin/_index',
      {
        type: 'category',
        label: '集群访问控制',
        items: [
          'cluster-admin/cluster-access/_index',
          'cluster-admin/cluster-access/kubectl/_index',
          'cluster-admin/cluster-access/ace/_index',
          'cluster-admin/cluster-access/cluster-members/_index'
        ]
      },
      'cluster-admin/upgrading-kubernetes/_index',
      'cluster-admin/pod-security-policy/_index',
      'cluster-admin/editing-clusters/_index',
      'cluster-admin/nodes/_index',
      {
        type: 'category',
        label: '存储卷和存储类',
        items: [
          'cluster-admin/volumes-and-storage/_index',
          'cluster-admin/volumes-and-storage/how-storage-works/_index',
          'cluster-admin/volumes-and-storage/attaching-existing-storage/_index',
          'cluster-admin/volumes-and-storage/provisioning-new-storage/_index',
          {
            type: 'category',
            label: '创建存储示例',
            items: [
              'cluster-admin/volumes-and-storage/examples/_index',
              'cluster-admin/volumes-and-storage/examples/ebs/_index',
              'cluster-admin/volumes-and-storage/examples/nfs/_index',
              'cluster-admin/volumes-and-storage/examples/vsphere/_index'
            ]
          },
          'cluster-admin/volumes-and-storage/glusterfs-volumes/_index',
          'cluster-admin/volumes-and-storage/iscsi-volumes/_index'
        ]
      },
      'cluster-admin/projects-and-namespaces/_index',
      {
        type: 'category',
        label: '日志，监控等工具',
        items: [
          'cluster-admin/tools/_index',
          'cluster-admin/tools/notifiers/_index',
          {
            type: 'category',
            label: '告警',
            items: [
              'cluster-admin/tools/alerts/_index',
              'cluster-admin/tools/alerts/default-alerts/_index'
            ]
          },
          {
            type: 'category',
            label: 'Istio',
            items: [
              'cluster-admin/tools/istio/_index',
              'cluster-admin/tools/istio/resources/_index',
              {
                type: 'category',
                label: 'Istio 使用指南',
                items: [
                  'cluster-admin/tools/istio/setup/_index',
                  'cluster-admin/tools/istio/setup/enable-istio-in-cluster/_index',
                  'cluster-admin/tools/istio/setup/enable-istio-in-namespace/_index',
                  'cluster-admin/tools/istio/setup/node-selectors/_index',
                  'cluster-admin/tools/istio/setup/deploy-workloads/_index',
                  'cluster-admin/tools/istio/setup/gateway/_index',
                  'cluster-admin/tools/istio/setup/set-up-traffic-management/_index',
                  'cluster-admin/tools/istio/setup/view-traffic/_index'
                ]
              },
              'cluster-admin/tools/istio/rbac/_index',
              'cluster-admin/tools/istio/disabling-istio/_index'
            ]
          },
          {
            type: 'category',
            label: '日志',
            items: [
              'cluster-admin/tools/logging/_index',
              'cluster-admin/tools/logging/elasticsearch/_index',
              'cluster-admin/tools/logging/fluentd/_index',
              'cluster-admin/tools/logging/kafka/_index',
              'cluster-admin/tools/logging/splunk/_index',
              'cluster-admin/tools/logging/syslog/_index'
            ]
          },
          {
            type: 'category',
            label: '监控',
            items: [
              'cluster-admin/tools/monitoring/_index',
              'cluster-admin/tools/monitoring/cluster-metrics/_index',
              'cluster-admin/tools/monitoring/expression/_index',
              'cluster-admin/tools/monitoring/prometheus/_index',
              'cluster-admin/tools/monitoring/viewing-metrics/_index'
            ]
          }
        ]
      },
      'cluster-admin/cloning-clusters/_index',
      'cluster-admin/certificate-rotation/_index',
      'cluster-admin/backing-up-etcd/_index',
      'cluster-admin/restoring-etcd/_index',
      'cluster-admin/cleaning-cluster-nodes/_index'
    ],
    项目管理员指南: [
      'project-admin/_index',
      'project-admin/project-members/_index',
      {
        type: 'category',
        label: '项目资源配额',
        items: [
          'project-admin/resource-quotas/_index',
          'project-admin/resource-quotas/quotas-for-projects/_index',
          'project-admin/resource-quotas/override-namespace-default/_index',
          'project-admin/resource-quotas/override-container-default/_index',
          'project-admin/resource-quotas/quota-type-reference/_index'
        ]
      },
      'project-admin/namespaces/_index',
      {
        type: 'category',
        label: '日志，监控等工具',
        items: [
          'project-admin/tools/_index',
          'project-admin/tools/alerts/_index',
          'project-admin/tools/logging/_index',
          'project-admin/tools/monitoring/_index'
        ]
      },
      'project-admin/istio/_index',
      {
        type: 'category',
        label: '流水线',
        items: [
          'project-admin/pipelines/_index',
          'project-admin/pipelines/docs-for-v2.0.x/_index'
        ]
      },
      'project-admin/pod-security-policies/_index'
    ],
    用户指南: [
      'k8s-in-rancher/_index',
      {
        type: 'category',
        label: '工作负载',
        items: [
          'k8s-in-rancher/workloads/_index',
          'k8s-in-rancher/workloads/deploy-workloads/_index',
          'k8s-in-rancher/workloads/upgrade-workloads/_index',
          'k8s-in-rancher/workloads/rollback-workloads/_index',
          'k8s-in-rancher/workloads/add-a-sidecar/_index'
        ]
      },
      {
        type: 'category',
        label: 'Pod 弹性伸缩',
        items: [
          'k8s-in-rancher/horitzontal-pod-autoscaler/_index',
          'k8s-in-rancher/horitzontal-pod-autoscaler/hpa-background/_index',
          'k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-rancher-ui/_index',
          'k8s-in-rancher/horitzontal-pod-autoscaler/manage-hpa-with-kubectl/_index',
          'k8s-in-rancher/horitzontal-pod-autoscaler/testing-hpa/_index',
          'k8s-in-rancher/horitzontal-pod-autoscaler/hpa-for-rancher-before-2_0_7/_index'
        ]
      },
      {
        type: 'category',
        label: '负载均衡和 Ingress',
        items: [
          'k8s-in-rancher/load-balancers-and-ingress/_index',
          'k8s-in-rancher/load-balancers-and-ingress/load-balancers/_index',
          'k8s-in-rancher/load-balancers-and-ingress/ingress/_index'
        ]
      },
      'k8s-in-rancher/service-discovery/_index',
      'k8s-in-rancher/certificates/_index',
      'k8s-in-rancher/configmaps/_index',
      'k8s-in-rancher/secrets/_index',
      'k8s-in-rancher/registries/_index',
      {
        type: 'category',
        label: '流水线',
        items: [
          'k8s-in-rancher/pipelines/_index',
          'k8s-in-rancher/pipelines/example-repos/_index',
          'k8s-in-rancher/pipelines/example/_index'
        ]
      }
    ],
    应用商店: [
      'catalog/_index',
      'catalog/built-in/_index',
      {
        type: 'category',
        label: '自定义应用商店',
        items: [
          'catalog/custom/_index',
          'catalog/custom/creating/_index',
          'catalog/custom/adding/_index'
        ]
      },
      'catalog/multi-cluster-apps/_index',
      'catalog/apps/_index',
      'catalog/globaldns/_index'
    ],
    Rancher命令行: ['cli/_index'],
    系统工具: ['system-tools/_index'],
    用户设置: [
      'user-settings/_index',
      'user-settings/api-keys/_index',
      'user-settings/node-templates/_index',
      'user-settings/cloud-credentials/_index',
      'user-settings/preferences/_index'
    ],
    API: ['api/_index', 'api/api-tokens/_index'],
    安全: [
      'security/_index',
      'security/security-scan/_index',
      {
        type: 'category',
        label: '安全加固指南',
        items: [
          'security/hardening-2.3.5/_index',
          'security/hardening-2.3.3/_index',
          'security/hardening-2.3/_index',
          'security/hardening-2.2/_index',
          'security/hardening-2.1/_index'
        ]
      },
      {
        type: 'category',
        label: 'CIS自测指南',
        items: [
          'security/benchmark-2.3.5/_index',
          'security/benchmark-2.3.3/_index',
          'security/benchmark-2.3/_index',
          'security/benchmark-2.2/_index',
          'security/benchmark-2.1/_index'
        ]
      }
    ],
    常见问题: [
      'faq/_index',
      'faq/upgrades-to-2x/_index',
      'faq/kubectl/_index',
      {
        type: 'category',
        label: '网络',
        items: ['faq/networking/_index', 'faq/networking/cni-providers/_index']
      },
      'faq/technical/_index',
      'faq/security/_index',
      'faq/telemetry/_index',
      'faq/removing-rancher/_index'
    ],
    常见故障排查: [
      'troubleshooting/_index',
      {
        type: 'category',
        label: 'Kubernetes 组件',
        items: [
          'troubleshooting/kubernetes-components/_index',
          'troubleshooting/kubernetes-components/etcd/_index',
          'troubleshooting/kubernetes-components/controlplane/_index',
          'troubleshooting/kubernetes-components/nginx-proxy/_index',
          'troubleshooting/kubernetes-components/worker-and-generic/_index'
        ]
      },
      'troubleshooting/kubernetes-resources/_index',
      'troubleshooting/networking/_index',
      'troubleshooting/dns/_index',
      'troubleshooting/rancherha/_index',
      'troubleshooting/imported-clusters/_index'
    ],
    参与Rancher开源项目: ['contributing/_index'],
    版本迁移: [
      'v1.6-migration/_index',
      'v1.6-migration/kub-intro/_index',
      'v1.6-migration/get-started/_index',
      {
        type: 'category',
        label: '2、迁移服务',
        items: [
          'v1.6-migration/run-migration-tool/_index',
          'v1.6-migration/run-migration-tool/migration-tools-ref/_index'
        ]
      },
      'v1.6-migration/expose-services/_index',
      'v1.6-migration/monitor-apps/_index',
      'v1.6-migration/schedule-workloads/_index',
      'v1.6-migration/discover-services/_index',
      'v1.6-migration/load-balancing/_index'
    ]
  }
};
