import {redirect, useSearchParams} from "next/navigation";
import useAuthStore from "@/store/auth";
import {useMutation} from "@tanstack/react-query";
import {OAuthApi} from "@/api/oauthApi";
import {AppRoute} from "@/constants/approute";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, GitlabIcon, Loader2} from "lucide-react";
import {Link} from "@/components/ui/link";

export default function AuthorizationLoading() {
    const queryParams = useSearchParams();

    const { token, setTokens } = useAuthStore();
    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: (code: string) => OAuthApi.changeCode(code).then((res) => {if (res.access_token) {setTokens(res.access_token, res.refresh_token)}}),
        retry: 0,
    })

    if (queryParams.get("code") !== undefined && !isError && !isPending){
        mutate(queryParams.get("code")!);
    }

    if (!isError && token !== undefined && token !== "notok-en"){
        redirect(AppRoute.Home);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        {isError ? 'Authentication Error' : 'Authenticating'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isError ? 'There was a problem connecting to GitLab' : 'Please wait while we connect to GitLab'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {isError ? (
                        <>
                            <Alert variant="destructive" className='bg-gradient-to-r from-red-500/10 to-red-900/10'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error.message!}</AlertDescription>
                            </Alert>
                            <Link
                                href={process.env.NEXT_PUBLIC_OAUTH_URL!}
                                variant="button"
                                className="w-full"
                            >
                                <GitlabIcon className="mr-2 h-4 w-4" />
                                Try again
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-center text-sm text-muted-foreground">
                                Gltorch is validating your identity.
                            </p>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}