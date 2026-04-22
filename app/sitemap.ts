import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/features",
    "/languages",
    "/languages/en",
    "/languages/hi",
    "/languages/es",
    "/languages/fr",
    "/languages/de",
    "/about",
    "/privacy",
    "/practice",
    "/results",
    "/analytics",
    "/settings",
    "/typing-test",
    "/typing-test/en",
    "/typing-test/hi",
    "/typing-test/es",
    "/typing-test/fr",
    "/typing-test/de",
    "/free-typing-practice",
    "/english-typing-test",
    "/hindi-typing-test",
    "/improve-typing-speed"
  ];

  return routes.map((route) => ({
    url: `https://typezy.app${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
