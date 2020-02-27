---
title: NGINX Configuration
---

> #### **Important: RKE add-on install is only supported up to Rancher v2.0.8**
>
> Please use the Rancher Helm chart to install Rancher on a Kubernetes cluster. For details, see the [Kubernetes Install - Installation Outline](/docs/installation/k8s-install/#installation-outline).
>
> If you are currently using the RKE add-on install method, see [Migrating from a Kubernetes Install with an RKE Add-on](/docs/upgrades/upgrades/migrating-from-rke-add-on/) for details on how to move to using the helm chart.

### Install NGINX

Start by installing NGINX on your load balancer host. NGINX has packages available for all known operating systems.

For help installing NGINX, refer to their [install documentation](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/).

### Create NGINX Configuration

See [Example NGINX config](/docs/installation/options/chart-options/#example-nginx-config).

### Run NGINX

- Reload or restart NGINX

  ```
  # Reload NGINX
  nginx -s reload

  # Restart NGINX
  # Depending on your Linux distribution
  service nginx restart
  systemctl restart nginx
  ```

### Browse to Rancher UI

You should now be to able to browse to `https://FQDN`.
