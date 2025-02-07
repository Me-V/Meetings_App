import React, { useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { CODING_QUESTIONS } from "@/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
const QuestionsArea = () => {
  const [lang, setLang] = useState<"javascript" | "python" | "java">("python");
  const [ques, setQues] = useState(CODING_QUESTIONS[0]);
  const [code, setCode] = useState(ques.starterCode[lang]);
  function handeLanguageChange(value: string) {
    const newLang = value as "javascript" | "python" | "java";
    setLang(newLang);
    setCode(ques.starterCode[newLang]); // Update code when language changes
  }

  function handleQuestionChange(question: string) {
    const selected_ques = CODING_QUESTIONS.find((q) => q.id === question)!;
    setQues(selected_ques);
  }

  console.log(code);

  return (
    <div className="">
      <div className="flex items-center m-3 gap-7">
        <Select onValueChange={(value) => handeLanguageChange(value)}>
          <SelectTrigger className="w-[180px] border border-white">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="javascript">javascript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleQuestionChange(value)}>
          <SelectTrigger className="w-[180px] border border-white">
            <SelectValue placeholder="Choose Question" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Question 1 (easy)</SelectItem>
              <SelectItem value="2">Question 2 (medium)</SelectItem>
              <SelectItem value="3">Question 3 (hard)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[45vh] w-full rounded-md border flex flex-col mt-5 items-center p-10  border-purple-500 mr-5">
        <div className="">
          {ques.id === "1" ? (
            <>
              <h1 className="text-3xl font-bold mt-2 border-b-4 pb-2 border-purple-200">
                Question 1 (Easy) :- {ques.title}
              </h1>
              <p className="text-lg mt-10 border-[0.2px] rounded-lg border-purple-500 p-5">
                {ques.description}
              </p>

              {ques.examples.map((example, id) => (
                <div
                  key={id}
                  className="mt-10 border border-purple-400 p-5 rounded-lg"
                >
                  <p>{example.input}</p>
                  <p>{example.output}</p>
                  <p>{example.explanation}</p>
                </div>
              ))}
            </>
          ) : ques.id === "2" ? (
            <>
              <>
                <h1 className="text-3xl font-bold mt-2 border-b-4 pb-2 border-purple-200">
                  Question 2 (Medium) :- {ques.title}
                </h1>
                <p className="text-lg mt-10 border-[0.2px] rounded-lg border-purple-500 p-5">
                  {ques.description}
                </p>

                {ques.examples.map((example, id) => (
                  <div
                    key={id}
                    className="mt-10 border border-purple-400 p-5 rounded-lg"
                  >
                    <p>{example.input}</p>
                    <p>{example.output}</p>
                    <p>{example.explanation}</p>
                  </div>
                ))}
              </>
            </>
          ) : (
            <>
              <>
                <h1 className="text-3xl font-bold mt-2 border-b-4 pb-2 border-purple-200">
                  Question 3 (Hard) :- {ques.title}
                </h1>
                <p className="text-lg mt-10 border-[0.2px] rounded-lg border-purple-500 p-5">
                  {ques.description}
                </p>

                {ques.examples.map((example, id) => (
                  <div
                    key={id}
                    className="mt-10 border border-purple-400 p-5 rounded-lg"
                  >
                    <p>{example.input}</p>
                    <p>{example.output}</p>
                    <p>{example.explanation}</p>
                  </div>
                ))}
              </>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuestionsArea;
