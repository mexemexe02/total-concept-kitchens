import { describe, expect, it } from "vitest";
import { parseCrmLeadsJson } from "@/lib/crm-leads";

describe("parseCrmLeadsJson", () => {
  it("returns [] for non-array", () => {
    expect(parseCrmLeadsJson(null)).toEqual([]);
  });

  it("keeps valid rows and defaults bad status", () => {
    const rows = parseCrmLeadsJson([
      {
        id: "a1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        name: "Test",
        email: "x@y.com",
        phone: null,
        projectNote: "Kitchen",
        nextStep: null,
        status: "bogus",
        source: "web",
      },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.status).toBe("new");
    expect(rows[0]!.email).toBe("x@y.com");
  });
});
