import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Meri Padhai Tracker 🌟",
    short_name: "Meri Padhai",
    description: "Bhanji aur Mama ka daily study and doubt tracker!",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdfbf7",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
