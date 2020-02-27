import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

function getToc(sidebars, baseUrl) {
  const out = [];
  const docs = sidebars.docs;
  docs.forEach(doc => {
    out.push({
      key: doc.label,
      description: doc.description,
      subGroups: doc.items.map(item => {
        const { label, id } = item;
        return {
          label,
          key: baseUrl + 'docs/' + id
        };
      })
    });
  });
  return out;
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const toc = getToc(siteConfig.customFields.sidebars, siteConfig.baseUrl);
  const title = siteConfig.title + ' 中文文档';
  return (
    <Layout title="中文文档" description={title}>
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className="text-xs text-gray">
            该文档为{siteConfig.title}
            版本的帮助文档，如果需要其它版本文档请点击导航栏中的“历史文档”
          </div>
        </div>
      </header>
      <main>
        <div className={classnames(styles.tocContainer, styles.wrapper)}>
          <ul className={styles.sectionList}>
            {toc.map(group => {
              return (
                <li key={group.key}>
                  <h3>
                    <a href={group.key}>{group.key}</a>
                  </h3>
                  <span className="text-xs text-grey">{group.description}</span>
                  <ul className={styles.subGroupList}>
                    {group.subGroups.map((subGroup, index) => {
                      return (
                        <li key={subGroup.key}>
                          <a href={subGroup.key}>{subGroup.label}</a>
                          {(() => {
                            if (
                              siteConfig.customFields.stable === subGroup.label
                            ) {
                              return (
                                <span className={styles.stable}>稳定版</span>
                              );
                            }
                            if ('版本说明' === group.key && index === 0) {
                              return (
                                <span className={styles.latest}>最新版</span>
                              );
                            }
                          })()}
                        </li>
                      );
                    })}
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
