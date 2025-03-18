"use client";

import CandidateView from "@/app/components/CandidateView";
import { HomeCards } from "@/app/components/HomeCards";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const { user } = useUser(); // Get the authenticated user
  const updateRole = useMutation(api.users.updateRole); // Correct way to use the mutation hook
    
  const currUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  // Function to handle role update
  async function handleChoose(role: "candidate" | "interviewer") {
    if (!user?.id) {
      console.error("User is not logged in");
      return;
    }

    try {
      await updateRole({
        clerkId: user.id, // Correct way to get Clerk ID
        role, // Role selected by the user
      });
      console.log(`Role updated to ${role}`);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  }

  return (
    <>
      {currUser?.role === "" && (
        <>
          <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-white text-6xl mb-16">You Are A?</h1>
            <div className="cards-1">
              <div
                className="card red"
                onClick={() => handleChoose("interviewer")}
              >
                <p className="tip">Interviewer</p>
              </div>
              <div
                className="card green"
                onClick={() => handleChoose("candidate")}
              >
                <p className="tip">Candidate</p>
              </div>
            </div>
          </div>
        </>
      )}

      {currUser?.role === "interviewer" && (
        <div className="flex justify-center items-center gap-5 h-[90vh]">
          <HomeCards title={"New Meeting"} />
          <HomeCards title={"Join"} />
          <HomeCards title={"Schedules"} />
          <HomeCards title={"Recordings"} />
        </div>
      )}

      {currUser?.role === "candidate" && (
        <CandidateView mainId={currUser.clerkId} />
      )}
    </>
  );
}
