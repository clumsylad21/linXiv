// Run: node --experimental-transform-types --test src/lib/graph/style.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DIM_OPACITY,
  ellipsize,
  eventsFor,
  FULL_OPACITY,
  opacityFor,
  SEL_DIM_OPACITY,
} from "./style.ts";

const width = (s: string) => s.length * 10; // 10px per character

test("a label that fits is left alone", () => {
  assert.equal(ellipsize("short", 100, width), "short");
});

test("a long label keeps the longest prefix that fits with the ellipsis", () => {
  // 100px holds 9 characters plus "…".
  assert.equal(ellipsize("abcdefghijklmnop", 100, width), "abcdefghi…");
});

test("a label exactly at the cap is cut, as cytoscape did", () => {
  assert.equal(ellipsize("abcdefghij", 100, width), "abcdefghi…");
});

test("a cap narrower than one character leaves just the ellipsis", () => {
  assert.equal(ellipsize("abc", 5, width), "…");
});

test("filter visibility takes precedence over selection", () => {
  assert.equal(opacityFor(false, true, true, false), DIM_OPACITY);
  assert.equal(opacityFor(false, true, true, true), 0);
});

test("selected visible elements stay fully opaque", () => {
  assert.equal(opacityFor(true, true, true, false), FULL_OPACITY);
});

test("an unselected visible element dims while something else is selected", () => {
  assert.equal(opacityFor(true, false, true, false), SEL_DIM_OPACITY);
});

test("visible elements are fully opaque when nothing is selected", () => {
  assert.equal(opacityFor(true, false, false, false), FULL_OPACITY);
});

test("events are disabled only at zero opacity", () => {
  assert.equal(eventsFor(0), "no");
  assert.equal(eventsFor(DIM_OPACITY), "yes");
  assert.equal(eventsFor(SEL_DIM_OPACITY), "yes");
  assert.equal(eventsFor(FULL_OPACITY), "yes");
});
