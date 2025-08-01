import { convexAdapter } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import type { GenericCtx } from "../../convex/_generated/server";
import { betterAuthComponent } from "../../convex/auth";

// You'll want to replace this with an environment variable  
const siteUrl = "https://localhost:3000";

export const createAuth = (ctx: GenericCtx) =>
	// Configure your Better Auth instance here
	betterAuth({
		trustedOrigins: [siteUrl],
		database: convexAdapter(ctx, betterAuthComponent),

		// Simple non-verified email/password to get started
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			// The Convex plugin is required
			convex(),

			// The cross domain plugin is required for client side frameworks
			crossDomain({
				siteUrl,
			}),
		],
	});
