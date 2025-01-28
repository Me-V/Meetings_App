import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center">

      <SignInButton><button>login</button></SignInButton>
    </div>
  );
}
