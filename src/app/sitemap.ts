import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://edumind.ai";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/chat`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/documents`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/slides`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];
}
