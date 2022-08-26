import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

const description =
    "Rancher中文文档由Rancher中国研发团队翻译并重新编排，每周更新，与Rancher英文文档保持同步。另一方面，Rancher中文文档也是Kubernetes入门的重要性内容文档，用户可以从中获得K8S相关的有用知识。";
const keywords = [
    "超融合平台",
    "Kubernetes虚拟化管理",
    "虚拟化",
    "Kubernetes集群",
];
const metaTitle = " Harvester 1.0 文档 | Rancher";
function findAndAppendSubGroups(all, metadata, baseUrl, subItems) {
    subItems.forEach((sub) => {
        if (typeof sub === "string") {
            const label = metadata.docs.harvester1_0[sub];
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
    const docs = sidebars.harvester1_0;
    Object.keys(docs).forEach((categoryKey) => {
        const allSubGroups = [];
        findAndAppendSubGroups(
            allSubGroups,
            metadata,
            baseUrl,
            docs[categoryKey]
        );
        const description = metadata.categories.harvester1_0[categoryKey];
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
    const title = "Harvester 1.0 中文文档";
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
                    <div className= "text-note">   
                        注意：我们正在迁移 Harvester 文档，因此已暂停更新此站点上的文档。如需查阅最新文档，请先移步至 <a href="https://docs.harvesterhci.io/v1.0/">1.0 英文文档</a>。
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
