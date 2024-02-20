"use client"
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
    AuthLoading, Authenticated, ConvexReactClient, Unauthenticated
} from "convex/react";
import { Loading } from "@/components/auth/loading";

interface Props {
    children: React.ReactNode; 
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({ children }: Props) => {

    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>
                    {children}
                </Authenticated>
                <Unauthenticated>
                    {children}
                </Unauthenticated>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}



