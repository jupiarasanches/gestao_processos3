"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getSupabaseClient } from "@/lib/supabase"
import { TreePine, Lock, AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Shield, Key, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [strengthText, setStrengthText] = useState("")
  const [validationChecks, setValidationChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (!accessToken || !refreshToken) {
      setError("Link de recuperação inválido ou expirado.")
      return
    }

    // Set the session with the tokens
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }, [searchParams, supabase.auth])

  // Password strength validation
  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    setValidationChecks(checks)

    const strength = Object.values(checks).filter(Boolean).length
    setPasswordStrength(strength)

    switch (strength) {
      case 0:
      case 1:
        setStrengthText("Muito fraca")
        break
      case 2:
        setStrengthText("Fraca")
        break
      case 3:
        setStrengthText("Média")
        break
      case 4:
        setStrengthText("Forte")
        break
      case 5:
        setStrengthText("Muito forte")
        break
    }
  }, [password])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      setLoading(false)
      return
    }

    if (passwordStrength < 3) {
      setError("Escolha uma senha mais forte para maior segurança.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError("Erro ao redefinir senha. Tente novamente.")
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 4000)
    }

    setLoading(false)
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-orange-500"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-blue-500"
      case 5:
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  const getStrengthTextColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "text-red-600"
      case 2:
        return "text-orange-600"
      case 3:
        return "text-yellow-600"
      case 4:
        return "text-blue-600"
      case 5:
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,oklch(0.15_0.05_140),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.15_0.05_180),transparent_50%)]"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <Card className="backdrop-blur-lg bg-card/80 border border-border/50 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
                  <CheckCircle className="h-10 w-10" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">✅ Senha Redefinida!</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Sua senha foi alterada com sucesso
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  🔐 Sua conta está mais segura agora!
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                  Você será redirecionado para o login em alguns segundos...
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                  <Key className="mr-2 h-4 w-4" />
                  Fazer Login Agora
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/dashboard")} 
                  className="w-full"
                >
                  Ir para Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with animated gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,oklch(0.15_0.05_140),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.15_0.05_180),transparent_50%)]"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary/20 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-lg bg-card/80 border border-border/50 shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Shield className="h-10 w-10" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">🔒 Nova Senha</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Crie uma senha forte para proteger sua conta
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="space-y-3">
                    {/* Password Strength Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Força da senha:</span>
                        <Badge variant="outline" className={`text-xs ${getStrengthTextColor()}`}>
                          {strengthText}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${validationChecks.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <div className={`w-2 h-2 rounded-full ${validationChecks.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        8+ caracteres
                      </div>
                      <div className={`flex items-center gap-1 ${validationChecks.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <div className={`w-2 h-2 rounded-full ${validationChecks.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Maiúscula
                      </div>
                      <div className={`flex items-center gap-1 ${validationChecks.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <div className={`w-2 h-2 rounded-full ${validationChecks.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Minúscula
                      </div>
                      <div className={`flex items-center gap-1 ${validationChecks.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <div className={`w-2 h-2 rounded-full ${validationChecks.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Número
                      </div>
                      <div className={`flex items-center gap-1 ${validationChecks.special ? 'text-green-600' : 'text-muted-foreground'} col-span-2`}>
                        <div className={`w-2 h-2 rounded-full ${validationChecks.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Caractere especial (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    As senhas não coincidem
                  </p>
                )}
                
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Senhas coincidem
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-medium" 
                disabled={loading || passwordStrength < 3 || password !== confirmPassword}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Redefinir Senha
                  </>
                )}
              </Button>
              
              <div className="pt-4 border-t border-border/30">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}