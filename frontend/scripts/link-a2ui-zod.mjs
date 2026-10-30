/**
 * Gives the A2UI catalog code under `src/a2ui/` the zod 3 copy that
 * `@copilotkit/a2ui-renderer` itself uses, while the rest of the app keeps the
 * root zod 4.
 *
 * Why: two doc pages need different zod majors from the same `import { z } from
 * "zod"`. The A2UI binder (`@a2ui/web_core`) decides whether a prop is bindable
 * by reading zod 3 internals (`_def.typeName`), so A2UI definitions built with
 * zod 4 never resolve `{ path }` bindings. `@json-render/react` has a hard peer
 * dependency on zod ^4. One root copy cannot serve both.
 *
 * Module resolution walks up from the importing file, so a `node_modules/zod`
 * inside `src/a2ui/` wins for those files only. It is a symlink to the
 * renderer's own nested copy rather than a second install, so TypeScript sees
 * the same declarations the renderer's `CatalogDefinitions` type was built from.
 *
 * Runs as `postinstall`; `src/a2ui/node_modules/` is gitignored with every other
 * node_modules directory.
 */
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  frontend,
  "node_modules/@copilotkit/a2ui-renderer/node_modules/zod",
);
const linkDir = path.join(frontend, "src/a2ui/node_modules");
const link = path.join(linkDir, "zod");

if (!existsSync(target)) {
  // npm hoisted a single zod 3 copy (root zod is no longer 4) — nothing to scope.
  console.warn(`[link-a2ui-zod] ${path.relative(frontend, target)} not found; skipped`);
  process.exit(0);
}

mkdirSync(linkDir, { recursive: true });
rmSync(link, { recursive: true, force: true });
symlinkSync(path.relative(linkDir, target), link, "dir");
console.log(`[link-a2ui-zod] src/a2ui/node_modules/zod -> ${path.relative(frontend, target)}`);
