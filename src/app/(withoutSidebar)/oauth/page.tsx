"use client"
import { GitlabIcon } from 'lucide-react'
import { Link } from "@/components/ui/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  
export default function Page() {
return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r to-indigo-100">
    <Card className="w-[350px]">
        <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome to Gltorch</CardTitle>
        <CardDescription className="text-center">Your GitLab-powered search assistant</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-center text-sm text-muted-foreground">
            To use the application, you need to log in with your GitLab account.
        </p>
        <Link 
            href={process.env.NEXT_PUBLIC_OAUTH_URL!} 
            variant="button"
            className="w-full"
        >
            <GitlabIcon className="mr-2 h-4 w-4" />
            Sign in with GitLab
        </Link>
        </CardContent>
    </Card>
    </div>
)
}
  
  