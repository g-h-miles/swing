import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { betterAuthComponent } from './auth'
import { createAuth } from '../src/lib/auth'

const http = httpRouter();
const origins = ['https://localhost:3000',process.env.CLIENT_ORIGIN ?? '']
const allowedOrigin = (origin: string) => origins.includes(origin) ? origin : ''


// Add CORS preflight handlers for Better Auth routes
const authCorsHandler = httpAction(async (_, request) => {
  const origin = request.headers.get('origin') ?? '';
  if (origins.includes(origin)) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cookie,better-auth-cookie",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  return new Response(null, { status: 403 });
});

// Register Better Auth routes first
betterAuthComponent.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins: origins  
  }
})

// Manually add missing Better Auth routes
http.route({
  path: "/get-session", 
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    const origin = request.headers.get('origin') ?? '';
    
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      
      return new Response(JSON.stringify(session), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin(origin),
          "Access-Control-Allow-Credentials": "true",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ session: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": allowedOrigin(origin),
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }
  })
});

http.route({ pathPrefix: "/", method: "OPTIONS", handler: authCorsHandler });

// Add OPTIONS handlers for common Better Auth routes (if needed as fallback)
http.route({ path: "/get-session", method: "OPTIONS", handler: authCorsHandler });
http.route({ path: "/sign-in", method: "OPTIONS", handler: authCorsHandler });
http.route({ path: "/sign-up", method: "OPTIONS", handler: authCorsHandler });
http.route({ path: "/sign-out", method: "OPTIONS", handler: authCorsHandler });
http.route({
    path: "/test",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
      // Make sure the necessary headers are present
      // for this to be a valid pre-flight request
      const headers = request.headers;
      const origin = request.headers.get('origin') ?? ''
      if (
        headers.get("Origin") !== null &&
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
      ) {
        return new Response(null, {
          headers: new Headers({
            // e.g. XXXXXXXXXXXXXXXXXXXXX, configured on your Convex dashboard
            "Access-Control-Allow-Origin": allowedOrigin(origin),
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Digest",
            "Access-Control-Max-Age": "86400",
          }),
        });
      } else {
        return new Response();
      }
    }),
})
http.route({
    path:"/test",
    method:"GET",
    handler: httpAction(async (ctx, request) => {
        const data = await request.headers
        const more = {...data, cURL:process.env.CLIENT_ORIGIN!}
        const env = process.env.CLIENT_ORIGIN!
        const origin = request.headers.get('origin') ?? ''
        // process.env is empty in Convex functions by default
        // Only specific env vars like CLIENT_ORIGIN are exposed via process.env
        return new Response((JSON.stringify(env)), {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": allowedOrigin(origin),
            }
    })
})
})

http.route({
    path: "/sendImage",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
      // Make sure the necessary headers are present
      // for this to be a valid pre-flight request
      const headers = request.headers;
      const origin = request.headers.get('origin') ?? ''
      if (
        headers.get("Origin") !== null &&
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
      ) {
        return new Response(null, {
          headers: new Headers({
            // e.g. https://mywebsite.com, configured on your Convex dashboard
            "Access-Control-Allow-Origin": allowedOrigin(origin),
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type, Digest",
            "Access-Control-Max-Age": "86400",
          }),
        });
      } else {
        return new Response();
      }
    }),
  });

  http.route({
    path: "/sendReplay",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
      // Make sure the necessary headers are present
      // for this to be a valid pre-flight request
      const headers = request.headers;
      const origin = request.headers.get('origin') ?? ''
      if (
        headers.get("Origin") !== null && 
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
      ) {
        return new Response(null, {
          headers: new Headers({
            // e.g. https://mywebsite.com, configured on your Convex dashboard
            "Access-Control-Allow-Origin": allowedOrigin(origin),
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type, Digest",
            "Access-Control-Max-Age": "86400",
          }),
        });
      } else {
        return new Response();
      }
    }),
  });

// Handle POST for /sendReplay
http.route({
  path: "/sendReplay",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    let dateTime = new URL(request.url).searchParams.get("dt") ?? new URL(request.url).searchParams.get("datetime");
    if (!dateTime) {
      throw new Error("No dateTime provided");
    }
    const deviceId = new URL(request.url).searchParams.get("deviceId") ?? undefined;
    const angle = new URL(request.url).searchParams.get("angle") ?? undefined;
    const durationRaw = new URL(request.url).searchParams.get("duration");
    const duration = durationRaw ? BigInt(durationRaw) : undefined;
    const player = new URL(request.url).searchParams.get("player") ?? undefined;
    const club = new URL(request.url).searchParams.get("club") ?? undefined;
    await ctx.runMutation(api.replay.sendReplay, 
        { storageId, dateTime, deviceId, angle, duration, player, club  }
    );

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      headers: new Headers({
        "Access-Control-Allow-Origin": '*',
        Vary: "origin",
      }),
    });
  }),
});

// Handle POST for /sendImage
http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    let author = new URL(request.url).searchParams.get("author");
    author = author ? author : "unknown";
    await ctx.runMutation(api.replay.sendVideo, { storageId, author });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      headers: new Headers({
        "Access-Control-Allow-Origin": '*', // Allow all origins for now
        Vary: "origin",
      }),
    });
  }),
});

http.route({
    path: "/getReplay",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
      const { searchParams } = new URL(request.url);
      const storageId = searchParams.get("storageId")! as Id<"_storage">;
      const blob = await ctx.storage.get(storageId);
      if (blob === null) {
        return new Response("Image not found", {
          status: 404,
        });
      }
      return new Response(blob);
    }),
  });

export default http