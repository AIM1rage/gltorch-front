"use client";

import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Notice } from "@/components/ui/notice";
import { Link } from "@/components/ui/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth";

export default function AppNotices() {
  const { token } = useAuthStore();
  const usingPAT = token?.startsWith("glpat");
  if (token === "notok-en") {
    return (
      <div className="flex flex-col gap-8">
        <AccessTokenNotice />
      </div>
    );
  } else if (usingPAT) {
    return (
      <div className="flex flex-col gap-8">
        <DestroyTokenNotice />
      </div>
    );
  }

  return <></>;
}

function DestroyTokenNotice() {
  const { setToken } = useAuthStore();
  return (
    <Notice level="warning" icon={<AlertTriangle className="h-5 w-5" />}>
      <div className="space-y-4">
        <div>
          <p className="font-semibold">
            Warning: Using a Personal Access Token
          </p>
          <p>
            This is still supported, but some time later we will add the support
            for OpenID Connect. You can stop using this token by clicking
            &apos;Forget Token&apos;.
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setToken("notok-en")}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Forget Token
        </Button>
      </div>
    </Notice>
  );
}

function AccessTokenNotice() {
  const { setToken } = useAuthStore();
  const [tokenInput, setTokenInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToken(tokenInput);
  };

  return (
    <Notice level="error" icon={<AlertCircle className="h-5 w-5" />}>
      <div className="space-y-4">
        <p className="font-semibold">No Access Token</p>
        <p>
          OpenID Connect functionality is still unavailable, so please enter
          your GitLab Personal Access Token.{" "}
          <Link
            href="https://search-project.gitlab.yandexcloud.net/-/user_settings/personal_access_tokens"
            variant="prominent"
          >
            You can get one here
          </Link>{" "}
          (specify api permissions).:
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
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
