"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PDFExportButtonProps {
    targetId: string;
    fileName?: string;
}

export default function PDFExportButton({ targetId, fileName = "brand-manual" }: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        const element = document.getElementById(targetId);
        if (!element) {
            toast.error("Contenido no encontrado para exportar");
            return;
        }

        setIsExporting(true);
        toast.info("Generando PDF (esto puede tomar unos segundos)...");

        try {
            // Wait a bit for any images/fonts to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2, // Better quality
                useCORS: true, // For images
                logging: false,
                backgroundColor: "#09090b", // Match weird dark theme background
                ignoreElements: (element: Element) => element.classList.contains("no-print")
            } as any);

            const imgData = canvas.toDataURL("image/png");

            // PDF Setup (A4)
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const imgWidth = 210; // A4 width
            const pageHeight = 297; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Subsequent pages
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${fileName}.pdf`);
            toast.success("PDF descargado correctamente");

        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Error al generar el PDF");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white text-black hover:bg-zinc-200"
        >
            {isExporting ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <Download size={16} className="mr-2" />
                    Export PDF
                </>
            )}
        </Button>
    );
}
