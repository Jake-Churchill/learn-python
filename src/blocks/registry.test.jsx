import { describe, it, expect, vi } from "vitest";
import { blockRegistry } from "./registry.js";
import { BLOCK_TYPES } from "./blockTypes.js";

vi.mock("./PythonEditor.jsx", () => ({ default: () => null }));

describe("blockRegistry", () => {
  it("registers exactly the known block types", () => {
    expect(Object.keys(blockRegistry).sort()).toEqual([...BLOCK_TYPES].sort());
  });
});
