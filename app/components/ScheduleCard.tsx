"use client";
import { Doc } from "@/convex/_generated/dataModel";
import useMeetingActions from "@/hooks/useMeetingActions";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

type Interview = Doc<"interviews">;

const ScheduleCard = ({ interview }: { interview: Interview }) => {
  const { user } = useUser();

  const currUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  const deleteInterview = useMutation(
    api.interviews.deleteInterviewByStreamCallId
  );
  const updateStatus = useMutation(api.interviews.toggleInterviewStatus);
  const [isChecked, setIsChecked] = useState(interview.status === "passed");

  const { joinMeeting } = useMeetingActions();
  const now = new Date();

  // Convert interview date and time into a Date object
  const interviewStart = new Date(`${interview.date}T${interview.time}:00`);
  const interviewEnd = new Date(interviewStart.getTime() + 2 * 60 * 1000); // 2-minute duration

  // Determine the meeting status
  let meetingStatus: "upcoming" | "live" | "completed" = "upcoming";

  if (now >= interviewEnd) {
    meetingStatus = "completed";
  } else if (now >= interviewStart) {
    meetingStatus = "live";
  }

  const handleDelete = async (streamCallId: string) => {
    try {
      const result = await deleteInterview({ streamCallId });
      console.log(result.message);
    } catch (error) {
      console.error("Error deleting interview:", error);
    }
  };

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState); // Update local state for UI

    try {
      await updateStatus({
        streamCallId: interview.streamCallId,
        isChecked: newCheckedState,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Card className="w-[350px] shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {interview.title}

          {currUser?.role === "interviewer" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status"
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="status"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Passed
              </label>
            </div>
          )}

          {currUser?.role === "candidate" &&
            meetingStatus !== "upcoming" &&
            meetingStatus !== "live" && (
              <>
                {interview.status === "passed" ? (
                  <span className="text-sm font-normal text-green-600">
                    Passed
                  </span>
                ) : (
                  <span className="text-sm font-normal text-red-600">
                    Failed
                  </span>
                )}
              </>
            )}
        </CardTitle>
        {interview.description && (
          <CardDescription>{interview.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p>
          📅 {interview.date} | 🕒 {interview.time}
        </p>
        <p
          className={`mt-2 px-3 w-24 py-1 text-center text-sm font-medium rounded-md ${
            meetingStatus === "live"
              ? "bg-green-500 text-white"
              : meetingStatus === "upcoming"
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-white"
          }`}
        >
          {meetingStatus.charAt(0).toUpperCase() + meetingStatus.slice(1)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currUser?.role === "interviewer" && (
          <Button
            onClick={() => {
              handleDelete(interview.streamCallId);
            }}
            variant="destructive"
          >
            Delete
          </Button>
        )}

        <Button
          onClick={() => joinMeeting(interview.streamCallId)}
          disabled={meetingStatus !== "live"}
        >
          Join Meeting
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduleCard;
