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
    // File metadata fields
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    fileType: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    pageCount: v.optional(v.number()),
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
  
  signatureFields: defineTable({
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
    createdAt: v.number(),
    createdBy: v.string(),
  }).index("by_document", ["documentId"]),
  
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
  
  emailLogs: defineTable({
    documentId: v.string(),
    recipientId: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    emailType: v.string(), // 'invite', 'reminder', 'signed', 'completed'
    status: v.string(), // 'sent', 'delivered', 'opened', 'clicked', 'failed', 'scheduled'
    sentAt: v.number(),
    metadata: v.any(), // For storing additional data like messageId, tracking info, etc.
  })
    .index("by_document", ["documentId"])
    .index("by_recipient", ["recipientId"])
    .index("by_type", ["emailType"]),
}); 