"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme, useThemeColor } from "@/contexts/theme-context"
import { useEffect, useState } from "react"

export function ThemeTransition() {
  const { theme } = useTheme()
  const { primary, name } = useThemeColor()
  const [isChanging, setIsChanging] = useState(false)
  const [previousTheme, setPreviousTheme] = useState(theme)

  useEffect(() => {
    if (previousTheme !== theme) {
      setIsChanging(true)
      const timer = setTimeout(() => {
        setIsChanging(false)
        setPreviousTheme(theme)
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [theme, previousTheme])

  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: 360 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-background/95 backdrop-blur-sm border border-border/40 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: primary }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 1
                }}
              />
              <div>
                <h3 className="font-semibold text-foreground">Tema alterado!</h3>
                <p className="text-sm text-muted-foreground">Aplicando tema {name}...</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente de preview rápido do tema
export function ThemeQuickPreview() {
  const { primary, name } = useThemeColor()

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 bg-card border border-border/40 rounded-lg p-3 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center gap-2 text-sm">
        <div
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: primary }}
        />
        <span className="text-muted-foreground">Tema: {name}</span>
      </div>
    </motion.div>
  )
}