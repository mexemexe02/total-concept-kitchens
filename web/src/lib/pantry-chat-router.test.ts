import { describe, expect, it } from "vitest";
import {
  cannedBusinessKitchenJoke,
  isPantryJokeRequest,
  routePantryGreeting,
} from "@/lib/pantry-chat-router";

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

describe("isPantryJokeRequest", () => {
  it("detects common joke asks", () => {
    expect(isPantryJokeRequest("tell me a joke")).toBe(true);
    expect(isPantryJokeRequest("Got any jokes?")).toBe(true);
    expect(isPantryJokeRequest("make me laugh")).toBe(true);
  });

  it("ignores unrelated chat", () => {
    expect(isPantryJokeRequest("how much for cabinets")).toBe(false);
    expect(isPantryJokeRequest("this timeline is not funny at all")).toBe(false);
  });
});

describe("cannedBusinessKitchenJoke", () => {
  it("returns kitchen-themed text with config names", () => {
    const t = cannedBusinessKitchenJoke("tell me a joke");
    expect(t.length).toBeGreaterThan(40);
    expect(t.toLowerCase()).toMatch(/kitchen|cabinet|counter|spice|carpenter|measure/);
  });
});
