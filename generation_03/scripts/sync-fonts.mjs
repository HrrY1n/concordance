/**
 * Copies the latin + latin-ext variable subsets we actually ship out of the
 * installed @fontsource-variable packages into public/fonts. Keeping only
 * these six files is how the font budget stays at 2 families, subsets only.
 * Run once (or after bumping the fontsource versions): `npm run sync-fonts`.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "public", "fonts");
mkdirSync(out, { recursive: true });

// In an npm workspace, dependencies are hoisted — walk up until node_modules.
let modulesRoot = root;
while (!existsSync(join(modulesRoot, "node_modules", "@fontsource-variable"))) {
  const parent = dirname(modulesRoot);
  if (parent === modulesRoot) throw new Error("@fontsource-variable not found upstream");
  modulesRoot = parent;
}

const files = [
  // Inter — interface + body latin (variable weight axis, normal)
  ["@fontsource-variable/inter", "inter-latin-wght-normal.woff2"],
  ["@fontsource-variable/inter", "inter-latin-ext-wght-normal.woff2"],
  // Newsreader — display serif, normal + italic (variable weight axis)
  ["@fontsource-variable/newsreader", "newsreader-latin-wght-normal.woff2"],
  ["@fontsource-variable/newsreader", "newsreader-latin-ext-wght-normal.woff2"],
  ["@fontsource-variable/newsreader", "newsreader-latin-wght-italic.woff2"],
  ["@fontsource-variable/newsreader", "newsreader-latin-ext-wght-italic.woff2"],
];

for (const [pkg, file] of files) {
  const from = join(modulesRoot, "node_modules", pkg, "files", file);
  copyFileSync(from, join(out, file));
  console.log(`copied ${pkg}/files/${file} -> public/fonts/${file}`);
}
