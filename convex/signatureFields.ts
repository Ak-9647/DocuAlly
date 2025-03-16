import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all signature fields for a document
export const getByDocumentId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const signatureFields = await ctx.db
      .query("signatureFields")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    return signatureFields;
  },
});

// Create a new signature field
export const create = mutation({
  args: {
    documentId: v.id("documents"),
    fieldId: v.string(),
    x: v.number(),
    y: v.number(),
    width: v.number(),
    height: v.number(),
    page: v.number(),
    label: v.string(),
    required: v.boolean(),
    recipientId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    const fieldId = await ctx.db.insert("signatureFields", {
      documentId: args.documentId,
      fieldId: args.fieldId,
      x: args.x,
      y: args.y,
      width: args.width,
      height: args.height,
      page: args.page,
      label: args.label,
      required: args.required,
      recipientId: args.recipientId,
      createdAt: Date.now(),
      createdBy: userId,
    });
    
    return fieldId;
  },
});

// Update a signature field
export const update = mutation({
  args: {
    id: v.id("signatureFields"),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    label: v.optional(v.string()),
    required: v.optional(v.boolean()),
    recipientId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, updates);
    
    return id;
  },
});

// Delete a signature field
export const remove = mutation({
  args: { id: v.id("signatureFields") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
    
    return args.id;
  },
});

// Batch update signature fields for a document
export const batchUpdate = mutation({
  args: {
    documentId: v.id("documents"),
    fields: v.array(
      v.object({
        fieldId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        page: v.number(),
        label: v.string(),
        required: v.boolean(),
        recipientId: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    // First, get all existing fields for this document
    const existingFields = await ctx.db
      .query("signatureFields")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    // Create a map of fieldId to database ID for quick lookup
    const fieldIdToDbId = new Map();
    existingFields.forEach(field => {
      fieldIdToDbId.set(field.fieldId, field._id);
    });
    
    // Process each field in the batch
    for (const field of args.fields) {
      if (fieldIdToDbId.has(field.fieldId)) {
        // Update existing field
        await ctx.db.patch(fieldIdToDbId.get(field.fieldId), {
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
          page: field.page,
          label: field.label,
          required: field.required,
          recipientId: field.recipientId,
        });
      } else {
        // Create new field
        await ctx.db.insert("signatureFields", {
          documentId: args.documentId,
          fieldId: field.fieldId,
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
          page: field.page,
          label: field.label,
          required: field.required,
          recipientId: field.recipientId,
          createdAt: Date.now(),
          createdBy: userId,
        });
      }
    }
    
    // Delete fields that are no longer in the batch
    const newFieldIds = new Set(args.fields.map(f => f.fieldId));
    for (const field of existingFields) {
      if (!newFieldIds.has(field.fieldId)) {
        await ctx.db.delete(field._id);
      }
    }
    
    return { success: true };
  },
}); 