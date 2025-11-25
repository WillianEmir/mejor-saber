"use client";

import { signIn } from "next-auth/react"; 
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/src/components/ui/Button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function SocialMediaLogInButton() {
  
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
};
