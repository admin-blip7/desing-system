import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Por favor inicia sesión para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuración de IA</h1>
        <p className="text-muted-foreground">
          La configuración de IA ahora es centralizada por el sistema.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold text-white">BYOK desactivado</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Se eliminó la configuración de API keys por usuario. El sistema usa la configuración interna de OpenAI.
        </p>
      </div>
    </div>
  );
}
