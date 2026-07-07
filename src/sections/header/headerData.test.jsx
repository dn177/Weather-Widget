import { describe, expect, it } from "vitest";
import data from "./data";

describe("header social data", () => {
  const heroSocials = data.slice(0, 2);

  it("shows GitHub and Hugging Face as the hero social links", () => {
    expect(heroSocials.map((item) => item.link)).toEqual([
      "https://github.com/dn177?tab=repositories",
      "https://huggingface.co/cdtio33",
    ]);
  });

  it("provides explicit accessible labels for hero social links", () => {
    expect(heroSocials.map((item) => item.label)).toEqual([
      "GitHub repositories",
      "Hugging Face profile",
    ]);
  });

  it("uses a decorative local image for the Hugging Face icon", () => {
    const huggingFace = heroSocials.find(
      (item) => item.label === "Hugging Face profile"
    );

    expect(huggingFace.icon.type).toBe("img");
    expect(huggingFace.icon.props.src).toMatch(/\/hugging-face\.png$/);
    expect(huggingFace.icon.props.alt).toBe("");
  });
});
