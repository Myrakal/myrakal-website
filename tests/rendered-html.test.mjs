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
  assert.match(html, /Myrakal reconstructs what is still unfinished/);
  assert.match(html, /YOUR PMS REMEMBERS THE TREATMENT/);
  assert.match(html, /What should happen now\?/);
  assert.match(html, /NOT A QUEUE\. A DECISION SYSTEM\./);
  assert.match(html, /INTERACTIVE METHOD/);
  assert.match(html, /NO SAAS ROI MATH\./);
  assert.match(html, /\$71,200/);
  assert.match(html, /Find out what your practice/);
  assert.match(html, /Limited pilot access · Dental practices only/);
  assert.match(html, /Practice-management systems remain the system of record/);
  assert.equal((html.match(/<section class=/g) ?? []).length, 4);
  assert.match(html, /href="\/request-access"/);
  assert.match(html, /<button class="case-live__control"/);
  assert.match(html, /role="tablist"/);
  assert.doesNotMatch(html, /Healthcare operations, optimized/);
  assert.doesNotMatch(html, /APPOINTMENT\.WRITE/);
});

test("renders trust, legal, and request routes", async () => {
  for (const [path, expected] of [["/privacy", "marketing website"], ["/security", "Trust is operational infrastructure"], ["/terms", "Website terms"], ["/request-access", "Put Myrakal to work"]]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(expected, "i"), path);
  }
});
