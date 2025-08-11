"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousPath, setPreviousPath] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    if (previousPath && previousPath !== pathname) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 350) // Deve corresponder à duração da transição em page-transition.tsx

      return () => clearTimeout(timer)
    }
    setPreviousPath(pathname)
  }, [pathname, previousPath])

  return {
    isTransitioning,
    currentPath: pathname,
    previousPath
  }
}

// Hook para detectar mudanças de rota com delay
export function useRouteChange() {
  const [isChanging, setIsChanging] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsChanging(true)
    const timer = setTimeout(() => {
      setIsChanging(false)
    }, 120)
    return () => clearTimeout(timer)
  }, [pathname])

  return isChanging
}