import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: ""
    });
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const updateRole = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    // Find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's role
    await ctx.db.patch(user._id, { role: args.role });
  },
});