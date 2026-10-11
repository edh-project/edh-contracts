# EDH Contracts

Public, implementation-neutral contracts shared by the EDH repository family.

Dependency direction:

`edh-core -> edh-contracts <- edh-observer`

X1 extracts only definitions supported by the frozen source baseline. Runtime handlers, filesystem defaults, private policy and authority stay outside this repository.

## Namespaces

- `schemas/` — task/planning envelopes
- `knowledge/schemas/` — knowledge event/record formats
- `events/` — observer event records
- `lifecycle/` — run checkpoint/lifecycle event records
- `bridge/` — stable Browser/Companion interop envelopes needed for the first Observer extraction seam

The X1 dashboard contract intentionally freezes the composition envelope while leaving nested subsystem objects open. X2 may tighten a nested public shape only when a browser consumer actually requires it and source behavior proves it.
