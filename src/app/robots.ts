import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lavoroinchiaro.it";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/dashboard", "/impostazioni", "/accreditati"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
