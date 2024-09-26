"use client"
import { api } from '@/lib/api';
import { userDetailsAtom,isAuthenticatedAtom,workspaceAtom,todosAtom } from '@/states/atoms';
import { useCallback } from 'react';
import { useResetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
export const useLogout = () => {
    const resetUserDetails=useResetRecoilState(userDetailsAtom);
    const resetIsAuthenticated=useResetRecoilState(isAuthenticatedAtom);
    const resetWorkspace=useResetRecoilState(workspaceAtom);
    const resetTodos=useResetRecoilState(todosAtom);
    const router= useRouter();
    const { toast } = useToast();
    const logout = useCallback(async () => {
        try {
            const response = await api.get("/user/logout");
            if (response.data.success){
                resetTodos();
                resetWorkspace();
                resetUserDetails();
                resetIsAuthenticated();
                
                router.push("/login/");
                console.log("Logged out successfully");
                toast({
                    variant: "default",
                    title: "Success",
                    description: "Logged out."
                });

            } else {
                console.error("Logout failed");
                toast({
                    variant: "default",
                    description: "Could not logout"
                });
            }
        } catch (error:any) {
            console.log("Some error occurred while logging out. ", error.message);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        }
    }, [resetUserDetails,resetIsAuthenticated,resetWorkspace,resetTodos]);

    return logout;
};