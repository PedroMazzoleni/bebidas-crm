import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Da acceso a los bindings de Cloudflare (D1) también en `next dev`
initOpenNextCloudflareForDev();
