"use client";

import { authClient } from '@/lib/auth-client';
import React from 'react';
import { useSearchParams } from "next/navigation";
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@heroui/react';

const GoogleLogin = () => {
    const searchParams = useSearchParams();
    const callbackURL = searchParams.get("callbackUrl") || searchParams.get("redirectTo") || "/";

    const handleGoogleSignin = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
            callbackURL: callbackURL,
        });
        console.log(data, "data");
    };

    return (
        <Button
            onClick={handleGoogleSignin}
            variant="bordered"
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-[#0b0f17] dark:hover:bg-[#0b0f17]/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-bold text-sm tracking-wide transition-all active:scale-[0.99] cursor-pointer"
        >
            <FcGoogle size={22} className="shrink-0" />
            Continue with Google
        </Button>
    );
};

export default GoogleLogin;