# X1 — Contracts Extraction Result

Status: **X1 PASS**

Source baseline commit:

`9ad516ef267fa18075ac15cc4abd78d8553c5122`

Source branch: `chore/local-execution`

Release state at close: `P1 active / P1-05 in progress / P2 pending`

## Source working-tree note

The source commit remained unchanged during X1. The source working tree contains documentation/backlog changes created by this transit work plus the pre-existing protected untracked files. No production runtime code was rewritten for X1.

Observed dirty paths at close include:

- `TODO.md`
- `docs/ADAPTIVE-LOCAL-MODEL-EXECUTION-HARNESS.md`
- `docs/OBS-08-LOCAL-INFERENCE-ACTOR-TRUTH.md`
- `evidence/obs-08-x1-local-inference-visibility-20261012.md`
- protected pre-existing `docs/GW-XD-01-CROSS-DEVICE-ACTOR-PRESENCE.md`
- protected pre-existing `docs/P0-ACCEPTANCE-CHECKLIST-20261010.md`

## Extracted contract surface

Verbatim public schemas:

- `schemas/task-envelope.schema.json`
- `schemas/escalation-packet.schema.json`
- `knowledge/schemas/event.schema.json`
- `knowledge/schemas/record.schema.json`

Normalized public contracts:

- `events/observer-event.schema.json`
- `lifecycle/checkpoint.schema.json`
- `lifecycle/event.schema.json`
- `bridge/executor-policy-state.schema.json`
- `bridge/task-admission-command.schema.json`
- `bridge/dashboard-state.schema.json`

Supporting artifacts:

- `provenance.json`
- `docs/DEPENDENCY-MAP.md`
- `fixtures/dashboard-state.min.json`
- `tests/validate.mjs`

## Semantic reconciliation

The lifecycle checkpoint contract was explicitly repaired against the producer behavior in `scripts/run-lifecycle.mjs`.

It does not invent stricter semantics:

- `plan_id` may be null;
- `task_id` may be null;
- status is not closed to a four-value enum;
- checkpoint objects remain extensible because `updateLifecycle` merges arbitrary patch fields.

This was independently revalidated by the Qwen semantic-repair v2 experiment.

## Bridge / first Observer seam

X1 freezes these browser/runtime interoperability facts:

- dashboard state is a revisioned composition envelope;
- Observer receives `observer`, `project_tasks`, `rdc`, `prepared_dispatch`, and `executor_policy`;
- executor-policy public state has modes `AUTO | EDH | RDC | COMPARE`;
- task-admission command bodies are `take(task_id)`, `take_next`, `release`, or `prepare`.

Nested dashboard subsystem objects deliberately remain open in X1. This avoids inventing implementation constraints before the concrete X2 browser consumers are separated. X2 may tighten only the public fields it actually consumes and can prove from source behavior.

## Verification

Independent contracts test:

`npm --prefix /Users/dzzk/WORK/_edh/edh-contracts test`

Result:

- PASS
- 10 contract JSON files validated
- permissive lifecycle semantics asserted
- bridge envelope asserted

Source regression:

`npm --prefix /Users/dzzk/WORK/_bridge-local-execution test`

Result:

- **208 / 208 PASS**

No X1 test imports source from future `edh-core` or `edh-observer`.

## Dependency result

`edh-core -> edh-contracts <- edh-observer`

No direct implementation dependency between Core and Observer is introduced.

## Remaining ambiguities

These are intentionally deferred, not X1 blockers:

1. Exact nested `observer`, `project_tasks`, `rdc`, and `prepared_dispatch` dashboard field schemas should be tightened only while extracting the concrete Observer consumers in X2.
2. Runtime-only MCP/OAuth/browser-command schemas not consumed by the first Observer seam remain implementation-side until a shared consumer exists.
3. Authority semantics remain implementation-owned: Task/Run/Policy/Verifier truth does not move into Contracts or Observer.

## Next seam

Proceed to **X2 — Observer Extraction**.

X2 must prove from a clean standalone `edh-observer` checkout that:

- Chrome/Firefox build and tests run without the Core source tree;
- all EDH shared definitions are consumed from the pinned `edh-contracts` revision/package;
- recorded dashboard/event/lifecycle fixtures render without Core;
- live integration reaches the existing Companion only through authenticated runtime interfaces;
- no Task/Run/Policy/PASS authority moves into Observer.

Do not begin X3 until the Observer independence gate is measured and recorded.
