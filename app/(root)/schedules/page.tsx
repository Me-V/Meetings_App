"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ScheduleCard from "@/app/components/ScheduleCard";

const ScheduleInterview = () => {
  const { user } = useUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getUsers = useQuery(api.users.getUsers);

  const createInterview = useMutation(api.interviews.createInterview);
  const allInterviews = useQuery(api.interviews.getAllInterviews) ?? [];

  console.log(allInterviews);

  const client = useStreamVideoClient();
  const candidates = getUsers?.filter((user) => user.role === "candidate");
  const interviewers = getUsers?.filter((user) => user.role === "interviewer");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { title, description, date, time, candidateId, interviewerIds } =
      form;
    try {
      setLoading(true);
      if (!form.title || !form.description || !form.date || !form.time) {
        toast.error("All fields are required.");
        return;
      }

      if (!client || !user) return;

      if (!form.candidateId || form.interviewerIds.length === 0) {
        toast.error(
          "Please select both a candidate and at least one interviewer."
        );
        return;
      }

      const meetingDate = new Date(`${form.date}T${form.time}`);
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: form.title,
            additionalDetails: form.description,
          },
        },
      });

      await createInterview({
        title,
        description,
        // startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        date,
        time,
        candidateId,
        interviewerIds,
      });
      toast.success("Meeting scheduled successfully!");
      setForm({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });

      setOpen(false); // Close the dialog on success
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Schedule Interview</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new interview.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] px-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Select Candidate
                </label>
                <Select
                  value={form.candidateId}
                  onValueChange={(candidateId) =>
                    setForm({ ...form, candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates?.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        {candidate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Select Interviewers
                </label>
                {interviewers?.map((interviewer) => (
                  <div
                    key={interviewer.clerkId}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={form.interviewerIds.includes(
                        interviewer.clerkId
                      )}
                      onCheckedChange={(checked) =>
                        checked
                          ? setForm((prev) => ({
                              ...prev,
                              interviewerIds: [
                                ...prev.interviewerIds,
                                interviewer.clerkId,
                              ],
                            }))
                          : setForm((prev) => ({
                              ...prev,
                              interviewerIds: prev.interviewerIds.filter(
                                (id) => id !== interviewer.clerkId
                              ),
                            }))
                      }
                    />
                    <span>{interviewer.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="px-3 py-2 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Time</label>
                  <Select
                    value={form.time}
                    onValueChange={(time) => setForm({ ...form, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timeslot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 am</SelectItem>
                      <SelectItem value="06:00">06:00 pm</SelectItem>
                      <SelectItem value="08:00">08:00 pm</SelectItem>
                      <SelectItem value="18:26">18:26 pm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={
                  new Date(form.date).setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0)
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-3 gap-6 m-20">
        {!allInterviews && (
          <>
            <p className="text-6xl font-bold">Loading ...</p>
          </>
        )}

        {allInterviews && allInterviews?.length > 0 ? (
          <>
            {allInterviews?.map((id) => (
              <div key={id._id}>
                <ScheduleCard interview={id} />
              </div>
            ))}
          </>
        ) : (
          <div className="text-6xl font-bold"> No Interviews</div>
        )}
      </div>
    </>
  );
};

export default ScheduleInterview;
