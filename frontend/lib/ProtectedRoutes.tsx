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
  const user = useLoggedUser();
  const workspace = getWorkspaces();

  useEffect(() => {
    const authenticate = localStorage.getItem('authenticate');
    const token = localStorage.getItem('token');
    if (!authenticate && !token) {
      router.push('/login');
    } else {
      user
      workspace 
      setAuthenticate(typeof window !== 'undefined' ? !!localStorage.getItem('token') : false);
      router.push('/dashboard');
    }
  }, [router,setAuthenticate,user,workspace]);
  
  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoutes;
