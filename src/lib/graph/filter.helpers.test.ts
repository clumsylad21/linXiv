// Run: node --experimental-transform-types --test src/lib/graph/filter.helpers.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import type { GraphMatch } from "./filter.ts";
import { drawnPapers, isNodeDrawn, matchedFor, sameIds } from "./filter.ts";

function match(over: Partial<GraphMatch> = {}): GraphMatch {
  return {
    papers: new Set(["p1"]),
    authors: new Set(["a1"]),
    tags: new Set(["t1"]),
    hiddenTypes: new Set(),
    isolate: false,
    drawnCount: 3,
    ...over,
  };
}

test("matchedFor returns the matched set for each node type", () => {
  const m = match();
  assert.equal(matchedFor(m, "paper"), m.papers);
  assert.equal(matchedFor(m, "author"), m.authors);
  assert.equal(matchedFor(m, "tag"), m.tags);
});

test("sameIds compares set membership rather than insertion order", () => {
  assert.equal(sameIds(new Set(["a", "b"]), new Set(["b", "a"])), true);
  assert.equal(sameIds(new Set(["a", "b"]), new Set(["a", "c"])), false);
  assert.equal(sameIds(new Set(["a"]), new Set(["a", "b"])), false);
});

test("drawnPapers returns matched papers unless the paper type is hidden", () => {
  assert.deepEqual([...drawnPapers(match())], ["p1"]);
  assert.deepEqual([...drawnPapers(match({ hiddenTypes: new Set(["paper"]) }))], []);
});

test("normal filtering keeps unmatched nodes drawn as ghosts", () => {
  const m = match();
  assert.equal(isNodeDrawn(m, "paper", "missing"), true);
});

test("hidden node types are never drawn", () => {
  const m = match({ hiddenTypes: new Set(["author"]) });
  assert.equal(isNodeDrawn(m, "author", "a1"), false);
});

test("isolate draws matches and removes non-matches", () => {
  const m = match({ isolate: true });
  assert.equal(isNodeDrawn(m, "paper", "p1"), true);
  assert.equal(isNodeDrawn(m, "paper", "missing"), false);
  assert.equal(isNodeDrawn(m, "author", "a1"), true);
  assert.equal(isNodeDrawn(m, "tag", "missing"), false);
});
