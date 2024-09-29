"use client"
import getWorkspaces from '@/hooks/getWorkspaces';
import useLoggedUser from '@/hooks/useLoggedUser';

const ProtectedRoutes = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  useLoggedUser();
  getWorkspaces();

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoutes;
