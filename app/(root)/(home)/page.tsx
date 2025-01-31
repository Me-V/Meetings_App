import { HomeCards } from "@/app/components/HomeCards";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center gap-5 h-[90vh]">
      <HomeCards title={"NewMeeting"} />
      <HomeCards title={"Join"} />
      <HomeCards title={"Schedules"} />
      <HomeCards title={"Recordings"} />
    </div>
  );
}
