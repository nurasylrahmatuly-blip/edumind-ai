import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduMind AI",
    short_name: "EduMind",
    description: "Мультиагентный AI ассистент для студентов",
    start_url: "/",
    display: "standalone",
    background_color: "#070809",
    theme_color: "#b8f727",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
