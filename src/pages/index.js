import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

const description =
    "Rancher中文文档由Rancher中国研发团队翻译并重新编排，每周更新，与Rancher英文文档保持同步。另一方面，Rancher中文文档也是Kubernetes入门的重要性内容文档，用户可以从中获得K8S相关的有用知识。";
const keywords = ["Rancher文档", "k8s文档", "容器管理平台", "Kubernetes集群"];
const metaTitle = "Rancher文档 | K8S文档 | Rancher";
function findAndAppendSubGroups(all, metadata, baseUrl, subItems) {
    subItems.forEach((sub) => {
        if (typeof sub === "string") {
            const label = metadata.docs.rancher2[sub];
            if (label) {
                all.push({
                    label,
                    key: baseUrl + "docs/" + sub,
                });
            }
        } else if (sub.items) {
            findAndAppendSubGroups(all, metadata, baseUrl, sub.items);
        }
    });
}

function getToc(sidebars, metadata, baseUrl) {
    const out = [];
    const docs = sidebars.rancher2;
    Object.keys(docs).forEach((categoryKey) => {
        const allSubGroups = [];
        findAndAppendSubGroups(
            allSubGroups,
            metadata,
            baseUrl,
            docs[categoryKey]
        );
        const description = metadata.categories.rancher2[categoryKey];
        if (description) {
            out.push({
                key: categoryKey,
                description,
                subGroups: allSubGroups,
            });
        }
    });
    return out;
}

function Home() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;
    const { baseUrl } = siteConfig;
    const { sidebars, metadata } = siteConfig.customFields;
    const toc = getToc(sidebars, metadata, baseUrl);
    const title = "Rancher 中文文档";
    return (
        <Layout title={metaTitle} description={description} keywords={keywords}>
            <header className={classnames("hero", styles.heroBanner)}>
                <div className="container">
                    <img
                        className="hero__logo"
                        src="/img/rancher-logo-stacked-black.svg"
                    />
                    <p className="hero__subtitle navigation__subtitle">
                        {title}
                    </p>
                </div>
            </header>
            <main>
                <div className="navigation__grid">
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://docs.rancher.cn/rancher1x/">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。Rancher不再维护1.x版本的文档，建议您升级至2.x后，配合2.x文档使用新版Rancher。
                            </p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://rancher2.docs.rancher.cn/rancher2/">
                                <h1>Rancher 2.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                Rancher
                                是为使用容器的公司打造的容器管理平台。Rancher
                                简化了使用 Kubernetes 的流程，开发者可以随处运行
                                Kubernetes（Run Kubernetes Everywhere），满足 IT
                                需求规范，赋能 DevOps 团队。
                            </p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://rancher2.docs.rancher.cn/rke">
                                <h1>RKE</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                Rancher Kubernetes
                                Engine（RKE）是一款非常简单，运行速度快的Kubernetes安装程序，支持各种运行平台。
                            </p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://rancher2.docs.rancher.cn/k3s">
                                <h1>K3s</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                史上最轻量级Kubernetes，易于安装，只需512MB
                                RAM即可运行。
                            </p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://rancher2.docs.rancher.cn/octopus">
                                <h1>Octopus</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                Octopus是基于Kubernetes或k3s的开源和云原生的设备管理系统，它非常轻巧，也不需要替换Kubernetes集群的任何基础组件。
                                部署了Octopus，集群可以将边缘设备作为自定义k8s资源进行管理。
                            </p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="https://docs.rancher.cn/os/">
                                <h1>RancherOS</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>
                                RancherOS是在生产环境中运行Docker的最小操作系统,
                                RancherOS中的所有组件都是以容器运行。
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default Home;
