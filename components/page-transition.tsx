"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

const baseVariants = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.995,
    filter: "blur(4px)",
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    y: -6,
    scale: 1.005,
    filter: "blur(4px)",
  },
}

const baseTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.35,
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={baseVariants}
        transition={baseTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Componente específico para páginas com sidebar
export function PageTransitionWithSidebar({ children }: PageTransitionProps) {
  const pathname = usePathname()

  const sidebarVariants = {
    initial: {
      opacity: 0,
      x: 8,
      scale: 0.992,
      filter: "blur(4px)",
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    out: {
      opacity: 0,
      x: -8,
      scale: 1.004,
      filter: "blur(4px)",
    },
  }

  const sidebarTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.35,
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={sidebarVariants}
        transition={sidebarTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Componente para transições mais sutis em modais e componentes internos
export function SubtleTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}