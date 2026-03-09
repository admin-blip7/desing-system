/**
 * SVG Template Components for Logo Generator
 * Simple parametric logo templates using SVG primitives
 */

import React from 'react';

export interface LogoTemplateProps {
  brandName: string;
  initials: string;
  primaryColor: string;
  secondaryColor: string;
  size?: number;
}

// ============================================================================
// MINIMAL TEMPLATES
// ============================================================================

/**
 * Circle template - Simple circle with brand initials
 */
export function CircleTemplate({
  initials,
  primaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName' | 'secondaryColor'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill={primaryColor} />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="40"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/**
 * Square template - Rounded square with brand initials
 */
export function SquareTemplate({
  initials,
  primaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName' | 'secondaryColor'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/**
 * Diamond template - Rotated square with brand initials
 */
export function DiamondTemplate({
  initials,
  primaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName' | 'secondaryColor'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="8"
        transform="rotate(45 50 50)"
        fill={primaryColor}
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

// ============================================================================
// TYPOGRAPHIC TEMPLATES
// ============================================================================

/**
 * Bold Letter template - Single large letter with accent
 */
export function BoldLetterTemplate({
  initials,
  primaryColor,
  secondaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName'>) {
  const letter = initials.charAt(0);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50"
        y="70"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="80"
        fontWeight="900"
        fill={primaryColor}
        fontFamily="sans-serif"
      >
        {letter}
      </text>
      <rect x="30" y="75" width="40" height="6" rx="3" fill={secondaryColor} />
    </svg>
  );
}

/**
 * Outline Letter template - Letter with stroke
 */
export function OutlineLetterTemplate({
  initials,
  primaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName' | 'secondaryColor'>) {
  const letter = initials.charAt(0);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50"
        y="70"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="80"
        fontWeight="900"
        stroke={primaryColor}
        strokeWidth="3"
        fill="none"
        fontFamily="sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

// ============================================================================
// BADGE TEMPLATES
// ============================================================================

/**
 * Hexagon Badge template
 */
export function HexagonBadgeTemplate({
  initials,
  primaryColor,
  secondaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName'>) {
  const points = "50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={points} fill={primaryColor} />
      <polygon
        points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35"
        fill={secondaryColor}
        opacity="0.3"
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/**
 * Shield Badge template
 */
export function ShieldBadgeTemplate({
  initials,
  primaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName' | 'secondaryColor'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5 L90 20 L90 50 C90 75, 70 90, 50 95 C30 90, 10 75, 10 50 L10 20 Z"
        fill={primaryColor}
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

// ============================================================================
// SPLIT/COMBINATION TEMPLATES
// ============================================================================

/**
 * Split Horizontal template - Two tone horizontal split
 */
export function SplitHorizontalTemplate({
  initials,
  primaryColor,
  secondaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="100" height="50" fill={primaryColor} />
      <rect x="0" y="50" width="100" height="50" fill={secondaryColor} />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/**
 * Split Vertical template - Two tone vertical split
 */
export function SplitVerticalTemplate({
  initials,
  primaryColor,
  secondaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="50" height="100" fill={primaryColor} />
      <rect x="50" y="0" width="50" height="100" fill={secondaryColor} />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/**
 * Quartered template - Four quadrants
 */
export function QuarteredTemplate({
  initials,
  primaryColor,
  secondaryColor,
  size = 100
}: Omit<LogoTemplateProps, 'brandName'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="50" height="50" fill={primaryColor} />
      <rect x="50" y="0" width="50" height="50" fill={secondaryColor} />
      <rect x="0" y="50" width="50" height="50" fill={secondaryColor} />
      <rect x="50" y="50" width="50" height="50" fill={primaryColor} />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        fontFamily="sans-serif"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        {initials}
      </text>
    </svg>
  );
}

// ============================================================================
// FULL LOGO WITH TEXT
// ============================================================================

export interface FullLogoProps extends LogoTemplateProps {
  layout: 'horizontal' | 'stacked';
  tagline?: string;
  fontWeight?: string;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

/**
 * Full logo with icon and brand name
 */
export function FullLogo({
  brandName,
  initials,
  primaryColor,
  secondaryColor,
  layout,
  tagline,
  fontWeight = 'bold',
  letterSpacing = 0,
  textTransform = 'none',
  size = 200,
  svgRef
}: FullLogoProps) {
  const isStacked = layout === 'stacked';

  // Get initials template
  const getIconTemplate = () => {
    return (
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="36"
          fontWeight="bold"
          fill="white"
          fontFamily="sans-serif"
        >
          {initials}
        </text>
      </svg>
    );
  };

  const getTransformedText = (text: string) => {
    if (textTransform === 'uppercase') return text.toUpperCase();
    if (textTransform === 'lowercase') return text.toLowerCase();
    return text;
  };

  if (isStacked) {
    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(70, 20)">
          {getIconTemplate()}
        </g>
        <text
          x="100"
          y="130"
          textAnchor="middle"
          fontSize="32"
          fontWeight={fontWeight}
          fill="white"
          fontFamily="sans-serif"
          letterSpacing={letterSpacing}
        >
          {getTransformedText(brandName)}
        </text>
        {tagline && (
          <text
            x="100"
            y="160"
            textAnchor="middle"
            fontSize="14"
            fontWeight="normal"
            fill={secondaryColor}
            fontFamily="sans-serif"
            letterSpacing={2}
          >
            {getTransformedText(tagline)}
          </text>
        )}
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size / 2}
      viewBox="0 0 300 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0, 10)">
        {getIconTemplate()}
      </g>
      <text
        x="90"
        y="55"
        textAnchor="start"
        fontSize="36"
        fontWeight={fontWeight}
        fill="white"
        fontFamily="sans-serif"
        letterSpacing={letterSpacing}
      >
        {getTransformedText(brandName)}
      </text>
      {tagline && (
        <text
          x="92"
          y="80"
          textAnchor="start"
          fontSize="14"
          fontWeight="normal"
          fill={secondaryColor}
          fontFamily="sans-serif"
          letterSpacing={2}
        >
          {getTransformedText(tagline)}
        </text>
      )}
    </svg>
  );
}

// ============================================================================
// TEMPLATE EXPORTS
// ============================================================================

export const iconTemplates = {
  circle: CircleTemplate,
  square: SquareTemplate,
  diamond: DiamondTemplate,
  boldLetter: BoldLetterTemplate,
  outlineLetter: OutlineLetterTemplate,
  hexagonBadge: HexagonBadgeTemplate,
  shieldBadge: ShieldBadgeTemplate,
  splitHorizontal: SplitHorizontalTemplate,
  splitVertical: SplitVerticalTemplate,
  quartered: QuarteredTemplate,
} as const;

export type IconTemplateType = keyof typeof iconTemplates;

export const templateDescriptions: Record<IconTemplateType, string> = {
  circle: 'Círculo con iniciales',
  square: 'Cuadrado redondeado',
  diamond: 'Diamante rotado',
  boldLetter: 'Letra gruesa con acento',
  outlineLetter: 'Letra con contorno',
  hexagonBadge: 'Badge hexagonal',
  shieldBadge: 'Badge de escudo',
  splitHorizontal: 'División horizontal',
  splitVertical: 'División vertical',
  quartered: 'Cuatro cuartos',
};
