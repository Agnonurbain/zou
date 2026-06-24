"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithPassword, signUp } from "@/app/actions/auth.actions"

const authSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
})

type AuthFormValues = z.infer<typeof authSchema>

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
      phoneNumber: "",
    },
  })

  async function onSubmit(values: AuthFormValues) {
    setServerError(null)
    setIsLoading(true)

    if (mode === "signup") {
      if (!values.businessName?.trim()) {
        setServerError("Le nom de la boutique est requis.")
        setIsLoading(false)
        return
      }

      if (!values.phoneNumber?.trim()) {
        setServerError("Le numéro de téléphone est requis.")
        setIsLoading(false)
        return
      }

      const { error } = await signUp(
        values.email,
        values.password,
        values.businessName,
        values.phoneNumber
      )

      setIsLoading(false)

      if (error) {
        setServerError(error.message ?? "Impossible de créer le compte.")
        return
      }

      router.push("/dashboard")
      return
    }

    const { error } = await signInWithPassword(values.email, values.password)
    setIsLoading(false)

    if (error) {
      setServerError(error.message ?? "Identifiants incorrects.")
      return
    }

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-3xl font-semibold tracking-tight">Zou</p>
          <p className="mt-2 text-sm text-slate-400">
            Gère ta boutique depuis un seul tableau de bord.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-900 px-6 py-5 text-white md:px-8 md:py-6">
            <CardTitle className="text-2xl text-white md:text-3xl">
              {mode === "signin" ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-slate-300 text-base md:text-lg">
              {mode === "signin"
                ? "Connecte-toi avec ton adresse email"
                : "Crée ton compte vendeur Zou"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-8 md:px-8 md:py-10">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="hello@zou.com" 
                  className="h-10 text-base md:h-12"
                  {...register("email")} 
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-base">Mot de passe</Label>
                <div className="relative flex items-center">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="h-10 pr-10 text-base md:h-12"
                    {...register("password")} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-300 transition"
                    aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {mode === "signup" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="businessName" className="text-base">Nom de la boutique</Label>
                    <Input 
                      id="businessName" 
                      placeholder="Ex : Zou Boutique" 
                      className="h-10 text-base md:h-12"
                      {...register("businessName")} 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber" className="text-base">Téléphone</Label>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      placeholder="+229 90 12 34 56" 
                      className="h-10 text-base md:h-12"
                      {...register("phoneNumber")} 
                    />
                  </div>
                </>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{serverError}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 py-6 md:px-8 md:py-8">
            <Button 
              className="w-full h-10 text-base md:h-12 md:text-lg" 
              type="button" 
              onClick={handleSubmit(onSubmit)} 
              disabled={isLoading}
            >
              {isLoading ? "Patiente..." : mode === "signin" ? "Se connecter" : "Créer un compte"}
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
              <span>
                {mode === "signin" ? "Pas encore de compte ?" : "Tu as déjà un compte ?"}
              </span>
              <button
                type="button"
                className="text-sm font-medium text-slate-200 underline-offset-4 transition hover:text-white hover:underline"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin")
                  setServerError(null)
                }}
              >
                {mode === "signin" ? "Créer un compte" : "Se connecter"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
