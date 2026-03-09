
// Helper to convert hex to rgb
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Helper to calculate luminance
function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
export function getContrastRatio(hex1: string, hex2: string) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 0;

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

// Generate tints and shades
// Simple implementation: mix with white or black
function mix(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }, weight: number) {
    const w = 2 * weight - 1;
    const a = 0; // alpha difference

    const w1 = ((w * (1 / (1 - a)) == -1) ? w : (w + a) / (1 + w * a) + 1) / 2;
    const w2 = 1 - w1;

    const r = Math.round(color1.r * w1 + color2.r * w2);
    const g = Math.round(color1.g * w1 + color2.g * w2);
    const b = Math.round(color1.b * w1 + color2.b * w2);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateScale(hex: string, steps: number = 9) {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const scale = [];
    // 5 tints (lighter), 1 base, 4 shades (darker) approx
    // Or just 50-900 like Tailwind

    // Let's generate a spread
    // 50 (lightest) -> 950 (darkest)

    // We'll treat input hex as 500
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    // Tints (mix with white)
    const tints = [0.9, 0.7, 0.5, 0.3, 0.1].map(w => mix(rgb, white, w)); // close to white, then less white

    // Shades (mix with black)
    const shades = [0.1, 0.3, 0.5, 0.7, 0.9].map(w => mix(rgb, black, w)); // close to color, then more black

    // This logic isn't perfect for "mix" function usually used in SASS. 
    // Let's use a simpler linear interpolation approach.

    // Re-implement simplified:
    // Tints: 50, 100, 200, 300, 400
    const t50 = mix(white, rgb, 0.95);
    const t100 = mix(white, rgb, 0.85);
    const t200 = mix(white, rgb, 0.65);
    const t300 = mix(white, rgb, 0.45);
    const t400 = mix(white, rgb, 0.25);

    // Base: 500
    const t500 = hex;

    // Shades: 600, 700, 800, 900, 950
    const t600 = mix(black, rgb, 0.15);
    const t700 = mix(black, rgb, 0.35);
    const t800 = mix(black, rgb, 0.55);
    const t900 = mix(black, rgb, 0.75);
    const t950 = mix(black, rgb, 0.85);

    return {
        50: t50,
        100: t100,
        200: t200,
        300: t300,
        400: t400,
        500: t500,
        600: t600,
        700: t700,
        800: t800,
        900: t900,
        950: t950
    };
}

export function getWCAGRating(ratio: number) {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    if (ratio >= 3) return "AA Large";
    return "Fail";
}
