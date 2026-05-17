"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Loader2, CheckCircle2, Shield } from "lucide-react";
import { useSearchParams } from "next/navigation";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "free";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        setError("Не удалось зарегистрироваться. Попробуйте ещё раз.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Почти готово!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Мы отправили ссылку для входа на{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Нажми на неё чтобы завершить регистрацию.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Не нашёл письмо? Проверь папку &laquo;Спам&raquo;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Создать аккаунт</CardTitle>
        <CardDescription>
          {plan === "pro"
            ? "Регистрация для плана Student Pro"
            : plan === "academic"
            ? "Регистрация для плана Academic+"
            : "Начни учиться умнее — бесплатно"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span className="ml-2">Зарегистрироваться через Google</span>
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">или через email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Электронная почта</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@university.kz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading || !email}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Получить ссылку для входа
          </Button>
        </form>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Регистрируясь, вы принимаете наши{" "}
            <Link href="#" className="underline hover:text-foreground">
              Условия использования
            </Link>{" "}
            и{" "}
            <Link href="#" className="underline hover:text-foreground">
              Политику конфиденциальности
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
