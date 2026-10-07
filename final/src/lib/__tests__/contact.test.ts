import { describe, expect, it } from "vitest";
import { toChannelHref } from "../contact";

describe("toChannelHref", () => {
  it("wraps an email address in mailto: — the content layer stays plain", () => {
    expect(toChannelHref("email", "person@example.com")).toBe("mailto:person@example.com");
  });

  it("passes web channels through untouched", () => {
    expect(toChannelHref("github", "https://github.com/someone")).toBe("https://github.com/someone");
  });
});
