"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Notice } from "@/components/ui/notice";
import { Link } from "@/components/ui/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth";

export default function AppNotices() {
  const { token } = useAuthStore();

  return (
    <div className="flex flex-col gap-8">
      {token === "notok-en" || (!token && <AccessTokenNotice />)}
      <SmallScreenNotice />
    </div>
  );
}

function SmallScreenNotice() {
  return (
    <Notice
      className="max-sm:block hidden"
      level="error"
      icon={<AlertCircle className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Small Screens are not yet Supported</p>
          <p>
            Small screens (and mobile phones, mobile browsers) are not fully
            supported yet. Expect breaking functionality and/or adaptivity.
          </p>
        </div>
      </div>
    </Notice>
  );
}

function AccessTokenNotice() {
  const { setTokens } = useAuthStore();
  const [tokenInput, setTokenInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokens(tokenInput);
  };

  return (
    <Notice level="error" icon={<AlertCircle className="h-5 w-5" />}>
      <div className="space-y-4">
        <p className="font-semibold">No Access Token</p>
        <p>
          Please enter your GitLab Personal Access Token.{" "}
          <Link
            href={
              process.env.NEXT_PUBLIC_GITLAB_URL +
              "-/user_settings/personal_access_tokens"
            }
            variant="prominent"
          >
            You can get one here
          </Link>{" "}
          (specify api permissions).:
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your access token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="bg-white dark:bg-gray-800"
          />
          <Button
            type="submit"
            variant="ghost"
            className="w-full"
            disabled={!tokenInput.startsWith("glpat")}
          >
            Submit Token
          </Button>
        </form>
      </div>
    </Notice>
  );
}
