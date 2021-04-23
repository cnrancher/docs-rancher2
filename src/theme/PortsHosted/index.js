import React from 'react';
import styles from './styles.module.css';

function PortsImportedHosted() {
  return (
    <table className={styles.solid}>
      <thead>
        <tr>
          <th>从 / 到</th>
          <th>Rancher 节点</th>
          <th>托管的 / 导入的集群</th>
          <th>外部负载均衡</th>
          <th>互联网</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Rancher 节点 <sup>(1)</sup>
          </td>
          <td></td>
          <td className={styles.highlight}>
            Kubernetes API <br />
            端点端口 <sup>(2)</sup>
          </td>
          <td></td>
          <td className={styles.highlight}>
            git.rancher.io <sup>(3)</sup>:<br />
            35.160.43.145:32
            <br />
            35.167.242.46:32
            <br />
            52.33.59.17:32
          </td>
        </tr>
        <tr>
          <td>托管的 / 导入的集群</td>
          <td className={styles.highlight}>
            443 TCP <sup>(4)(5)</sup>
          </td>
          <td></td>
          <td className={styles.highlight}>
            443 TCP <sup>(5)</sup>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            外部负载均衡 <sup>(5)</sup>
          </td>
          <td className={styles.highlight}>
            80 TCP
            <br />
            443 TCP <sup>(6)</sup>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>API / UI 客户端</td>
          <td className={styles.highlight}>
            80 TCP <sup>(4)</sup>
            <br />
            443 TCP <sup>(4)</sup>
          </td>
          <td></td>
          <td className={styles.highlight}>
            80 TCP
            <br />
            443 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td>工作负载客户端</td>
          <td></td>
          <td className={styles.highlight}>
            取决于集群 / 供应商 <sup>(7)</sup>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={5}>
            注意：
            <br />
            <br />
            1. 运行Rancher的单节点或者Rancher高可用的节点。
            <br />
            2. 仅适用于托管集群。
            <br />
            3. 需要用来拉取Rancher应用商店库。
            <br />
            4. 适用于不使用外部负载均衡的情况。
            <br />
            5. 来自 worker 节点。
            <br />
            6. 仅适用于SSL没有在外部负载均衡终止。
            <br />
            7. 通常是 Ingress 负载均衡和/或 nodeport。
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default PortsImportedHosted;
