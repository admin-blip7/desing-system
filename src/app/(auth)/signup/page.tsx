"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Sign up the user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                }
            });

            if (error) throw error;

            // Check if email confirmation is required
            if (data?.user && !data.session) {
                // Email confirmation required
                toast.success("Cuenta creada. Revisa tu email para confirmar.");
                router.push("/login");
            } else if (data?.session) {
                // Auto-logged in (email confirmation disabled in Supabase)
                toast.success("Cuenta creada exitosamente!");
                router.push("/"); // Go to onboarding flow
            }
        } catch (error: any) {
            toast.error(error.message || "Error al registrarse");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Crea tu cuenta</h1>
                <p className="text-zinc-400 text-sm">Empieza a construir tu marca hoy</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-3 text-white focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                        placeholder="nombre@ejemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-3 text-white focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Registrarse
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium">
                    Inicia Sesión
                </Link>
            </div>
        </div>
    );
}
