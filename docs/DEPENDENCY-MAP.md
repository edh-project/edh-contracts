# Contract dependency map

```text
             edh-contracts
              /          \
             v            v
       edh-observer     edh-core
```

Neither implementation repository may import the other's source.

## X1 first Observer seam

The browser-facing seam available to X2 is:

- Observer event records
- lifecycle checkpoint/event records
- dashboard composition envelope
- executor-policy public state
- task-admission command body

The dashboard's nested subsystem payloads remain open at X1. X2 may add narrower public contracts only when a concrete browser consumer requires them and frozen source behavior supports the constraint.
