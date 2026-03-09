"use client";

import { useState } from "react";
import { Share2, Globe, Lock, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { toggleBrandSharing } from "@/actions/share-brand";

interface ShareDialogProps {
    brandId: string;
    initialIsPublic: boolean;
    initialShareToken: string | null;
}

export default function ShareDialog({ brandId, initialIsPublic, initialShareToken }: ShareDialogProps) {
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [shareToken, setShareToken] = useState<string | null>(initialShareToken);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const shareUrl = shareToken
        ? `${window.location.origin}/share/${shareToken}`
        : "";

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true);
        try {
            const result = await toggleBrandSharing(brandId, checked);
            if (result.success) {
                setIsPublic(!!result.isPublic); // Force boolean
                setShareToken(result.shareToken);
                toast.success(checked ? "Link público activado" : "Link público desactivado");
            } else {
                toast.error("Error al actualizar estado");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setHasCopied(true);
        toast.success("Link copiado al portapapeles");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button type="button" className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <Share2 size={18} />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Compartir Manual de Marca</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Configura el acceso público para este manual.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="public-mode" className="flex flex-col space-y-1">
                            <span className="font-medium">Acceso Público</span>
                            <span className="text-xs font-normal text-zinc-400">
                                {isPublic ? "Cualquiera con el link puede ver" : "Solo tú puedes ver este manual"}
                            </span>
                        </Label>
                        <Switch
                            id="public-mode"
                            checked={isPublic}
                            onCheckedChange={handleToggle}
                            disabled={isLoading}
                        />
                    </div>

                    {isPublic && shareUrl && (
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={shareUrl}
                                    readOnly
                                    className="h-9 bg-zinc-900 border-zinc-800 text-zinc-300"
                                />
                            </div>
                            <Button size="sm" onClick={copyToClipboard} className="px-3 bg-white text-black hover:bg-zinc-200">
                                <span className="sr-only">Copy</span>
                                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
