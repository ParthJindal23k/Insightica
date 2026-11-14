// Where the tracking script is served from. Falls back to the current origin
// so the snippet is still correct when NEXT_PUBLIC_HOST_URL isn't set.
export function getHostUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_HOST_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
