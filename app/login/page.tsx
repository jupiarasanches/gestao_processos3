"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/mock-auth-provider"
import { TreePine, Mail, Lock, User, AlertCircle, Loader2, Sparkles, Leaf } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nome, setNome] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await signIn(email, password)

    if (error) {
      setError("Email ou senha incorretos. Verifique suas credenciais.")
    } else {
      router.push("/")
    }

    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, nome)

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este email já está cadastrado. Faça login ou use outro email.")
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } else {
      setMessage("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.")
      setActiveTab("login")
    }

    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await resetPassword(resetEmail)

    if (error) {
      setError("Erro ao enviar email de recuperação. Verifique o endereço informado.")
    } else {
      setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with animated gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/40 rounded-full animate-pulse delay-100"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-200"></div>
      <div className="absolute bottom-40 right-20 w-1 h-1 bg-secondary/30 rounded-full animate-pulse delay-300"></div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-lg bg-card/80 border border-border/50 shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20">
          <CardHeader className="relative text-center space-y-6 pb-8">
            {/* Link para BASE_DO_PROJETO.md apenas em dev */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute right-4 top-4 text-xs">
                <Link
                  href="/base"
                  className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                  aria-label="Abrir documentação base do projeto"
                >
                  Documentação Base
                </Link>
              </div>
            )}

            {/* Logo section with improved styling */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-105">
                  <TreePine className="h-9 w-9" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
                  <Leaf className="h-3 w-3" />
                </div>
              </div>
            </div>
            
            {/* Title and description with improved typography */}
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Fluxo de processos da Florestal
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80">
                Sistema de Gestão Ambiental
              </CardDescription>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
                <Sparkles className="h-3 w-3" />
                <span>Versão 2.0 • Powered by AI</span>
              </div>
              <p className="text-xs text-center text-muted-foreground/70 max-w-xs mx-auto">
                Faça login para acessar o dashboard e gerenciar seus processos ambientais
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Cadastrar
                </TabsTrigger>
                <TabsTrigger 
                  value="reset"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Recuperar
                </TabsTrigger>
              </TabsList>

              {/* Error and success messages with improved styling */}
              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{message}</AlertDescription>
                </Alert>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-5">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground/90">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground/90">
                      Senha
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-5">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="nome" className="text-sm font-medium text-foreground/90">
                      Nome Completo
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-foreground/90">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-foreground/90">
                      Senha
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground/70">Mínimo de 6 caracteres</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/25 transition-all duration-300 hover:shadow-secondary/40 hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Reset Tab */}
              <TabsContent value="reset" className="space-y-5">
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="reset-email" className="text-sm font-medium text-foreground/90">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground/70">Enviaremos um link para redefinir sua senha</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-muted-foreground to-muted-foreground/90 hover:from-muted-foreground/90 hover:to-muted-foreground shadow-lg shadow-muted-foreground/25 transition-all duration-300 hover:shadow-muted-foreground/40 hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Link"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo credentials info */}
            <div className="pt-4 border-t border-border/30">
              <div className="text-center space-y-3">
                <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-3 border border-border/30">
                  <p className="text-xs font-medium text-muted-foreground mb-2">🧪 Credenciais de Demonstração:</p>
                  <div className="space-y-1 text-xs text-muted-foreground/80">
                    <p><span className="font-medium">Admin:</span> admin@ecoflow.com | 123456</p>
                    <p><span className="font-medium">Usuário:</span> maria@ecoflow.com | 123456</p>
                    <p><span className="font-medium">Criar conta:</span> Funcional com qualquer email</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/80">Problemas para acessar?</p>
                <Link 
                  href="/suporte" 
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Entre em contato com o suporte
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}