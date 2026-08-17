# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-17

### 12:35 UTC — 1 page, highest severity high

**High — Your Components · Interactive** · _local snapshot edit, not an upstream change_

`/generative-ui/your-components/interactive` · route `/generative-ui/your-components/interactive` · under “Create a frontend human-in-the-loop tool” · in a `tsx` block

3 code lines changed.

````diff
- 
+ import { useHumanInTheLoop } from "@copilotkit/react-core/v2"; // [!code highlight]
+ import { z } from "zod";
````
