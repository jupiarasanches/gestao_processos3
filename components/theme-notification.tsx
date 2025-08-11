"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Palette, CheckCircle } from "lucide-react"

interface ThemeNotificationProps {
  isVisible: boolean
  themeName: string
  color: string
  onComplete?: () => void
}

export function ThemeNotification({ 
  isVisible, 
  themeName, 
  color, 
  onComplete 
}: ThemeNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 bg-card border border-border/40 rounded-lg shadow-2xl p-4 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex-shrink-0"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">
                🎨 Tema Aplicado!
              </h4>
              <p className="text-sm text-muted-foreground">
                Tema <strong>{themeName}</strong> foi aplicado com sucesso.
              </p>
            </div>
            
            <motion.div
              className="flex-shrink-0"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Palette className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
          
          {/* Barra de progresso */}
          <motion.div
            className="mt-3 h-1 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para gerenciar notificações de tema
export function useThemeNotification() {
  const [notification, setNotification] = useState<{
    isVisible: boolean
    themeName: string
    color: string
  }>({
    isVisible: false,
    themeName: "",
    color: ""
  })

  const showNotification = (themeName: string, color: string) => {
    setNotification({
      isVisible: true,
      themeName,
      color
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}