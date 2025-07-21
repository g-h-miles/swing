import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return Promise.all(
      messages.map(async (message) => ({
        ...message,
        // If the message is an "image" its `body` is an `Id<"_storage">`
        ...(message.format === "video/webm"
          ? { url: await ctx.storage.getUrl(message.body) }
          : {}),
      })),
    );
  },
});

import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendVideo = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      body: args.storageId,
      author: args.author,
      format: "video/webm",
    });
  },
});

export const sendReplay = mutation({
    args: { 
        storageId: v.id("_storage"), 
        dateTime: v.string(),
        duration: v.optional(v.int64()),
        deviceId: v.optional(v.string()),
        angle: v.optional(v.string()),
        player: v.optional(v.string()),
        club: v.optional(v.string()),
    
    },
    handler: async (ctx, args) => {
      await ctx.db.insert("replays", {
        storage_Id: args.storageId,
        dateTime: args.dateTime,
        duration: args.duration,
        deviceId: args.deviceId,
        angle: args.angle,
        player: args.player,
        club: args.club,
        format: "video/webm",
      });
    },
  });

export const sendMessage = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    const { body, author } = args;
    await ctx.db.insert("messages", { body, author, format: "text" });
  },
});



export const listReplays = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("replays").collect();
    return Promise.all(
      messages.map(async (message) => ({
        ...message,
        // If the message is an "image" its `body` is an `Id<"_storage">`
        ...(message.format === "video/webm"
          ? { url: await ctx.storage.getUrl(message.storage_Id) }
          : {}),
      })),
    );
  },
});

export const deleteById = mutation({
    args: {
      storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      return await ctx.storage.delete(args.storageId);
    },
  });


  export const getMetadata = query({
    args: {
      storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      return await ctx.db.system.get(args.storageId);
    },
  });
  
  export const listAllFiles = query({
    handler: async (ctx) => {
      // You can use .paginate() as well
      return await ctx.db.system.query("_storage").collect();
    },
  });