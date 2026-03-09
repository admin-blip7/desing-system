import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { runBamlText } from "@/lib/ai/bamlClient";

export interface AIResponse {
    success: boolean;
    content?: string;
    error?: string;
}

export interface ImageGenerationOptions {
    negativePrompt?: string;
    aspectRatio?: string;
    imageSize?: string;
    referenceImages?: string[];
}

const MODEL_NAME = process.env.OPENAI_TEXT_MODEL || "gpt-5-mini";
const AI_PROVIDER = (process.env.AI_PROVIDER || "openai").toLowerCase();

// Helper to clean and parse JSON from LLM output
function parseAIResponse(content: string): any {
    try {
        // 1. Try direct parse
        return JSON.parse(content);
    } catch (e) {
        // 2. Try extracting from code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e2) {
                // Formatting issues inside code block
            }
        }
        // 3. Try finding first { and last }
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            try {
                return JSON.parse(content.substring(start, end + 1));
            } catch (e3) {
                throw new Error("Could not parse JSON from response");
            }
        }
        throw new Error("No valid JSON found");
    }
}

export async function generateContent(
    prompt: string,
    systemPrompt?: string,
    forceJson: boolean = false,
    modelName?: string
): Promise<AIResponse> {
    try {
        const selectedModel = modelName || MODEL_NAME;
        let finalSystemPrompt = systemPrompt || "";
        if (forceJson) {
            finalSystemPrompt += "\n\nIMPORTANT: You must return valid JSON only. Do not add any conversational text before or after the JSON.";
        }

        if (AI_PROVIDER === "baml") {
            try {
                let content = (await runBamlText({
                    prompt,
                    systemPrompt: finalSystemPrompt,
                    forceJson,
                })).content;

                if (forceJson) {
                    const parsed = parseAIResponse(content);
                    content = JSON.stringify(parsed);
                }

                return {
                    success: true,
                    content,
                };
            } catch (promptFlowError: any) {
                console.warn("BAML unavailable, using OpenAI fallback:", promptFlowError?.message || promptFlowError);
            }
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "Falta la clave API de OpenAI. Agrega OPENAI_API_KEY en .env.local",
            };
        }

        const client = new OpenAI({ apiKey });

        let content = "";
        try {
            const response = await client.responses.create({
                model: selectedModel,
                max_output_tokens: 4096,
                input: [
                    ...(finalSystemPrompt
                        ? [{ role: "system", content: [{ type: "input_text", text: finalSystemPrompt }] }]
                        : []),
                    { role: "user", content: [{ type: "input_text", text: prompt }] },
                ],
            } as any);

            content = String((response as any)?.output_text || "").trim();

            if (!content) {
                const outputBlocks = ((response as any)?.output || []) as Array<any>;
                const textFromBlocks = outputBlocks
                    .flatMap((block) => block?.content || [])
                    .map((piece) => piece?.text)
                    .filter(Boolean)
                    .join("\n")
                    .trim();
                content = textFromBlocks;
            }
        } catch (responsesError) {
            const fallback = await client.chat.completions.create({
                model: selectedModel,
                max_completion_tokens: 4096,
                messages: [
                    ...(finalSystemPrompt ? [{ role: "system", content: finalSystemPrompt }] : []),
                    { role: "user", content: prompt },
                ],
            } as any);
            content = String(fallback.choices?.[0]?.message?.content || "").trim();

            if (!content) {
                throw responsesError;
            }
        }

        if (!content) {
            throw new Error("OpenAI no devolvió contenido.");
        }

        // If forceJson is true, try to parse/validate it
        if (forceJson) {
            try {
                const parsed = parseAIResponse(content);
                // Return stringified clean JSON to ensure consistency downstream or return object/string depending on contract
                // For now, let's keep the contract that 'content' is string, but we guarantee it's valid JSON string
                content = JSON.stringify(parsed);
            } catch (jsonError) {
                console.warn("JSON Parsing failed, retrying once...", jsonError);
                // Simple Retry Logic (could be recursive but once is usually enough for simple errors)
                // We append a "Please fix invalid JSON" message to the history if we were doing chat, 
                // but here we might just re-run with stronger instruction. 
                // For simplicity/cost, let's just return the raw content but marked as potentially unsafe? 
                // Or actually fail.
                return {
                    success: false,
                    error: "La IA no generó un formato válido JSON. Intenta regenerar.",
                };
            }
        }

        return {
            success: true,
            content: content,
        };

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return {
            success: false,
            error: error.message || "Error al comunicarse con la IA",
        };
    }
}

export async function generateImage(prompt: string, options: ImageGenerationOptions = {}): Promise<AIResponse> {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "Falta GOOGLE_API_KEY o GEMINI_API_KEY para generación de imágenes con Gemini.",
        };
    }

    const imageModel = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";
    const aspectRatio = options.aspectRatio || "1:1";
    const imageSize = options.imageSize || "2K";
    const negativePrompt = options.negativePrompt?.trim();

    try {
        const ai = new GoogleGenAI({ apiKey });
        const finalPrompt = negativePrompt
            ? `${prompt}\n\nNegative prompt (evitar): ${negativePrompt}`
            : prompt;

        const contents: Array<Record<string, unknown>> = [{ text: finalPrompt }];
        const referenceImages = options.referenceImages || [];

        for (const source of referenceImages.slice(0, 5)) {
            let mimeType = "image/jpeg";
            let base64Data = "";

            if (source.startsWith("data:image/")) {
                const match = source.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
                if (!match) continue;
                mimeType = match[1];
                base64Data = match[2];
            } else if (source.startsWith("http://") || source.startsWith("https://")) {
                const response = await fetch(source);
                if (!response.ok) continue;
                const buffer = Buffer.from(await response.arrayBuffer());
                base64Data = buffer.toString("base64");
                const contentType = response.headers.get("content-type");
                if (contentType?.startsWith("image/")) {
                    mimeType = contentType;
                }
            } else {
                base64Data = source;
            }

            if (!base64Data) continue;
            contents.push({
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: imageModel,
            contents,
            config: {
                responseModalities: ["TEXT", "IMAGE"],
                imageConfig: {
                    aspectRatio,
                    imageSize,
                },
            },
        });

        const parts = response?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
            if (!part.inlineData?.data) continue;
            const mimeType = part.inlineData.mimeType || "image/png";
            return {
                success: true,
                content: `data:${mimeType};base64,${part.inlineData.data}`,
            };
        }

        const textPart = parts.find((part) => Boolean(part.text))?.text;
        return {
            success: false,
            error: textPart || "Gemini no devolvió imagen para este prompt.",
        };
    } catch (error: unknown) {
        console.error("Gemini Image Generation Error:", error);
        const message = error instanceof Error ? error.message : "";
        return {
            success: false,
            error: message || "Error al generar la imagen con Gemini.",
        };
    }
}
