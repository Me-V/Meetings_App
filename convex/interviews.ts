import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const interviews = await ctx.db.query("interviews").collect();

    return interviews;
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject)
      )
      .collect();

    return interviews!;
  },
});

// export const getInterviewByStreamCallId = query({
//   args: { streamCallId: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("interviews")
//       .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
//       .first();
//   },
// });

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    // startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    date: v.string(),
    time: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("interviews", {
      ...args,
      status: "failed",
    });
  },
});

// export const updateInterviewStatus = mutation({
//   args: {
//     id: v.id("interviews"),
//     status: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.patch(args.id, {
//       status: args.status,
//       ...(args.status === "completed" ? { endTime: Date.now() } : {}),
//     });
//   },
// });

export const deleteInterviewByStreamCallId = mutation({
  args: { streamCallId: v.string() },
  handler: async (ctx, { streamCallId }) => {
    const interview = await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", streamCallId))
      .unique();

    if (!interview) {
      throw new Error("Interview not found");
    }

    await ctx.db.delete(interview._id);

    return { success: true, message: "Interview deleted successfully" };
  },
});

export const toggleInterviewStatus = mutation({
  args: { streamCallId: v.string(), isChecked: v.boolean() },
  handler: async (ctx, { streamCallId, isChecked }) => {
    // Find interview by streamCallId
    const interview = await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", streamCallId))
      .unique();

    if (!interview) {
      throw new Error("Interview not found");
    }

    // Update status based on checkbox state
    const newStatus = isChecked ? "passed" : "failed";

    await ctx.db.patch(interview._id, { status: newStatus });

    return { success: true, message: `Interview marked as ${newStatus}` };
  },
});

