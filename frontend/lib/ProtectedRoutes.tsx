"use client"
import getWorkspaces from '@/hooks/getWorkspaces';
import useLoggedUser from '@/hooks/useLoggedUser';
import { isAuthenticatedAtom } from '@/states/atoms';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

const ProtectedRoutes = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedAtom);
  const router = useRouter();

  useLoggedUser();
  getWorkspaces();
  useEffect(() => {
    const isAuth = document.cookie.split('; ').find(row => row.startsWith('authenticate='))?.split('=')[1];
    console.log("Effect ran",isAuth)
    if (isAuth === 'true') {
      console.log("in")
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/login"); 
    }
  }, [setIsAuthenticated, router]);

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoutes;
