# EDH Agent Instructions

Read this file before modifying this repository.

## Project family

EDH is split into independent repositories under the GitHub organization `edh-project`.

Repository boundary != process boundary != trust boundary != deployment boundary.

Shared interoperability definitions belong in `edh-contracts`. Public Observer code must not import private Core source. Private Core must not import Observer implementation.

## Migration source

The current extraction source is:

`/Users/dzzk/WORK/_bridge-local-execution`

The local family workspace is:

`/Users/dzzk/WORK/_edh`

Cross-repository migration orchestration lives under:

`/Users/dzzk/WORK/_edh/_transit`

## Safety

- Copy first during extraction; do not delete source material unless a later cutover explicitly authorizes it.
- Do not rewrite Git history.
- Do not alter the running production Companion without explicit authorization.
- Do not create new runtime network/service boundaries merely because repositories are split.
- Never publish credentials, secrets, machine-local mutable state, or private implementation into public repositories.
- Preserve provenance from extracted files back to source commit/path.
- Stop bulk migration when a missing contract/boundary is discovered; repair the seam first.

## Agent compatibility

These instructions are model/runtime-neutral and are intended for ChatGPT, OpenHands, OpenCode, Qwen, Llama-family models, Hermes, Ollama-hosted models, and comparable execution runtimes.

If a runtime supports repository instructions such as `AGENTS.md`, treat this file as authoritative for repository-local work.

## Repository role: edh-contracts

Visibility intent: PUBLIC.

Own only implementation-neutral interoperability contracts: schemas, event vocabulary, lifecycle vocabulary, provenance/correlation structures, MCP/API shapes, compatibility metadata.

Do not add runtime execution, admission, policy, verifier, browser UI, credentials, or machine-local state.

Dependency rule:

`edh-core -> edh-contracts <- edh-observer`

This repository must not depend on either implementation repository.
