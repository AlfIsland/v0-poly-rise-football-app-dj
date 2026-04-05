import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // OpenAI crawlers
      {
        userAgent: "GPTBot",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // Anthropic crawlers
      {
        userAgent: "Claude-Web",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // Google AI
      {
        userAgent: "Google-Extended",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      // Microsoft/Bing
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // Meta AI
      {
        userAgent: "FacebookBot",
        allow: "/",
      },
      {
        userAgent: "meta-externalagent",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // Apple
      {
        userAgent: "Applebot",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // Cohere
      {
        userAgent: "cohere-ai",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
      // You.com
      {
        userAgent: "YouBot",
        allow: ["/", "/api/", "/llms.txt", "/.well-known/"],
      },
    ],
    sitemap: "https://polyrisefootball.com/sitemap.xml",
    host: "https://polyrisefootball.com",
  }
}
