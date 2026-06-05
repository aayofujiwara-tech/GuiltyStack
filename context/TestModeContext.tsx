'use client'

import { createContext, useContext, useState } from 'react'
import { TEST_CONTENTS } from '@/lib/testData'
import { Content, ContentStatus } from '@/lib/types'

interface TestModeContextValue {
  isTestMode: boolean
  enterTestMode: () => void
  exitTestMode: () => void
  testContents: Content[]
  updateTestStatus: (id: string, status: ContentStatus) => void
  deleteTestContent: (id: string) => void
  addTestContent: (content: Content) => void
}

const TestModeContext = createContext<TestModeContextValue>({
  isTestMode: false,
  enterTestMode: () => {},
  exitTestMode: () => {},
  testContents: [],
  updateTestStatus: () => {},
  deleteTestContent: () => {},
  addTestContent: () => {},
})

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  const [isTestMode, setIsTestMode] = useState(false)
  const [testContents, setTestContents] = useState<Content[]>(TEST_CONTENTS)

  const enterTestMode = () => {
    setTestContents(TEST_CONTENTS)
    setIsTestMode(true)
  }

  const exitTestMode = () => setIsTestMode(false)

  const updateTestStatus = (id: string, status: ContentStatus) => {
    setTestContents((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, updated_at: new Date().toISOString().split('T')[0] }
          : c
      )
    )
  }

  const deleteTestContent = (id: string) => {
    setTestContents((prev) => prev.filter((c) => c.id !== id))
  }

  const addTestContent = (content: Content) => {
    setTestContents((prev) => [content, ...prev])
  }

  return (
    <TestModeContext.Provider
      value={{
        isTestMode,
        enterTestMode,
        exitTestMode,
        testContents,
        updateTestStatus,
        deleteTestContent,
        addTestContent,
      }}
    >
      {children}
    </TestModeContext.Provider>
  )
}

export const useTestMode = () => useContext(TestModeContext)
