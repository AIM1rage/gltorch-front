"use client";

import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthStore from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/api";
import NextLink from "next/link";
import { Link } from "../ui/link";

export function UserDropdown() {
  const [tokenInput, setTokenInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { token, setTokens } = useAuthStore();

  const {
    data: user,
    error,
    isError,
  } = useQuery({
    queryKey: ["me", "t" + token],
    queryFn: () => API.me(),
    enabled: !!token,
  });

  const handleSaveToken = () => {
    setTokens(tokenInput);
    setTokenInput("");
    setIsOpen(false);
  };

  const handleSignOut = () => {
    setTokens(undefined, undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card>
          <CardHeader className="space-y-1">
            {isError && (
              <div className="text-center text-red-500 text-sm">
                Error: {error.message}
              </div>
            )}
            {user && (
              <>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </>
            )}
          </CardHeader>
          <CardContent className="grid gap-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <NextLink
                    href={user.webUrl}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View Profile
                  </NextLink>
                </div>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Enter Token</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Enter Access Token</DialogTitle>
                    <DialogDescription>
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
                      (specify api permissions)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="token" className="text-right">
                        Token
                      </Label>
                      <Input
                        id="token"
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSaveToken}>
                      Save Token
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
          {user && (
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will remove your access token. You will need
                      to enter it again to regain access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
