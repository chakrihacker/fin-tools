import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const publicDirectory = resolve(projectRoot, "public");

describe("PWA configuration", () => {
	it("registers a standalone, root-scoped application with automatic updates", () => {
		const config = readFileSync(resolve(projectRoot, "astro.config.mjs"), "utf8");

		expect(config).toContain('registerType: "autoUpdate"');
		expect(config).toContain('start_url: "/"');
		expect(config).toContain('scope: "/"');
		expect(config).toContain('display: "standalone"');
	});

	it("links the manifest and install metadata from the shared layout", () => {
		const layout = readFileSync(
			resolve(projectRoot, "src/layouts/Layout.astro"),
			"utf8",
		);

		expect(layout).toContain('href="/manifest.webmanifest"');
		expect(layout).toContain('href="/apple-touch-icon.png"');
		expect(layout).toContain('name="theme-color"');
		expect(layout).toContain('registerSW({ immediate: true })');
	});
});

describe("PWA icon assets", () => {
	const icons = [
		"pwa-192x192.png",
		"pwa-512x512.png",
		"pwa-maskable-192x192.png",
		"pwa-maskable-512x512.png",
		"apple-touch-icon.png",
	];

	it.each(icons)("provides %s as a non-empty PNG", (icon) => {
		const iconPath = resolve(publicDirectory, icon);

		expect(existsSync(iconPath)).toBe(true);
		expect(statSync(iconPath).size).toBeGreaterThan(0);
		expect(readFileSync(iconPath).subarray(1, 4).toString("ascii")).toBe("PNG");
	});
});