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
import { addHours, isBefore, isWithinInterval } from "date-fns";
type Interview = Doc<"interviews">;
const ScheduleCard = ({ interview }: { interview: Interview }) => {
  const { joinMeeting } = useMeetingActions();

  const getMeetingStatus = (interview: Interview) => {
    const now = new Date();

    // Ensure time has seconds for compatibility (e.g., "09:00:00")
    const formattedTime =
      interview.time.length === 5 ? `${interview.time}:00` : interview.time;

    // Combine date and time into a valid Date object
    const interviewStartTime = new Date(`${interview.date}T${formattedTime}`);
    const interviewEndTime = addHours(interviewStartTime, 1); // Assume meeting lasts 1 hour

    if (["completed", "failed", "succeeded"].includes(interview.status)) {
      return "completed";
    }

    if (
      isWithinInterval(now, {
        start: interviewStartTime,
        end: interviewEndTime,
      })
    ) {
      return "live";
    }

    if (isBefore(now, interviewStartTime)) {
      return "upcoming";
    }

    return "completed"; // Default if past the end time
  };

  const meetingStatus = getMeetingStatus(interview); // Store computed status

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{interview.title}</CardTitle>
          {interview.description && (
            <CardDescription>{interview.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {interview.date} | {interview.time}
        </CardContent>
        <CardContent>{meetingStatus}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>

          {meetingStatus === "live" ? (
            <Button onClick={() => joinMeeting(interview.streamCallId)}>
              Join Meeting
            </Button>
          ) : (
            <Button disabled>Join Meeting</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScheduleCard;
