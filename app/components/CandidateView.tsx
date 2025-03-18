import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ScheduleCard from "./ScheduleCard";

const CandidateView = ({ mainId }: { mainId: string }) => {
  const allInterviews = useQuery(api.interviews.getAllInterviews) ?? [];

  const mainInterviews = allInterviews?.filter(
    (id) => id.candidateId === mainId
  );

  return (
    <div className="rounded-lg m-2 p-10 flex flex-col h-[90vh]">
      {mainInterviews.length > 0 && (
        <h1 className="text-5xl text-white mb-10">Your Interviews</h1>
      )}

      {mainInterviews.length > 0 &&
        mainInterviews?.map((interview) => (
          <div key={interview._id} className="">
            <ScheduleCard interview={interview} />
          </div>
        ))}
      {mainInterviews.length === 0 && (
        <>
          <div className="flex justify-center items-center h-[90vh]">
            <span className="text-5xl text-white">No Interviews</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateView;
