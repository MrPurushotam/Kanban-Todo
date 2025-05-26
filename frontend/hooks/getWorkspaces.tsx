"use client"
import { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { workspaceSelector, workspaceAtom, globalLoadingAtom } from '@/states/atoms';
import { Workspace } from '@/types/todo';

const getWorkspaces = () => {
  const setWorkspaces = useSetRecoilState<Workspace[]>(workspaceAtom);
  const setGlobalLoading = useSetRecoilState(globalLoadingAtom);
  const workspacesLoadable = useRecoilValueLoadable(workspaceSelector);
  
  useEffect(() => {
    // Set loading state when the workspaces are loading
    if (workspacesLoadable.state === 'loading') {
      setGlobalLoading("loading-workspaces");
    } else if (workspacesLoadable.state === 'hasValue') {
      setWorkspaces(workspacesLoadable.contents as Workspace[]);
      // Clear loading state
      setGlobalLoading("");
    } else if (workspacesLoadable.state === 'hasError') {
      console.error('Error loading workspaces:', workspacesLoadable.contents);
      setWorkspaces([]); 
      // Clear loading state on error too
      setGlobalLoading("");
    }
  }, [workspacesLoadable, setWorkspaces, setGlobalLoading]);
};

export default getWorkspaces;
