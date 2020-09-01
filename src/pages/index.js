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
    const title = "Rancher 2.x 中文文档";
    return (
        <Layout title={metaTitle} description={description} keywords={keywords}>
            <header className={classnames("hero", styles.heroBanner)}>
                <div className="container">
                    <img className="hero__logo" src="/img/rancher-logo-stacked-black.svg" />
                    <p className="hero__subtitle navigation__subtitle">{title}</p>
                </div>
            </header>
            <main>
                <div className="navigation__grid">
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                    <div className="navigation__item">
                        <div className="navigation__title">
                            <a href="#">
                                <h1>Rancher 1.x</h1>
                            </a>
                        </div>
                        <div className="navigation__content">
                            <p>Rancher帮助企业能够在生产环境中运行和管理Docker和Kubernetes，而无需从头开始构建容器服务平台。</p>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default Home;
