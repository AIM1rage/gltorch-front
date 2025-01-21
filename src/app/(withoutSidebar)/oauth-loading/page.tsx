"use client"
import {Suspense} from 'react';
import dynamic from "next/dynamic";

const AuthorizationLoading = dynamic(() => import("@/components/auth-loading/authorization-loading"), {
    ssr: false,
})

export default function Page() {
    return (
        <Suspense><AuthorizationLoading/></Suspense>
    );
}

