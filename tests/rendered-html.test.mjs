import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the four-section Myrakal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Myrakal — Healthcare work, resolved\.<\/title>/);
  assert.match(html, /Care gets diagnosed\. Then life happens\./);
  assert.match(html, /ENGINE \/ READY/);
  assert.match(html, /STATE \/ MONITORING/);
  assert.match(html, /Reconstruct/);
  assert.match(html, /Resolve/);
  assert.match(html, /Open engine/);
  assert.match(html, /MYRAKAL RECORDS WHAT HAPPENED NEXT\./);
  assert.match(html, /Waiting on insurance is not saying no\./);
  assert.match(html, /INTERACTIVE \/ CASE 01847/);
  assert.match(html, /TERMINAL \/ SCHEDULED/);
  assert.match(html, /NOT A QUEUE\./);
  assert.match(html, /INTERACTIVE \/ SELECT A FACTOR/);
  assert.match(html, /COST/);
  assert.match(html, /Human judgment/);
  assert.match(html, /\$71,200/);
  assert.match(html, /No mystery score/);
  assert.match(html, /Find what your practice/);
  assert.match(html, /Practice-management systems remain the system of record/);
  assert.equal((html.match(/<section class=/g) ?? []).length, 4);
  assert.match(html, /href="\/request-access"/);
  assert.match(html, /ADVANCE CASE/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /\/og-v2\.png/);
  assert.doesNotMatch(html, /Healthcare operations, optimized/);
  assert.doesNotMatch(html, /What should happen now\?/);
  assert.doesNotMatch(html, /A MISSION, NOT A REMINDER/);
  assert.doesNotMatch(html, /NO SAAS ROI MATH/);
});

test("renders trust, legal, and request routes", async () => {
  for (const [path, expected] of [["/privacy", "marketing website"], ["/security", "Trust is operational infrastructure"], ["/terms", "Website terms"], ["/request-access", "Put Myrakal to work"]]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(expected, "i"), path);
  }
});
