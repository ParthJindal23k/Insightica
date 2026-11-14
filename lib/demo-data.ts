import { AnalyticsType } from "@/configs/type";

// Sample data for the public demo and the landing page preview.
// It is clearly labelled as sample data wherever it is shown.

const HOURLY = [
  9, 6, 4, 3, 5, 8, 14, 27, 46, 63, 71, 68, 74, 81, 77, 69, 72, 88, 96, 84, 61,
  43, 29, 17,
];

const hourLabel = (h: number) => {
  const suffix = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${suffix}`;
};

const DAILY = [
  ["Mon", 412],
  ["Tue", 468],
  ["Wed", 455],
  ["Thu", 521],
  ["Fri", 498],
  ["Sat", 301],
  ["Sun", 287],
  ["Mon", 446],
  ["Tue", 507],
  ["Wed", 539],
  ["Thu", 588],
  ["Fri", 562],
  ["Sat", 334],
  ["Sun", 318],
] as const;

export const demoAnalytics: AnalyticsType = {
  totalVisitors: 1214,
  totalSessions: 3862,
  totalActiveTime: 1214 * 164,
  avgActiveTime: 164,
  last24hVisitors: 1214,
  hourlyVisitors: HOURLY.map((count, hour) => ({
    count,
    hour,
    date: "sample",
    hourLabel: hourLabel(hour),
  })),
  dailyVisitors: DAILY.map(([day, count], i) => ({
    date: `${day} ${i < 7 ? "wk 1" : "wk 2"}`,
    count,
  })),
  referrals: [
    { name: "direct", domainName: "direct", uv: 438 },
    { name: "https://www.google.com/", domainName: "google", uv: 352 },
    { name: "https://github.com/", domainName: "github", uv: 171 },
    { name: "https://www.linkedin.com/", domainName: "linkedin", uv: 96 },
    { name: "https://news.ycombinator.com/", domainName: "ycombinator", uv: 74 },
    { name: "https://www.reddit.com/", domainName: "reddit", uv: 52 },
    { name: "https://duckduckgo.com/", domainName: "duckduckgo", uv: 31 },
  ],
  refParams: [
    { name: "utm_source=newsletter", uv: 88 },
    { name: "utm_source=linkedin&utm_medium=post", uv: 61 },
    { name: "ref=producthunt", uv: 34 },
    { name: "utm_campaign=launch", uv: 22 },
  ],
  countries: [
    { name: "India", uv: 486, code: "IN", image: "" },
    { name: "United States", uv: 271, code: "US", image: "" },
    { name: "Germany", uv: 118, code: "DE", image: "" },
    { name: "United Kingdom", uv: 97, code: "GB", image: "" },
    { name: "Canada", uv: 74, code: "CA", image: "" },
    { name: "Singapore", uv: 58, code: "SG", image: "" },
    { name: "Australia", uv: 41, code: "AU", image: "" },
  ],
  regions: [
    { name: "Gujarat", uv: 192, code: "IN", image: "" },
    { name: "Karnataka", uv: 121, code: "IN", image: "" },
    { name: "California", uv: 104, code: "US", image: "" },
    { name: "Maharashtra", uv: 98, code: "IN", image: "" },
    { name: "Bavaria", uv: 47, code: "DE", image: "" },
    { name: "England", uv: 83, code: "GB", image: "" },
    { name: "Ontario", uv: 46, code: "CA", image: "" },
  ],
  cities: [
    { name: "Ahmedabad", uv: 143, code: "IN", image: "" },
    { name: "Bengaluru", uv: 117, code: "IN", image: "" },
    { name: "Mumbai", uv: 76, code: "IN", image: "" },
    { name: "San Francisco", uv: 62, code: "US", image: "" },
    { name: "London", uv: 58, code: "GB", image: "" },
    { name: "Munich", uv: 39, code: "DE", image: "" },
    { name: "Toronto", uv: 35, code: "CA", image: "" },
  ],
  devices: [
    { name: "Desktop", uv: 702 },
    { name: "mobile", uv: 461 },
    { name: "tablet", uv: 51 },
  ],
  browsers: [
    { name: "Chrome", uv: 748 },
    { name: "Safari", uv: 233 },
    { name: "Firefox", uv: 121 },
    { name: "Edge", uv: 86 },
    { name: "Samsung Internet", uv: 26 },
  ],
  os: [
    { name: "Windows", uv: 421 },
    { name: "Android", uv: 318 },
    { name: "macOS", uv: 264 },
    { name: "iOS", uv: 169 },
    { name: "Linux", uv: 42 },
  ],
};
