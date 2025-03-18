import { Doc } from "@/convex/_generated/dataModel";
import useMeetingActions from "@/hooks/useMeetingActions";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Interview = Doc<"interviews">;

const ScheduleCard = ({ interview }: { interview: Interview }) => {
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

  return (
    <Card className="w-[350px] shadow-md rounded-lg">
      <CardHeader>
        <CardTitle>{interview.title}</CardTitle>
        {interview.description && (
          <CardDescription>{interview.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p>📅 {interview.date} | 🕒 {interview.time}</p>
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
        <Button variant="destructive">Delete</Button>
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
