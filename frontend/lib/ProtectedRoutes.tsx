"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { isAuthenticatedAtom } from '@/states/atoms';
import useLoggedUser from '@/hooks/useLoggedUser';
import getWorkspaces from '@/hooks/getWorkspaces';

const ProtectedRoutes = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();
  const setAuthenticate=useSetRecoilState(isAuthenticatedAtom);
  useLoggedUser();
  getWorkspaces();

  useEffect(() => {
    const authenticate = localStorage.getItem('authenticate');
    const token = localStorage.getItem('token');
    if (!authenticate && !token) {
      router.push('/login');
    } else {
      setAuthenticate(typeof window !== 'undefined' ? !!localStorage.getItem('token') : false);
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoutes;
