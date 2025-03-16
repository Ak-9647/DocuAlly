import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Create a new email log entry
 */
export const create = mutation({
  args: {
    documentId: v.string(),
    recipientId: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    emailType: v.string(),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const emailLogId = await ctx.db.insert("emailLogs", {
      documentId: args.documentId,
      recipientId: args.recipientId,
      recipientEmail: args.recipientEmail,
      emailType: args.emailType,
      status: args.status,
      sentAt: Date.now(),
      metadata: args.metadata || {},
    });

    return emailLogId;
  },
});

/**
 * Update an email log's status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("emailLogs"),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, status, metadata } = args;
    
    // Get the existing log
    const existingLog = await ctx.db.get(id);
    if (!existingLog) {
      throw new Error(`Email log with ID ${id} not found`);
    }
    
    // Update with new status and additional metadata
    await ctx.db.patch(id, {
      status,
      metadata: {
        ...existingLog.metadata,
        ...metadata,
        statusUpdatedAt: Date.now(),
      },
    });
    
    return id;
  },
});

/**
 * Get all email logs for a document
 */
export const getByDocument = query({
  args: {
    documentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailLogs")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();
  },
});

/**
 * Get all email logs for a recipient
 */
export const getByRecipient = query({
  args: {
    recipientId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailLogs")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.recipientId))
      .order("desc")
      .collect();
  },
});

/**
 * Get all pending reminders that need to be sent
 */
export const getPendingReminders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("emailLogs")
      .withIndex("by_type", (q) => q.eq("emailType", "signing-reminder"))
      .filter((q) => q.eq(q.field("status"), "scheduled"))
      .filter((q) => q.lt(q.field("metadata.scheduledFor"), Date.now()))
      .collect();
  },
}); 