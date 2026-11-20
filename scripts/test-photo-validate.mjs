// Unit test for badge-photo upload validation (src/lib/gt/validate.ts). esbuild-bundles the TS and
// drives validateSubmission with a tiny image-only form. Run: node scripts/test-photo-validate.mjs
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entry = `export * from ${JSON.stringify(path.join(ROOT, "src/lib/gt/validate.ts"))};`;
const built = await esbuild.build({
  stdin: { contents: entry, resolveDir: ROOT, sourcefile: "entry.ts", loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "node", target: "node22",
});
const lib = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);

let pass = 0, fail = 0;
const assert = (c, m) => (c ? pass++ : (fail++, console.log(`FAIL: ${m}`)));

const form = { id: "t", title: "", intro: "", submitLabel: "", fields: [{ name: "badgePhoto", label: "Your photo", type: "image" }] };
const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const fd = (file) => { const f = new FormData(); if (file) f.append("badgePhoto", file); return f; };

// valid jpg accepted and returned as photo
let r = await lib.validateSubmission(form, fd(new File([jpg], "me.jpg", { type: "image/jpeg" })));
assert(Object.keys(r.errors).length === 0 && r.photo && r.photo.name === "me.jpg", "valid jpg accepted as photo");

// optional: no file -> no error, photo null
r = await lib.validateSubmission(form, fd(null));
assert(Object.keys(r.errors).length === 0 && r.photo === null, "missing optional photo is fine");

// non-image rejected
r = await lib.validateSubmission(form, fd(new File([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])], "x.jpg", { type: "image/jpeg" })));
assert(r.errors.badgePhoto && r.photo === null, "non-image bytes rejected despite jpg name/type");

// oversized rejected
const big = new Uint8Array(8 * 1024 * 1024 + 1); big.set(jpg, 0);
r = await lib.validateSubmission(form, fd(new File([big], "big.jpg", { type: "image/jpeg" })));
assert(r.errors.badgePhoto && /8 MB/.test(r.errors.badgePhoto), "over-8MB photo rejected");

// required image enforced
const reqForm = { ...form, fields: [{ name: "badgePhoto", label: "Your photo", type: "image", required: true }] };
r = await lib.validateSubmission(reqForm, fd(null));
assert(r.errors.badgePhoto, "required image enforced when missing");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
