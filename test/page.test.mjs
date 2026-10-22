import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const script = await readFile(
  new URL("../cookies.js", import.meta.url),
  "utf8",
);
const privacy = await readFile(
  new URL("../privacy.html", import.meta.url),
  "utf8",
);
const copyright = await readFile(
  new URL("../copyright.html", import.meta.url),
  "utf8",
);
const cookies = await readFile(
  new URL("../cookies.html", import.meta.url),
  "utf8",
);
const logo = await readFile(
  new URL("../logos/unimelb-vertical.svg", import.meta.url),
  "utf8",
);

describe("platform overview page", () => {
  it("keeps the platform contact address and a white page", () => {
    assert.match(css, /background:\s*#fff/);
    assert.doesNotMatch(html, /Hort Innovation/);
    assert.doesNotMatch(html, /Wikimedia/);
    assert.match(html, /pictures\/hero-orchard\.jpg/);
    assert.match(html, /agriculture-benchmarking@lists\.unimelb\.edu\.au/);
    assert.match(html, /Level 3, Building 194/);
    assert.doesNotMatch(html, /austruf@lists\.unimelb\.edu\.au/);
    assert.doesNotMatch(html, /hazelnut-benchmarking@lists\.unimelb\.edu\.au/);
    assert.doesNotMatch(import.meta.url, /\/apps\/agribenchmarking\//);
  });

  it("links the two live industries and keeps AgriFutures out of the footer", () => {
    assert.match(html, /https:\/\/hazelnut\.agribenchmarking\.au\//);
    assert.match(html, /https:\/\/truffle\.agribenchmarking\.au\//);
    const footer = html.slice(html.indexOf("<footer"));
    assert.doesNotMatch(footer, /agrifutures/i);
    assert.match(footer, /logos\/unimelb-vertical\.svg/);
    assert.doesNotMatch(footer, /logos\/unimelb\.png/);
    const partners = html.slice(
      html.indexOf('id="collaborators"'),
      html.indexOf("<footer"),
    );
    assert.match(partners, /logos\/agrifutures\.png/);
    assert.match(partners, /logos\/csu\.png/);
    assert.match(partners, /logos\/hga\.jpg/);
  });

  it("uses a white footer and links privacy, copyright, and cookies", () => {
    assert.match(css, /footer\s*\{[^}]*background:\s*#fff/);
    assert.match(css, /footer\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
    assert.match(css, /\.section-collaborators\s*\{[^}]*background:\s*#fff/);
    const footer = html.slice(html.indexOf("<footer"));
    assert.match(footer, /href="privacy\.html"/);
    assert.match(footer, /href="copyright\.html"/);
    assert.match(footer, /href="cookies\.html"/);
    assert.match(html, /id="cookie-bar"/);
    assert.match(html, /id="cookie-accept"/);
    assert.match(script, /ahb_cookie_choice=accepted/);
    assert.match(script, /addEventListener\(\s*"click"/);
    assert.doesNotMatch(script, /google-analytics|gtag|facebook|doubleclick/i);
    assert.match(privacy, /Privacy and Data Protection\s+Act\s+2014/);
    assert.match(privacy, /MPF1104/);
    assert.match(privacy, /https:\/\/www\.unimelb\.edu\.au\/privacy/);
    assert.doesNotMatch(privacy, /Smart Fertiliser/i);
    assert.match(copyright, /https:\/\/copyright\.unimelb\.edu\.au\//);
    assert.match(cookies, /ahb_cookie_choice/);
    assert.match(cookies, /does not use advertising or analytics cookies/i);
  });

  it("uses the vertical housed University mark at full size with clear space", () => {
    assert.match(logo, /#000F46/);
    assert.match(logo, /id="Background"/);
    assert.match(logo, /id="Nike"/);
    assert.match(css, /\.uni-mark\s*\{[^}]*padding:\s*24px/);
    assert.match(css, /\.uni-mark img\s*\{[^}]*width:\s*112px/);
    assert.match(css, /\.uni-mark img\s*\{[^}]*height:\s*112px/);
    assert.doesNotMatch(
      css,
      /\.uni-mark img\s*\{[^}]*(filter|border-radius:\s*(?!0)\d)/,
    );
  });
});
