"use client"
import { fetchUserAtom, userDetailsAtom } from '@/states/atoms';
import { useEffect } from 'react';
import { useSetRecoilState,useRecoilValueLoadable } from 'recoil';
import { useLogout } from './useLogoutUser';
import { User } from '@/types/todo';

const useLoggedUser = () => {
  const setLoggedUser = useSetRecoilState(userDetailsAtom);
  const userDetailsLoadable = useRecoilValueLoadable(fetchUserAtom);
  const logout = useLogout();
  useEffect(() => {
    if (userDetailsLoadable.state === 'hasValue') {
      setLoggedUser(userDetailsLoadable.contents as User);
    } else if (userDetailsLoadable.state === 'hasError') {
      console.error('Error loading user details:', userDetailsLoadable.contents);
      setLoggedUser(null);
    }
    else if(String(userDetailsLoadable.state)==="Jwt Expired"){
      logout();
    }
  }, [userDetailsLoadable, setLoggedUser]);
  
};

export default useLoggedUser;
