import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const port = 3900 + Math.floor(Math.random() * 90);
const base = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  server = spawn(
    process.execPath,
    [fileURLToPath(new URL("../server.mjs", import.meta.url))],
    {
      env: { ...process.env, PORT: String(port) },
    },
  );
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(base);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  throw new Error("server did not start");
});
after(async () => {
  server.kill();
  await once(server, "exit");
});

describe("static server", () => {
  it("serves the site", async () => {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
  });

  it("answers 400 to a malformed escape and keeps running", async () => {
    assert.equal((await fetch(`${base}/%E0%A4%A`)).status, 400);
    assert.equal((await fetch(`${base}/`)).status, 200);
  });

  it("never serves its own source or a dotfile", async () => {
    for (const path of [
      "/server.mjs",
      "/package.json",
      "/test/page.test.mjs",
      "/.gitignore",
    ]) {
      assert.equal((await fetch(`${base}${path}`)).status, 404, path);
    }
  });

  it("refuses an encoded traversal", async () => {
    assert.equal((await fetch(`${base}/..%2f..%2fetc%2fhosts`)).status, 403);
  });
});
