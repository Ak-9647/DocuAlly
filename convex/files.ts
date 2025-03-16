import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Generate a secure upload URL for direct browser-to-storage uploads
 */
export const generateUploadUrl = mutation({
  args: {
    // Optional file type validation
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please login to upload files");
    }

    // Validate content type if provided
    if (args.contentType) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/heic",
        "text/plain",
      ];
      
      if (!allowedTypes.includes(args.contentType)) {
        throw new ConvexError(
          `Unsupported file type: ${args.contentType}. Supported types are PDF, DOCX, JPEG, PNG, HEIC, and TXT.`
        );
      }
    }

    // Generate the upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata to a document record after successful upload
 */
export const saveFileMetadata = mutation({
  args: {
    documentId: v.id("documents"),
    storageId: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    pageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please login to save file metadata");
    }

    // Get the document to verify ownership
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError(`Document not found: ${args.documentId}`);
    }

    // Verify the user owns the document
    if (document.ownerId !== identity.subject) {
      throw new ConvexError("Unauthorized: You don't own this document");
    }

    // Update the document with file metadata
    await ctx.db.patch(args.documentId, {
      fileId: args.storageId,
      fileName: args.fileName,
      fileSize: args.fileSize,
      fileType: args.fileType,
      pageCount: args.pageCount || null,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Generate a URL to download a file
 */
export const getFileUrl = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Get the document
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError(`Document not found: ${args.documentId}`);
    }

    // Check if the document has a file
    if (!document.fileId) {
      throw new ConvexError(`No file associated with document: ${args.documentId}`);
    }

    // Generate a URL to download the file
    const url = await ctx.storage.getUrl(document.fileId);
    if (!url) {
      throw new ConvexError(`File not found in storage: ${document.fileId}`);
    }

    return {
      url,
      fileName: document.fileName,
      fileType: document.fileType,
      fileSize: document.fileSize,
      pageCount: document.pageCount,
    };
  },
});

/**
 * Generate a thumbnail URL for a document
 * In a real implementation, this would generate thumbnails for different file types
 * For this demo, we'll just return the file URL for image types
 */
export const getThumbnailUrl = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Get the document
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError(`Document not found: ${args.documentId}`);
    }

    // Check if the document has a file
    if (!document.fileId) {
      throw new ConvexError(`No file associated with document: ${args.documentId}`);
    }

    // For image files, use the original file as the thumbnail
    if (document.fileType?.startsWith("image/")) {
      const url = await ctx.storage.getUrl(document.fileId);
      if (url) {
        return { url };
      }
    }

    // For other file types, return a placeholder based on file type
    // In a real implementation, you would generate actual thumbnails
    let placeholderUrl = "/placeholders/document.png";
    
    if (document.fileType === "application/pdf") {
      placeholderUrl = "/placeholders/pdf.png";
    } else if (document.fileType?.includes("word")) {
      placeholderUrl = "/placeholders/docx.png";
    } else if (document.fileType === "text/plain") {
      placeholderUrl = "/placeholders/txt.png";
    }

    return { url: placeholderUrl, isPlaceholder: true };
  },
}); 