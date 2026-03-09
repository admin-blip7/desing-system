import { cn } from "@/lib/utils";

interface MultiSelectProps {
    options: string[];
    selected: string[] | string | undefined;
    onChange: (selected: string[]) => void;
    label?: string;
}

export function MultiSelect({ options, selected, onChange, label }: MultiSelectProps) {
    const normalizedSelected = Array.isArray(selected)
        ? selected
        : typeof selected === "string" && selected.trim().length > 0
            ? selected
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
            : [];

    const toggle = (option: string) => {
        if (normalizedSelected.includes(option)) {
            onChange(normalizedSelected.filter(s => s !== option));
        } else {
            onChange([...normalizedSelected, option]);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-[var(--bm-color-text-secondary)]">{label}</label>}
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => toggle(option)}
                        type="button"
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                            normalizedSelected.includes(option)
                                ? "bg-[var(--bm-color-accent-muted)] border-[var(--bm-color-accent)]/50 text-[var(--bm-color-accent)]"
                                : "bg-[var(--bm-input-bg)] border-[var(--bm-color-border)] text-[var(--bm-color-text-secondary)] hover:border-[var(--bm-color-border-strong)]"
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
