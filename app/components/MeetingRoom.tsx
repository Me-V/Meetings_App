import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { CODING_QUESTIONS } from "@/constants";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutListIcon, UsersIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import QuestionsArea from "./QuestionsArea";

const MeetingRoom = () => {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const [lang, setLang] = useState<"javascript" | "python" | "java">("python");
  const [ques, setQues] = useState(CODING_QUESTIONS[0]);
  const [code, setCode] = useState(ques.starterCode[lang]);

  const callingState = useCallCallingState();

  console.log(setLang, setQues);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[92vh]">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-screen rounded-lg border md:min-w-[450px] max-h-[88vh]"
      >
        <ResizablePanel
          defaultSize={50}
          minSize={35}
          maxSize={40}
          className="flex justify-center relative m-5"
        >
          <div className="absolute inset-0 ">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-[60vh] w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border border-white p-5 ">
                <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
                />
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}

          <div className="absolute bottom-1 xm:max-w-5">
            <div className="flex flex-col items-center gap-4">
              <div className="flex bg-gray-900 rounded-2xl items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push("/")} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  {/* <EndCallButton /> */}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <QuestionsArea />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                //Code Editor Area
                <Editor
                  height={"100%"}
                  language={lang}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 18,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    wordWrap: "on",
                    wrappingIndent: "indent",
                  }}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MeetingRoom;
