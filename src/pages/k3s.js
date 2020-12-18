import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

const description =
    "Rancher中文文档由Rancher中国研发团队翻译并重新编排，每周更新，与Rancher英文文档保持同步。另一方面，Rancher中文文档也是Kubernetes入门的重要性内容文档，用户可以从中获得K8S相关的有用知识。";
const keywords = ["Rancher文档", "k8s文档", "容器管理平台", "Kubernetes集群"];
const metaTitle = " K3S文档 | Rancher";
function findAndAppendSubGroups(all, metadata, baseUrl, subItems) {
    subItems.forEach((sub) => {
        if (typeof sub === "string") {
            const label = metadata.docs.k3s[sub];
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
    const docs = sidebars.k3s;
    Object.keys(docs).forEach((categoryKey) => {
        const allSubGroups = [];
        findAndAppendSubGroups(
            allSubGroups,
            metadata,
            baseUrl,
            docs[categoryKey]
        );
        const description = metadata.categories.k3s[categoryKey];
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
    const title = "K3s 中文文档";
    return (
        <Layout title={metaTitle} description={description} keywords={keywords}>
            <header className={classnames("hero", styles.heroBanner)}>
                <div className="container">
                    <h1 className="hero__title">{title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className="text-xs text-gray">
                        在任何页面，您都可以单击左上角的logo回到本页。想要下载离线文档，请单击导航栏中的“获取
                        PDF 文档”。
                    </div>
                </div>
            </header>
            <main>
                <div
                    className={classnames(styles.tocContainer, styles.wrapper)}
                >
                    <ul className={styles.sectionList}>
                        {toc.map((group) => {
                            const sectionTitleUrl = group.subGroups[0]
                                ? group.subGroups[0].key
                                : baseUrl;
                            return (
                                <li key={group.key}>
                                    <h3>
                                        <a href={sectionTitleUrl}>
                                            {group.key}
                                        </a>
                                    </h3>
                                    <span className="text-xs text-grey">
                                        {group.description}
                                    </span>
                                    <ul className={styles.subGroupList}>
                                        {group.subGroups.map(
                                            (subGroup, index) => {
                                                return (
                                                    <li key={subGroup.key}>
                                                        <a href={subGroup.key}>
                                                            {subGroup.label}
                                                        </a>
                                                        {(() => {
                                                            if (
                                                                siteConfig
                                                                    .customFields
                                                                    .stable ===
                                                                subGroup.label
                                                            ) {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            styles.stable
                                                                        }
                                                                    >
                                                                        稳定版
                                                                    </span>
                                                                );
                                                            }
                                                            if (
                                                                "版本说明" ===
                                                                    group.key &&
                                                                index === 0
                                                            ) {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            styles.latest
                                                                        }
                                                                    >
                                                                        最新版
                                                                    </span>
                                                                );
                                                            }
                                                            /* if (
                                                                "产品介绍" ===
                                                                    group.key &&
                                                                index === 0
                                                            ) {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            styles.vedio
                                                                        }
                                                                    >
                                                                        视频
                                                                    </span>
                                                                ); 
                                                            }*/
                                                        })()}
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main>
        </Layout>
    );
}

export default Home;
