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
  assert.match(html, /<title>Myrakal — Healthcare operations, optimized\.<\/title>/);
  assert.match(html, /Healthcare operations, optimized\./);
  assert.match(html, /What deserves/);
  assert.match(html, /NEXT BEST ALLOCATION/);
  assert.match(html, /Sometimes the best next action is no action/);
  assert.equal((html.match(/<section class=/g) ?? []).length, 4);
  assert.match(html, /href="\/request-access"/);
  assert.doesNotMatch(html, /APPOINTMENT\.WRITE/);
});

test("renders trust, legal, and request routes", async () => {
  for (const [path, expected] of [["/privacy", "marketing website"], ["/security", "Trust is operational infrastructure"], ["/terms", "Website terms"], ["/request-access", "Put Myrakal to work"]]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(expected, "i"), path);
  }
});
