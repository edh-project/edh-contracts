# EDH Contracts Boundaries

## Public contract surface

A definition belongs here when both public and private EDH components need to agree on it and the definition can be published without exposing private implementation or configuration.

Examples may include:

- JSON schemas
- Event type definitions
- Stable identifiers
- Lifecycle state vocabulary
- Correlation and provenance fields
- Compatibility/version metadata
- API request and response shapes

## What does not belong here

- Runtime executors
- Admission implementation
- Policy implementation
- Verifier implementation
- Browser UI
- Secrets or credentials
- Machine-local paths and mutable state
- Internal implementation details that are not interoperability contracts

## Versioning

Consumers should depend on an explicit version, revision, or package artifact.

Do not use floating cross-repository source imports.

## Dependency graph

`edh-core -> edh-contracts <- edh-observer`

No reverse dependency is allowed.
