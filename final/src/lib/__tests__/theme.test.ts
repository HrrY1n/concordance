import { describe, expect, it } from "vitest";
import {
  THEME_ORDER,
  nextChoice,
  readStoredChoice,
  resolveTheme,
  type ThemeChoice,
} from "@/lib/theme";

describe("theme resolution (the one decision index.html must agree with)", () => {
  it("explicit choices always win", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("dark", true)).toBe("dark");
  });

  it("system follows prefers-color-scheme", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("theme cycle", () => {
  it("cycles system -> light -> dark -> system", () => {
    const seq: ThemeChoice[] = [];
    let choice: ThemeChoice = "system";
    for (let i = 0; i < 3; i++) {
      choice = nextChoice(choice);
      seq.push(choice);
    }
    expect(seq).toEqual(["light", "dark", "system"]);
    expect(nextChoice(choice)).toBe("light");
  });

  it("covers the whole order — every stored value cycles back home", () => {
    for (const start of THEME_ORDER) {
      let c = start;
      for (let i = 0; i < THEME_ORDER.length; i++) c = nextChoice(c);
      expect(c).toBe(start);
    }
  });
});

describe("stored choice parsing", () => {
  const store = (value: string | null): Pick<Storage, "getItem"> => ({
    getItem: () => value,
  });

  it("accepts only light/dark; anything else is system", () => {
    expect(readStoredChoice(store("light"))).toBe("light");
    expect(readStoredChoice(store("dark"))).toBe("dark");
    expect(readStoredChoice(store("system"))).toBe("system");
    expect(readStoredChoice(store("blue"))).toBe("system");
    expect(readStoredChoice(store(null))).toBe("system");
  });

  it("survives a throwing storage (private mode)", () => {
    const throwing = {
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(readStoredChoice(throwing)).toBe("system");
    expect(readStoredChoice(null)).toBe("system");
  });
});
