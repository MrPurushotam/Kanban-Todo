'use client'
import { RecoilRoot } from 'recoil'
import { ReactNode } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
        <RecoilRoot>
          {children}
        </RecoilRoot>
    </DndProvider>
  )

}