"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "default" | "blue" | "purple" | "orange"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Array<{
    id: Theme
    name: string
    colors: {
      primary: string
      primaryForeground: string
      secondary: string
      secondaryForeground: string
      accent: string
      accentForeground: string
      muted: string
      mutedForeground: string
    }
    previewRgb: string
  }>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themeConfigs = {
  default: {
    id: "default" as Theme,
    name: "Padrão",
    colors: {
      primary: "oklch(0.6 0.25 140)", // Verde
      primaryForeground: "oklch(0.05 0.02 220)",
      secondary: "oklch(0.15 0.04 180)",
      secondaryForeground: "oklch(0.98 0.02 120)",
      accent: "oklch(0.18 0.05 160)",
      accentForeground: "oklch(0.98 0.02 120)",
      muted: "oklch(0.15 0.04 200)",
      mutedForeground: "oklch(0.65 0.03 150)"
    },
    previewRgb: "34 197 94" // Para preview visual
  },
  blue: {
    id: "blue" as Theme,
    name: "Azul", 
    colors: {
      primary: "oklch(0.6 0.25 240)", // Azul
      primaryForeground: "oklch(0.05 0.02 220)",
      secondary: "oklch(0.15 0.04 240)",
      secondaryForeground: "oklch(0.98 0.02 120)",
      accent: "oklch(0.18 0.05 240)",
      accentForeground: "oklch(0.98 0.02 120)",
      muted: "oklch(0.15 0.04 200)",
      mutedForeground: "oklch(0.65 0.03 150)"
    },
    previewRgb: "59 130 246"
  },
  purple: {
    id: "purple" as Theme,
    name: "Roxo",
    colors: {
      primary: "oklch(0.6 0.25 300)", // Roxo
      primaryForeground: "oklch(0.05 0.02 220)", 
      secondary: "oklch(0.15 0.04 300)",
      secondaryForeground: "oklch(0.98 0.02 120)",
      accent: "oklch(0.18 0.05 300)",
      accentForeground: "oklch(0.98 0.02 120)",
      muted: "oklch(0.15 0.04 200)",
      mutedForeground: "oklch(0.65 0.03 150)"
    },
    previewRgb: "139 92 246"
  },
  orange: {
    id: "orange" as Theme,
    name: "Laranja",
    colors: {
      primary: "oklch(0.6 0.25 40)", // Laranja
      primaryForeground: "oklch(0.05 0.02 220)",
      secondary: "oklch(0.15 0.04 40)",
      secondaryForeground: "oklch(0.98 0.02 120)",
      accent: "oklch(0.18 0.05 40)",
      accentForeground: "oklch(0.98 0.02 120)",
      muted: "oklch(0.15 0.04 200)",
      mutedForeground: "oklch(0.65 0.03 150)"
    },
    previewRgb: "249 115 22"
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default")

  // Aplicar tema ao DOM
  const applyTheme = (themeName: Theme) => {
    const config = themeConfigs[themeName]
    const root = document.documentElement

    // Aplicar cores principais
    root.style.setProperty('--primary', config.colors.primary)
    root.style.setProperty('--primary-foreground', config.colors.primaryForeground)
    root.style.setProperty('--secondary', config.colors.secondary)
    root.style.setProperty('--secondary-foreground', config.colors.secondaryForeground)
    root.style.setProperty('--accent', config.colors.accent)
    root.style.setProperty('--accent-foreground', config.colors.accentForeground)
    root.style.setProperty('--muted', config.colors.muted)
    root.style.setProperty('--muted-foreground', config.colors.mutedForeground)
    
    // Atualizar também o ring para usar a cor primária
    root.style.setProperty('--ring', config.colors.primary)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem("ecoflow-theme", newTheme)
  }

  // Carregar tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("ecoflow-theme") as Theme
    if (savedTheme && savedTheme in themeConfigs) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme("default")
    }
  }, [])

  const value: ThemeContextType = {
    theme,
    setTheme,
    themes: Object.values(themeConfigs)
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Hook para obter a cor hexadecimal do tema atual
export function useThemeColor() {
  const { theme } = useTheme()
  
  const getHexColor = (rgbString: string) => {
    const [r, g, b] = rgbString.split(' ').map(Number)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return {
    primary: getHexColor(themeConfigs[theme].previewRgb),
    name: themeConfigs[theme].name,
    previewRgb: themeConfigs[theme].previewRgb
  }
}