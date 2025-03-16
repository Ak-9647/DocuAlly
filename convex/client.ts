import { ConvexClient } from "convex/browser";

// Create a Convex client using the deployment URL from environment variables
// Use a default URL for development if the environment variable is not set
const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://astute-dove-668.convex.cloud";
export const convex = new ConvexClient(deploymentUrl); 