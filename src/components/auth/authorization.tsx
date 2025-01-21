import React, {useEffect, useRef, useState} from "react";
import useAuthStore from "@/store/auth";
import {useMutation} from "@tanstack/react-query";
import {OAuthApi} from "@/api/oauthApi";
import {redirect} from "next/navigation";
import {AppRoute} from "@/constants/approute";

export default function Authorization() {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { token, refreshToken, setTokens } = useAuthStore();

    const { mutate, isError, isPending } = useMutation({
        mutationFn: (token: string) => OAuthApi.retrieveToken(token)
            .catch(async () => {
                try {
                    if (refreshToken && refreshToken !== "notok-en") {
                        const res = await OAuthApi.renewToken(refreshToken);
                        setTokens(res.access_token, res.refresh_token);
                        return;
                    }
                    setShouldRedirect(true);
                }
                catch (e) {
                    console.error(e);
                    setShouldRedirect(true);
                }
            }),
        retry: 0,
    });

    const isMutateCalled = useRef(false);

    useEffect(() => {
        if (shouldRedirect || (!token || token === "notok-en") && (!refreshToken || refreshToken === "notok-en")) {
            setTokens(undefined, undefined);
            redirect(AppRoute.OAuth);
        }
    }, [shouldRedirect, token, refreshToken, setTokens]);

    if (!token && !isError && !isPending && !isMutateCalled.current) {
        mutate(token);
        isMutateCalled.current = true;
    }
    
    return <React.Fragment/>;
}