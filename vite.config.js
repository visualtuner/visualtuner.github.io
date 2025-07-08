import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	base: "/",
	build: {
		outDir: "docs",
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": new URL("./src", import.meta.url).pathname,
		},
	},
}));
