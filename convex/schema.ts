import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  users: defineTable({
    email: v.string(),
  }).index("email", ["email"]),
  messages: defineTable({
    author: v.string(),
    body: v.union(v.string(), v.id("_storage")),
    format: v.string(),
  }),
   replays: defineTable({
    storage_Id: v.id("_storage"), 
    dateTime: v.string(),
    duration: v.optional(v.int64()),
    deviceId: v.optional(v.string()),
    angle: v.optional(v.string()),
    player: v.optional(v.string()),
    club: v.optional(v.string()),
    format: v.string()
   })
  // You can define additional tables here...
});
  

 
export default schema;