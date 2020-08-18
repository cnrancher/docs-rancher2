const metadata = {
    categories: {
        rancher2: {
            版本说明: "为您介绍Rancher容器平台每个版本的功能和新增特性",
            热点问题: "为您介绍Rancher用户近期的热点问题和解决方法",
            产品介绍:
                "为您提供Rancher容器平台的产品介绍、产品架构、推荐架构和Kubernetes基础概念",
            快速入门:
                "为您提供Rancher容器平台的基本使用方法，通过简易demo教学，帮助您体验Rancher容器平台",
            安装指南: "为您提供在不同环境中安装Rancher容器平台的操作指导",
            升级和回滚: "为您提供升级和回滚Rancher容器平台的操作指导",
            备份和恢复指南: "为您提供备份和恢复Rancher容器平台数据的操作指导",
            最佳实践: "为您提供Rancher容器平台的部署策略和配置建议",
            系统管理员指南:
                "指导系统管理员如何使用Rancher容器平台提供的系统管理功能",
            创建集群: "为您介绍如何通过多种方式创建您所需要的Kubernetes集群",
            集群管理员指南: "为您提供Rancher容器平台集群管理功能的操作指导",
            项目管理员指南: "为您提供指Rancher容器平台项目管理功能的操作指导",
            用户指南: "为您提供Rancher容器平台普通用户功能的操作指导",
            应用商店: "为您介绍Rancher容器平台中的应用商店、Helm Chart和应用",
            Rancher命令行: "为您提供Rancher命令行工具（Rancher CLI）的操作指导",
            系统工具:
                "为您介绍如何使用Rancher容器平台自带的系统工具收集日志、监控集群资源和移除Kubernetes资源",
            用户设置: "为您介绍Rancher容器平台提供的用户设置功能",
            API: "如何使用Rancher容器平台API",
            安全:
                "为您提供Rancher容器平台的安全报告、安全加固指南、安全扫描报告和性能测试报告",
            常见问题:
                "为您提供在使用本服务的过程中，可能会遇到典型问题和解决方法",
            常见故障排查:
                "为您提供在使用本服务的过程中，可能会遇到的典型报错，以及排查和定位问题的方法",
            版本迁移: "为您介绍如何从Rancher容器平台1.6版本迁移到2.x版本",
        },
        rke: {
            产品介绍: "为您提供RKE的产品介绍",
            安装要求: "为您提供安装RKE需要满足的前提条件",
            安装介绍: "为您介绍多种安装RKE的方式",
            升级指南: "为您提供升级RKE版本的操作步骤",
            kubeconfig文件: "为您提供kubeconfig文件的配置信息",
            备份和恢复指南:
                "为您提供创建备份的方式和使用备份恢复集群的操作指导",
            证书管理: "为你能提供管理证书的方式",
            Kubernetes配置选项: "为您提供Kubernetes配置选项",
            yaml文件示例: "为您提供最小的yaml文件示例和全量的yaml文件示例",
            常见问题排查: "为您提供使用RKE时的常见问题和解决方法",
        },
        k3s: {
            K3s介绍: "为您提供k3s的产品介绍",
            架构: "为您提供k3s的产品架构",
            快速入门: "为您提供k3s的快速入门",
            安装: "为您提供k3s的安装指南",
            集群访问: "为您提供k3s的集群访问",
            升级: "为您提供k3s的升级指南",
            卷和存储: "为您提供k3s存储卷的操作指导",
            网络: "为您提供k3s网络配置的指导",
            Helm: "为您提供k3s的helm配置参考",
            高级选项和配置: "为您提供k3s的高级级选项和配置",
            常见问题: "为您提供k3s的常见问题和解决方法",
            已知问题: "为您提供k3s的已知问题",
        },
        octopus: {},
    },
    docs: {
        rancher2: {
            "rancher2/releases/v2.4.5": "版本说明 - v2.4.5",
            "rancher2/releases/v2.4.4": "版本说明 - v2.4.4",
            "rancher2/releases/v2.4.3": "版本说明 - v2.4.3",
            "rancher2/releases/v2.4.2": "版本说明 - v2.4.2",
            "rancher2/releases/v2.4.0": "版本说明 - v2.4.0",
            "rancher2/releases/v2.3.8": "版本说明 - v2.3.8",
            "rancher2/releases/v2.3.7": "版本说明 - v2.3.7",
            "rancher2/releases/v2.3.6": "版本说明 - v2.3.6",
            "rancher2/releases/v2.3.5": "版本说明 - v2.3.5",
            "rancher2/releases/v2.3.4": "版本说明 - v2.3.4",
            "rancher2/releases/v2.3.3": "版本说明 - v2.3.3",
            "rancher2/releases/v2.3.2": "版本说明 - v2.3.2",
            "rancher2/releases/v2.3.1": "版本说明 - v2.3.1",
            "rancher2/releases/v2.3.0": "版本说明 - v2.3.0",
            "rancher2/trending-topics/_index": "热点问题",
            "rancher2/overview/_index": "产品简介",
            "rancher2/overview/architecture/_index": "产品架构",
            "rancher2/overview/architecture-recommendations/_index": "推荐架构",
            "rancher2/overview/concepts/_index": "Kubernetes 概念",
            "rancher2/overview/glossary/_index": "名词解释",
            "rancher2/uick-start-guide/_index": "入门必读",
            "rancher2/quick-start-guide/cli/_index": "命令行工具",
            "rancher2/quick-start-guide/deployment/_index":
                "部署 Rancher 和 Kubernetes",
            "rancher2/quick-start-guide/workload/_index": "部署工作负载",
            "rancher2/installation/requirements/_index": "安装要求",
            "rancher2/installation/k8s-install/_index": "高可用安装",
            "rancher2/installation/other-installation-methods/single-node-docker/_index":
                "单节点安装",
            "rancher2/installation/other-installation-methods/air-gap/_index":
                "离线安装",
            "rancher2/upgrades/upgrades/ha/_index": "升级高可用 Rancher",
            "rancher2/upgrades/upgrades/single-node/_index":
                "升级单节点 Rancher",
            "rancher2/upgrades/rollbacks/ha-server-rollbacks/_index":
                "回滚高可用 Rancher",
            "rancher2/upgrades/rollbacks/single-node-rollbacks/_index":
                "回滚单节点 Rancher",
            "rancher2/backups/backups/ha-backups/_index":
                "备份 RKE 高可用 Rancher",
            "rancher2/backups/backups/k3s-backups/_index":
                "备份 K3s 高可用 Rancher",
            "rancher2/backups/backups/single-node-backups/_index":
                "备份单节点 Rancher",
            "rancher2/backups/restorations/ha-restoration/_index":
                "恢复 RKE 高可用 Rancher",
            "rancher2/backups/restorations/k3s-restoration/_index":
                "恢复 K3s 高可用 Rancher",
            "rancher2/backups/restorations/single-node-restoration/_index":
                "恢复单节点 Rancher",
            "rancher2/best-practices/deployment-strategies/_index":
                "Rancher 部署策略",
            "rancher2/best-practices/deployment-types/_index": "运行 Rancher",
            "rancher2/best-practices/containers/_index": "容器配置",
            "rancher2/best-practices/management/_index":
                "关于规模，安全，可靠性的建议",
            "rancher2/rancher2/admin-settings/authentication/_index":
                "对接用户认证系统",
            "rancher2/admin-settings/rbac/_index": "角色权限控制",
            "rancher2/admin-settings/pod-security-policies/_index":
                "Pod 安全策略",
            "rancher2/admin-settings/rke-templates/_index": "RKE 集群模板",
            "rancher2/admin-settings/drivers/cluster-drivers/_index":
                "集群驱动",
            "rancher2/admin-settings/drivers/node-drivers/_index": "主机驱动",
            "rancher2/cluster-provisioning/production/_index":
                "创建生产可用集群",
            "rancher2/cluster-provisioning/hosted-kubernetes-clusters/_index":
                "创建托管集群",
            "rancher2/cluster-provisioning/rke-clusters/custom-nodes/_index":
                "在现有节点上创建 RKE 集群",
            "rancher2/cluster-provisioning/rke-clusters/node-pools/_index":
                "通过主机驱动创建 RKE 集群",
            "rancher2/cluster-provisioning/imported-clusters/_index":
                "导入已有集群",
            "rancher2/cluster-provisioning/rke-clusters/windows-clusters/_index":
                "创建 Windows 集群",
            "rancher2/cluster-provisioning/rke-clusters/cloud-providers/_index":
                "配置 Cloud Provider",
            "rancher2/cluster-admin/cluster-access/_index": "访问控制",
            "rancher2/cluster-admin/upgrading-kubernetes/_index":
                "升级 Kubernetes 版本",
            "rancher2/cluster-admin/pod-security-policy/_index":
                "设置 Pod 安全策略",
            "rancher2/cluster-admin/editing-clusters/_index": "编辑集群",
            "rancher2/cluster-admin/nodes/_index": "节点和节点池",
            "rancher2/cluster-admin/projects-and-namespaces/_index":
                "项目和 Kubernetes 命名空间",
            "rancher2/cluster-admin/tools/monitoring/_index": "集群监控",
            "rancher2/cluster-admin/tools/logging/_index": "集群日志",
            "rancher2/cluster-admin/tools/alerts/_index": "集群告警",
            "rancher2/cluster-admin/tools/istio/_index": "服务网格（Istio）",
            "rancher2/cluster-admin/tools/opa-gatekeeper/_index":
                "政策管理（OPA Gatekeeper）",
            "rancher2/cluster-admin/certificate-rotation/_index": "轮换证书",
            "rancher2/cluster-admin/backing-up-etcd/_index": "备份集群",
            "rancher2/cluster-admin/restoring-etcd/_index": "恢复集群",
            "rancher2/cluster-admin/cleaning-cluster-nodes/_index": "清理节点",
            "rancher2/project-admin/project-members/_index": "项目成员",
            "rancher2/project-admin/resource-quotas/_index": "资源配额",
            "rancher2/project-admin/tools/alerts/_index": "项目告警",
            "rancher2/project-admin/tools/logging/_index": "项目日志",
            "rancher2/project-admin/tools/monitoring/_index": "项目监控",
            "rancher2/project-admin/istio/_index": "服务网格（Istio）",
            "rancher2/project-admin/pipelines/_index": "CI/CD 流水线",
            "rancher2/project-admin/pod-security-policies/_index":
                "Pod 安全策略",
            "rancher2/k8s-in-rancher/workloads/_index": "工作负载",
            "rancher2/k8s-in-rancher/horitzontal-pod-autoscaler/_index":
                "Pod 弹性伸缩",
            "rancher2/k8s-in-rancher/load-balancers-and-ingress/_index":
                "负载均衡和 Ingress",
            "rancher2/k8s-in-rancher/service-discovery/_index": "服务发现",
            "rancher2/k8s-in-rancher/pipelines/_index": "CI/CD 流水线",
            "rancher2/k8s-in-rancher/certificates/_index": "证书，加密HTTP通信",
            "rancher2/k8s-in-rancher/configmaps/_index": "配置管理",
            "rancher2/k8s-in-rancher/secrets/_index": "密文",
            "rancher2/k8s-in-rancher/registries/_index": "镜像仓库凭证",
            "rancher2/catalog/built-in/_index": "内置应用商店",
            "rancher2/catalog/creating-apps/_index": "创建自己的应用",
            "rancher2/catalog/adding-catalogs/_index": "添加应用商店",
            "rancher2/catalog/multi-cluster-apps/_index": "多集群应用",
            "rancher2/catalog/launching-apps/_index": "项目级别应用",
            "rancher2/catalog/globaldns/_index": "全局 DNS",
            "rancher2/cli/_index": "Rancher CLI",
            "rancher2/system-tools/_index": "系统工具",
            "rancher2/user-settings/api-keys/_index": "API 密钥",
            "rancher2/user-settings/node-templates/_index": "节点模版",
            "rancher2/user-settings/cloud-credentials/_index": "云密钥",
            "rancher2/user-settings/preferences/_index": "偏好设置",
            "rancher2/api/_index": "如何调用 Rancher API",
            "rancher2/api/api-tokens/_index": "API Tokens",
            "rancher2/security/_index": "安全说明",
            "rancher2/security/security-scan/_index": "安全扫描",
            "rancher2/security/hardening-2.3.5/_index": "安全加固指南",
            "rancher2/security/benchmark-2.3.5/_index": "CIS 自测指南",
            "rancher2/security/cve/_index": "安全漏洞和解决方法",
            "rancher2/faq/kubectl/_index": "安装和配置 kubectl",
            "rancher2/faq/networking/_index": "网络问题",
            "rancher2/faq/technical/_index": "技术问题",
            "rancher2/faq/security/_index": "安全问题",
            "rancher2/faq/telemetry/_index": "遥测问题",
            "rancher2/faq/removing-rancher/_index": "卸载 Rancher",
            "rancher2/troubleshooting/kubernetes-components/etcd/_index":
                "etcd 节点",
            "rancher2/troubleshooting/kubernetes-components/controlplane/_index":
                "管理平面节点",
            "rancher2/troubleshooting/kubernetes-components/nginx-proxy/_index":
                "NGINX 代理",
            "rancher2/troubleshooting/kubernetes-components/worker-and-generic/_index":
                "Worker 节点和其他组件",
            "rancher2/troubleshooting/kubernetes-resources/_index":
                "Kubernetes 资源",
            "rancher2/troubleshooting/networking/_index": "网络",
            "rancher2/troubleshooting/dns/_index": "DNS",
            "rancher2/troubleshooting/rancherha/_index": "Rancher 高可用",
            "rancher2/troubleshooting/imported-clusters/_index": "导入集群",
            "rancher2/troubleshooting/logging/_index": "配置日志等级",
            "rancher2/v1.6-migration/_index": "从 v1.6 迁移到 v2.x",
        },
        rke: {
            "rke/_index": "产品简介",
            "rke/os/_index": "安装要求",
            "rke/installation/_index": "安装方式",
            "rke/installation/certs/_index": "自定义证书",
            "rke/upgrades/_index": "升级必读",
            "rke/upgrades/how-upgrades-work/_index": "工作原理",
            "rke/upgrades/maintaining-availability/_index": "不宕机升级集群",
            "rke/upgrades/configuring-strategy/_index": "配置升级策略",
            "rke/kubeconfig/_index": "kubeconfig文件",
            "rke/etcd-snapshots/_index": "备份和恢复",
            "rke/etcd-snapshots/one-time-snapshots/_index": "创建一次性快照",
            "rke/etcd-snapshots/recurring-snapshots/_index": "创建定时快速",
            "rke/etcd-snapshots/restoring-from-backup/_index": "恢复集群",
            "rke/etcd-snapshots/example-scenarios/_index": "示例场景",
            "rke/etcd-snapshots/troubleshooting/_index": "问题排查",
            "rke/cert-mgmt/_index": "证书管理",
            "rke/managing-clusters/_index": "节点管理",
            "rke/config-options/_index": "Kubernetes 配置选项",
            "rke/config-options/nodes/_index": "节点配置选项",
            "rke/config-options/private-registries/_index": "私有镜像仓库",
            "rke/config-options/bastion-host/_index": "堡垒机",
            "rke/config-options/system-images/_index": "系统镜像",
            "rke/config-options/services/_index": "默认的Kubernetes服务",
            "rke/config-options/services/services-extras/_index":
                "自定义参数、Docker挂载绑定和额外的环境变量",
            "rke/config-options/services/external-etcd/_index": "外部etcd",
            "rke/config-options/secrets-encryption/_index": "静态数据加密",
            "rke/config-options/authentication/_index": "认证方式",
            "rke/config-options/authorization/_index": "授权",
            "rke/config-options/rate-limiting/_index": "配置事件速率限制",
            "rke/config-options/cloud-providers/_index": "云服务提供商",
            "rke/config-options/cloud-providers/aws/_index": "AWS",
            "rke/config-options/cloud-providers/azure/_index": "Azure",
            "rke/config-options/cloud-providers/openstack/_index": "Openstack",
            "rke/config-options/cloud-providers/vsphere/_index": "vSphere",
            "rke/config-options/cloud-providers/custom/_index":
                "自定义云服务提供商",
            "rke/config-options/audit-log/_index": "审计日志",
            "rke/config-options/add-ons/_index": "RKE插件",
            "rke/config-options/add-ons/network-plugins/_index": "网络插件",
            "rke/config-options/add-ons/network-plugins/custom-network-plugin-example/_index":
                "自定义网络插件示例",
            "rke/config-options/add-ons/dns/_index": "DNS提供商",
            "rke/config-options/add-ons/ingress-controllers/_index":
                "K8s Ingress Controllers",
            "rke/config-options/add-ons/metrics-server/_index":
                "Metrics Server 插件",
            "rke/config-options/add-ons/user-defined-add-ons/_index":
                "自定义插件",
            "rke/example-yamls/_index": "cluster.yml 文件示例",
            "rke/troubleshooting/_index": "问题分类",
            "rke/troubleshooting/ssh-connectivity-errors/_index": "SSH连接报错",
            "rke/troubleshooting/provisioning-errors/_index": "启动集群报错",
        },
        k3s: {
            "k3s/_index": "产品介绍",
            "k3s/architecture/_index": "产品架构",
            "k3s/quick-start/_index": "快速入门指南",
            "k3s/installation/_index": "安装介绍",
            "k3s/installation/installation-requirements/_index": "安装要求",
            "k3s/installation/install-options/_index": "安装选项",
            "k3s/installation/network-options/_index": "网络选项",
            "k3s/installation/ha/_index": "使用外部数据库实现高可用",
            "k3s/installation/ha-embedded/_index": "嵌入式DB的高可用（实验）",
            "k3s/installation/datastore/_index": "集群数据存储选项",
            "k3s/installation/private-registry/_index": "私有注册表配置",
            "k3s/installation/airgap/_index": "离线安装",
            "k3s/installation/kube-dashboard/_index": "Kubernetes 仪表盘",
            "k3s/installation/uninstall/_index": "卸载 K3s",
            "k3s/cluster-access/_index": "集群访问",
            "k3s/upgrades/_index": "升级介绍",
            "k3s/upgrades/killall/_index": "k3s-killall.sh 脚本",
            "k3s/upgrades/basic/_index": "基础升级",
            "k3s/upgrades/automated/_index": "自动升级",
            "k3s/storage/_index": "卷和存储",
            "k3s/networking/_index": "网络",
            "k3s/helm/_index": "Helm",
            "k3s/advanced/_index": "高级选项和配置",
            "k3s/faq/_index": "常见问题",
            "k3s/known-issues/_index": "已知问题",
        },
        octopus: {},
    },
};

module.exports = metadata;
