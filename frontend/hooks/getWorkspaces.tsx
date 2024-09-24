"use client"
import { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { workspaceSelector, workspaceAtom } from '@/states/atoms';
import { Workspace } from '@/types/todo';

const getWorkspaces = () => {
  const setWorkspaces= useSetRecoilState<Workspace[]>(workspaceAtom);
  const workspacesLoadable = useRecoilValueLoadable(workspaceSelector);

  useEffect(() => {
    if (workspacesLoadable.state === 'hasValue') {
      setWorkspaces(workspacesLoadable.contents as Workspace[]);
    } else if (workspacesLoadable.state === 'hasError') {
      console.error('Error loading workspaces:', workspacesLoadable.contents);
      setWorkspaces([]); 
    }
  }, [workspacesLoadable, setWorkspaces]);
};

export default getWorkspaces;
