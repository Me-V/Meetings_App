import React from "react";
import {
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { SignedOut, SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/ModeToggle";
import InterviewerDashboard from "./InterviewerDashboard";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-2 px-4 mx-2 border-b border-gray-200 rounded-lg">
      <div className="ml-5 space-x-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Email Address</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton />
              <DropdownMenuShortcut>signout logo</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/">HOME</Link>
      </div>
      <div className="flex items-center gap-5">
        <SignedIn>
          <InterviewerDashboard />
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;
