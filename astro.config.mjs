// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
	site: "https://fintools.fyndx.io",
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
		AstroPWA({
			injectRegister: false,
			registerType: "autoUpdate",
			manifest: {
				name: "Fin Tools",
				short_name: "Fin Tools",
				description: "Simple, powerful tools for everyday financial calculations.",
				start_url: "/",
				scope: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#18181b",
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/pwa-maskable-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/pwa-maskable-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{css,html,ico,js,json,png,svg,webp,woff,woff2}"],
				cleanupOutdatedCaches: true,
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),
	],
});
