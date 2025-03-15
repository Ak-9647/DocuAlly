import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    if (args.id) {
      return await ctx.db.get(args.id);
    }
    return await ctx.db.query("documents").collect();
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("ownerId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,
      status: "draft",
      ownerId: args.ownerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return documentId;
  },
}); 