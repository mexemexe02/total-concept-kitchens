import { describe, expect, it } from "vitest";
import { parseCustomFaqJson } from "@/lib/mise-custom-faq";

describe("parseCustomFaqJson", () => {
  it("returns [] for non-array input", () => {
    expect(parseCustomFaqJson(null)).toEqual([]);
    expect(parseCustomFaqJson({})).toEqual([]);
  });

  it("keeps valid rows and trims q/a", () => {
    const rows = parseCustomFaqJson([
      { id: -1, q: "  Hello?  ", a: "  Yes.  ", tags: ["a", "b"] },
    ]);
    expect(rows).toEqual([{ id: -1, q: "Hello?", a: "Yes.", tags: ["a", "b"] }]);
  });

  it("drops invalid or empty entries", () => {
    expect(
      parseCustomFaqJson([
        { id: "x", q: "q", a: "a" },
        { id: 1, q: "", a: "a" },
        { id: 2, q: "q", a: "" },
        "nope",
      ]),
    ).toEqual([]);
  });
});
