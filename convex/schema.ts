import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    status: v.string(),
    ownerId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  signatures: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    signature: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
      page: v.number(),
    }),
    createdAt: v.number(),
  }),
  
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
}); 