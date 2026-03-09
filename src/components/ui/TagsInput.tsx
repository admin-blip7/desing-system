import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagsInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    label?: string;
    placeholder?: string;
}

export function TagsInput({ tags = [], onChange, label, placeholder }: TagsInputProps) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = input.trim();
            if (val && !tags.includes(val)) {
                onChange([...tags, val]);
                setInput("");
            }
        } else if (e.key === "Backspace" && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter(t => t !== tag));
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-[var(--bm-color-text-secondary)]">{label}</label>}
            <div className="flex flex-wrap gap-2 p-2 rounded-md transition-all bg-[var(--bm-input-bg)] border border-[var(--bm-input-border)] focus-within:ring-1 focus-within:ring-[var(--bm-input-focus-ring)]/60 focus-within:border-[var(--bm-input-focus-ring)]">
                {tags.map(tag => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-primary)]"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="bg-transparent border-none outline-none text-sm flex-1 min-w-[120px] text-[var(--bm-input-text)] placeholder:text-[var(--bm-color-text-secondary)]"
                />
            </div>
        </div>
    );
}
