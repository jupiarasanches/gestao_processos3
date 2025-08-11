"use client"

import { motion } from "framer-motion"
import { Loader2, TreePine } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal" | "branded"
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default",
  text = "Carregando..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  const containerClasses = {
    sm: "gap-2 text-sm",
    md: "gap-3 text-base",
    lg: "gap-4 text-lg"
  }

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center p-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
      </motion.div>
    )
  }

  if (variant === "branded") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <TreePine className="h-8 w-8" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h3 className="text-lg font-semibold text-foreground">EcoFlow</h3>
          <p className="text-sm text-muted-foreground">Sistema de Gestão Ambiental</p>
          <motion.div
            className="flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs text-muted-foreground">{text}</span>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-1"
            >
              <div className="w-1 h-1 bg-primary rounded-full" />
              <div className="w-1 h-1 bg-primary rounded-full" />
              <div className="w-1 h-1 bg-primary rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex flex-col items-center justify-center p-6 ${containerClasses[size]}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-3"
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground font-medium"
      >
        {text}
      </motion.p>
    </motion.div>
  )
}

// Componente específico para transições de página
export function PageLoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.15,
        ease: "easeInOut"
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut",
          delay: 0.05
        }}
        className="flex flex-col items-center gap-3"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <motion.p 
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.25,
            ease: "easeOut",
            delay: 0.1
          }}
          className="text-sm text-muted-foreground"
        >
          Carregando...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}