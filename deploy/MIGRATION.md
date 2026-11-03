# Inactive ECS deployment containment

The read-only production inventory on 2026-11-03 found `tc-bus-api-serverless/tc-bus-api-svc` with both desired and running counts zero. This PR removes the old Auth0 credential broker, SSM-to-shell helper and `org-global` context from CircleCI and blocks the local deployment entry points. It does not reactivate, delete or modify any AWS service. No replacement IAM role is provisioned for an inactive workload.

[prod-inactive-baseline.json](https://github.com/topcoder-platform/v6-services-iac/blob/main/services/tc-bus-api/deploy/prod-inactive-baseline.json) records the exact observed task/role/container identifiers and runtime secret references only, not values. Zero capacity is an observation, not a declaration that this service is permanently retired. The CI job explicitly reports that deployment is disabled; it does not claim an application build or rollout succeeded.

Before merging, confirm with the service owner whether to keep this workload inactive or plan a separately reviewed reactivation. Remove this project's Auth0/static AWS variables and shared-context access in CircleCI and disable any other old release jobs. Removing a context from YAML alone does not remove project-level variables or revoke the legacy shared AWS role. Do not revoke that shared role until its remaining consumers migrate.

A future reactivation must adopt [tc-deploy-scripts #40](https://github.com/topcoder-platform/tc-deploy-scripts/pull/40): verify actual dev/prod resources and exact CircleCI project/organization identity; commit non-secret manifests; create a service-specific OIDC role and matching boundary explicitly denying SSM, Secrets Manager, KMS decryption and role chaining; build without credentials; publish immutable scanned digests; validate non-root startup, real container health and rollback. Provision runtime secret references through IaC and scope the ECS execution role to them. An administrator controls the intentional capacity change; ordinary image deployment must not silently resurrect the service.

This PR targets the existing `master` branch. Apply the deployment disablement to every still-enabled release branch/job before revoking credentials. The saved dev AWS session is expired, so dev state is not asserted. No live reactivation test was attempted.

## Infrastructure source

IAM templates and detailed AWS baselines are maintained in the private [v6-services-iac service directory](https://github.com/topcoder-platform/v6-services-iac/tree/main/services/tc-bus-api). Provision infrastructure separately with an administrator identity; application CI does not fetch that repository or install IAM. Required application manifests and health-check proposals remain here.
