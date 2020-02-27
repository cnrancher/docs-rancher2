---
title: Upgrades and Rollbacks
---

#### Upgrading Rancher

- [Upgrades](/docs/upgrades/upgrades/)

#### Rolling Back Unsuccessful Upgrades

In the event that your Rancher Server does not upgrade successfully, you can rollback to your installation prior to upgrade:

- [Rollbacks for Rancher installed with Docker](/docs/upgrades/single-node-rollbacks)
- [Rollbacks for Rancher installed on a Kubernetes cluster](/docs/upgrades/ha-server-rollbacks)

> **Note:** If you are rolling back to versions in either of these scenarios, you must follow some extra [instructions](/docs/upgrades/rollbacks/) in order to get your clusters working.
>
> - Rolling back from v2.1.6+ to any version between v2.1.0 - v2.1.5 or v2.0.0 - v2.0.10.
> - Rolling back from v2.0.11+ to any version between v2.0.0 - v2.0.10.
