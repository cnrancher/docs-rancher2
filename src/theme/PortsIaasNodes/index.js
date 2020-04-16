import React from 'react';
import styles from './styles.module.css';

function PortsIaasNodes() {
  return (
    <table className={styles.solid}>
      <thead>
        <tr>
          <th>从 / 到</th>
          <th>Rancher 节点</th>
          <th>etcd 节点</th>
          <th>Control Plane 节点</th>
          <th>Worker 节点</th>
          <th>外部负载均衡</th>
          <th>互联网</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowSpan={2}>
            Rancher 节点 <sup>(1)</sup>
          </td>
          <td></td>
          <td colSpan={3} className={styles.highlight}>
            22 TCP
          </td>
          <td></td>
          <td rowSpan={2} className={styles.highlight}>
            git.rancher.io <sup>(2)</sup>:<br />
            35.160.43.145:32
            <br />
            35.167.242.46:32
            <br />
            52.33.59.17:32
          </td>
        </tr>
        <tr>
          <td></td>
          <td colSpan={3} className={styles.highlight}>
            2376 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={5}>etcd 节点</td>
          <td rowSpan={5} className={styles.highlight}>
            443 TCP <sup>(3)</sup>
          </td>
          <td className={styles.highlight}>2379 TCP</td>
          <td></td>
          <td></td>
          <td rowSpan={5} className={styles.highlight}>
            443 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td className={styles.highlight}>2380 TCP</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td className={styles.highlight}>6443 TCP</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={3} className={styles.highlight}>
            8472 UDP
          </td>
          <td></td>
        </tr>
        <tr>
          <td className={styles.highlight}>
            9099 TCP <sup>(4)</sup>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={7}>Control Plane 节点</td>
          <td rowSpan={7} className={styles.highlight}>
            443 TCP <sup>(3)</sup>
          </td>
          <td className={styles.highlight}>2379 TCP</td>
          <td></td>
          <td></td>
          <td rowSpan={7} className={styles.highlight}>
            443 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td className={styles.highlight}>2380 TCP</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td className={styles.highlight}>6443 TCP</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={3} className={styles.highlight}>
            8472 UDP
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={3} className={styles.highlight}>
            10250 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td className={styles.highlight}>
            9099 TCP <sup>(4)</sup>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td className={styles.highlight}>
            10254 TCP <sup>(4)</sup>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={4}>Worker 节点</td>
          <td rowSpan={4} className={styles.highlight}>
            443 TCP <sup>(3)</sup>
          </td>
          <td></td>
          <td className={styles.highlight}>6443 TCP</td>
          <td></td>
          <td rowSpan={4} className={styles.highlight}>
            443 TCP
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={3} className={styles.highlight}>
            8472 UDP
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td className={styles.highlight}>
            9099 TCP <sup>(4)</sup>
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td className={styles.highlight}>
            10254 TCP <sup>(4)</sup>
          </td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={2}>
            外部负载均衡 <sup>(5)</sup>
          </td>
          <td className={styles.highlight}>80 TCP</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td className={styles.highlight}>
            443 TCP <sup>(6)</sup>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={2}>API / UI 客户端</td>
          <td className={styles.highlight}>
            80 TCP <sup>(3)</sup>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className={styles.highlight}>
            80 TCP
            <br />
          </td>
          <td></td>
        </tr>
        <tr>
          <td className={styles.highlight}>
            443 TCP <sup>(3)</sup>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className={styles.highlight}>443 TCP</td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={3}>工作负载客户端</td>
          <td></td>
          <td></td>
          <td></td>
          <td className={styles.highlight}>
            30000-32767 TCP / UDP
            <br />
            (nodeport)
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td colSpan={2} className={styles.highlight}>
            80 TCP (Ingress)
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td colSpan={2} className={styles.highlight}>
            443 TCP (Ingress)
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={7}>
            注意：
            <br />
            <br />
            1. 运行Rancher的单节点或者Rancher高可用的节点。
            <br />
            2. 需要用来拉取Rancher应用商店库。
            <br />
            3. 适用于不使用外部负载均衡的情况。
            <br />
            4. 本地流量（非跨节点流量）。
            <br />
            5. 负责Rancher UI / API的负载均衡或反向代理。
            <br />
            6. 仅适用于SSL没有在外部负载均衡终止。
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default PortsIaasNodes;
