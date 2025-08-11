"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceSearchProps {
  onTranscript: (text: string) => void
  className?: string
}

export function VoiceSearch({ onTranscript, className = "" }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Verificar suporte para Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'pt-BR'

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex
          const transcriptResult = event.results[current][0].transcript
          
          setTranscript(transcriptResult)
          
          if (event.results[current].isFinal) {
            onTranscript(transcriptResult)
            setTranscript("")
            setIsListening(false)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          setTranscript("")
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return null // Não mostrar o botão se não for suportado
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={`gap-2 ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
      >
        {isListening ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <MicOff className="h-4 w-4" />
            </motion.div>
            Ouvindo...
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Falar
          </>
        )}
      </Button>

      {/* Indicador de transcrição */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-full mt-2 left-0 right-0 z-50"
          >
            <Badge 
              variant="secondary"
              className="w-full justify-center py-2 px-3 text-sm bg-primary/10 text-primary border-primary/20"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                "{transcript}"
              </motion.div>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador visual quando está ouvindo */}
      <AnimatePresence>
        {isListening && !transcript && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -right-2 z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook para usar busca por voz
export function useVoiceSearch(onResult: (text: string) => void) {
  const [isSupported, setIsSupported] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
  }, [])

  return {
    isSupported,
    VoiceSearchComponent: (props: Omit<VoiceSearchProps, 'onTranscript'>) => (
      <VoiceSearch {...props} onTranscript={onResult} />
    )
  }
}