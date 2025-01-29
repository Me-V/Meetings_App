"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function HomeCards(title: { title: string }) {
  const router = useRouter();
  const [meetingLink, setMeetingLink] = React.useState("");

  return (
    <>
      {title.title === "NewMeeting" ? (
        <Card className="w-[350px] h-[185px] flex items-center justify-center hover:cursor-pointer border hover:border-white border-gray-500">
          <CardHeader>
            <CardTitle>Create New Meeting</CardTitle>
          </CardHeader>
        </Card>
      ) : title.title === "Join" ? (
        <Card className="w-[350px] border hover:border-white border-gray-500">
          <CardHeader>
            <CardTitle>Join Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="meetingLink"
                    placeholder="Paste the meeting link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled={!meetingLink.trim()}>Join</Button>
          </CardFooter>
        </Card>
      ) : title.title === "Schedules" || title.title === "Recordings" ? (
        <Card
          className="w-[350px] h-[185px] flex items-center border hover:border-white justify-center hover:cursor-pointer border-gray-500"
          onClick={() => {
            router.push(`/${title.title.toLowerCase()}`);
          }}
        >
          <CardHeader>
            <CardTitle>{title.title}</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
    </>
  );
}
