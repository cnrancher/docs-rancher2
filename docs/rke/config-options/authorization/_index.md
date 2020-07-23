---
title: Authorization
---

Kubernetes 支持多个[授权模块](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#authorization-modules)。目前，RKE 只支持[RBAC 模块](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)。

默认情况下，RKE 会启用 RBAC 授权策略。如果你想关闭 RBAC 授权策略，请在`cluster.yml`中将设置授权模式为`none`。虽然 RKE 支持手动关闭 RBAC 授权策略，但是关闭 RBAC 授权策略会有一定的风险，我们不建议用户关闭 RBAC 授权策略。

```yaml
authorization:
  # Use `mode: none` to disable authorization
  mode: rbac
```
