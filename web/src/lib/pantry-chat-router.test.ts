import { describe, expect, it } from "vitest";
import { routePantryGreeting } from "@/lib/pantry-chat-router";

describe("routePantryGreeting", () => {
  it("matches short greetings", () => {
    expect(routePantryGreeting("hi")).toContain("automated assistant");
    expect(routePantryGreeting("Hello!")).toContain("Ask about timelines");
    expect(routePantryGreeting("good morning")).toContain("project-specific advice");
  });

  it("ignores non-greetings", () => {
    expect(routePantryGreeting("how much is a kitchen remodel")).toBeNull();
    expect(routePantryGreeting("recipe for poptarts")).toBeNull();
  });
});
