import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

/**
 * Schedule an email reminder for a document recipient
 */
export const scheduleReminder = internalMutation({
  args: {
    documentId: v.string(),
    recipientId: v.string(),
    recipientEmail: v.string(),
    documentName: v.string(),
    senderName: v.string(),
    recipientName: v.optional(v.string()),
    signLink: v.string(),
    dueDate: v.optional(v.string()),
    scheduledFor: v.number(), // timestamp in milliseconds
  },
  handler: async (ctx, args) => {
    // Create an email log entry with status 'scheduled'
    const emailLogId = await ctx.db.insert("emailLogs", {
      documentId: args.documentId,
      recipientId: args.recipientId,
      recipientEmail: args.recipientEmail,
      emailType: "signing-reminder",
      status: "scheduled",
      sentAt: Date.now(),
      metadata: {
        scheduledFor: args.scheduledFor,
        documentName: args.documentName,
        senderName: args.senderName,
        recipientName: args.recipientName,
        signLink: args.signLink,
        dueDate: args.dueDate,
      },
    });

    // Instead of using scheduler, we'll rely on a query to find pending reminders
    // The processSendReminder function will be called manually or via a cron job
    
    return emailLogId;
  },
});

/**
 * Process and send a scheduled reminder
 */
export const processSendReminder = internalMutation({
  args: {
    emailLogId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the email log
    const emailLogId = args.emailLogId as Id<"emailLogs">;
    const emailLog = await ctx.db.get(emailLogId);
    
    if (!emailLog) {
      throw new Error(`Email log with ID ${args.emailLogId} not found`);
    }
    
    if (emailLog.status !== "scheduled") {
      // Already processed or canceled
      return { status: "skipped", reason: `Email status is ${emailLog.status}, not scheduled` };
    }
    
    // Send the reminder email using the Next.js API route
    try {
      // In a real implementation, we would use a Convex HTTP action to call the Next.js API
      // For now, we'll just mark the email as sent and update the log
      await ctx.db.patch(emailLogId, {
        status: "sent",
        metadata: {
          ...emailLog.metadata,
          processedAt: Date.now(),
        },
      });
      
      // Detailed implementation would include a fetch to the API route:
      // Call the email sending API
      // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: emailLog.recipientEmail,
      //     subject: `Reminder: Please sign ${emailLog.metadata.documentName}`,
      //     templateName: 'signing-reminder',
      //     templateData: {
      //       recipientName: emailLog.metadata.recipientName,
      //       senderName: emailLog.metadata.senderName,
      //       documentName: emailLog.metadata.documentName,
      //       signLink: emailLog.metadata.signLink,
      //       dueDate: emailLog.metadata.dueDate,
      //     },
      //     documentId: emailLog.documentId,
      //     recipientId: emailLog.recipientId,
      //   }),
      // });
      
      return { status: "success" };
    } catch (error) {
      console.error("Error processing reminder:", error);
      return { status: "error", message: (error as Error).message };
    }
  },
}); 