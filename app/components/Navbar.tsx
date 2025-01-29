import React from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { SignedOut, SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/ModeToggle";
import InterviewerDashboard from "./InterviewerDashboard";
const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-2 px-4 mx-2 border-b border-gray-200 rounded-lg">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">LOGO</Button>
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
       <div className="flex items-center gap-5">
       <SignedIn>
        <InterviewerDashboard />
          <UserButton />
        </SignedIn> 

        <SignedOut>
          <SignInButton/>
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;
