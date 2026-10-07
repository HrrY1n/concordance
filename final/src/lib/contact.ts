/**
 * Channel href grammar (placeholder pass): content keeps plain values
 * (`links.email` is an email ADDRESS, never a mailto: URL); the render layer
 * derives the href. Tested in lib/__tests__/contact.test.ts.
 */
export function toChannelHref(kind: "email" | string, value: string): string {
  return kind === "email" ? `mailto:${value}` : value;
}
