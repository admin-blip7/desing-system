"use server";

/**
 * Server Action for AI Logo Generation
 * Integrates with deapi.ai API for secure server-side logo generation
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GenerateLogoInput {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  typography: 'Serif' | 'Sans-serif' | 'Modern' | 'Script' | 'Bold' | 'Light';
  tone: 'Professional' | 'Playful' | 'Luxury' | 'Minimalist' | 'Bold' | 'Elegant' | 'Tech' | 'Organic';
  industry?: string;
  iconStyle?: 'abstract' | 'geometric' | 'typographic' | 'symbolic' | 'badge';
  layout?: 'horizontal' | 'stacked' | 'icon-only';
}

export interface GenerateLogoResult {
  success: boolean;
  imageUrl?: string;
  base64?: string;
  error?: string;
  errorType?: 'validation' | 'api' | 'server' | 'unauthorized';
}

export interface DeapiAIResponse {
  success: boolean;
  data?: {
    image?: string;
    url?: string;
    base64?: string;
  };
  error?: string;
  message?: string;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates a hex color code
 */
function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validates the input parameters
 */
function validateInput(input: GenerateLogoInput): { valid: boolean; error?: string } {
  if (!input.brandName || input.brandName.trim().length === 0) {
    return { valid: false, error: "Brand name is required" };
  }

  if (input.brandName.length > 100) {
    return { valid: false, error: "Brand name must be less than 100 characters" };
  }

  if (!input.primaryColor || !isValidHexColor(input.primaryColor)) {
    return { valid: false, error: "Primary color must be a valid hex code (e.g., #FF5733)" };
  }

  if (!input.secondaryColor || !isValidHexColor(input.secondaryColor)) {
    return { valid: false, error: "Secondary color must be a valid hex code (e.g., #FF5733)" };
  }

  const validTypography: GenerateLogoInput['typography'][] = ['Serif', 'Sans-serif', 'Modern', 'Script', 'Bold', 'Light'];
  if (!input.typography || !validTypography.includes(input.typography)) {
    return { valid: false, error: "Invalid typography style" };
  }

  const validTones: GenerateLogoInput['tone'][] = ['Professional', 'Playful', 'Luxury', 'Minimalist', 'Bold', 'Elegant', 'Tech', 'Organic'];
  if (!input.tone || !validTones.includes(input.tone)) {
    return { valid: false, error: "Invalid tone style" };
  }

  if (input.industry && input.industry.length > 50) {
    return { valid: false, error: "Industry must be less than 50 characters" };
  }

  return { valid: true };
}

// ============================================================================
// PROMPT CONSTRUCTION
// ============================================================================

/**
 * Builds a detailed prompt for AI logo generation
 */
function buildLogoPrompt(input: GenerateLogoInput): string {
  const {
    brandName,
    primaryColor,
    secondaryColor,
    typography,
    tone,
    industry = "business",
    iconStyle = "geometric",
    layout = "horizontal"
  } = input;

  // Color descriptors for better AI understanding
  const getColorDescriptor = (hex: string): string => {
    const colorMap: Record<string, string> = {
      '#FF0000': 'vibrant red', '#00FF00': 'bright green', '#0000FF': 'pure blue',
      '#FFFF00': 'sunny yellow', '#FF00FF': 'magenta', '#00FFFF': 'cyan',
      '#000000': 'deep black', '#FFFFFF': 'pure white', '#808080': 'neutral gray',
    };
    return colorMap[hex.toUpperCase()] || hex;
  };

  const primaryDesc = getColorDescriptor(primaryColor);
  const secondaryDesc = getColorDescriptor(secondaryColor);

  // Typography style mapping
  const typographyStyles: Record<string, string> = {
    'Serif': 'elegant serif font with classic traditional styling',
    'Sans-serif': 'clean modern sans-serif font with geometric proportions',
    'Modern': 'contemporary minimalist font with sleek lines',
    'Script': 'elegant cursive script font with flowing strokes',
    'Bold': 'heavy bold font with strong impact',
    'Light': 'delicate thin font with refined elegance'
  };

  // Tone style mapping
  const toneDescriptors: Record<string, string> = {
    'Professional': 'corporate professional trustworthy reliable established',
    'Playful': 'fun playful energetic friendly cheerful whimsical',
    'Luxury': 'luxurious premium elegant sophisticated exclusive high-end',
    'Minimalist': 'minimalist clean simple streamlined uncluttered',
    'Bold': 'bold powerful strong confident dynamic',
    'Elegant': 'elegant graceful refined chic polished',
    'Tech': 'futuristic technological innovative digital cutting-edge',
    'Organic': 'natural organic eco-friendly sustainable earthy'
  };

  // Icon style mapping
  const iconStyleDescriptors: Record<string, string> = {
    'abstract': 'abstract geometric shapes with modern artistic interpretation',
    'geometric': 'precise geometric forms with clean lines and mathematical proportions',
    'typographic': 'creative typographic treatment focusing on the brand initials',
    'symbolic': 'symbolic icon representing the brand essence',
    'badge': 'badge-style logo with contained elements'
  };

  // Layout descriptions
  const layoutDescriptions: Record<string, string> = {
    'horizontal': 'horizontal layout with icon beside text',
    'stacked': 'vertical stacked layout with icon above text',
    'icon-only': 'icon-only standalone symbol mark'
  };

  // Construct the main prompt - concise format works better for AI image generation
  const prompt = `Professional logo design for "${brandName}" in the ${industry} sector. ${typographyStyles[typography]}. ${iconStyleDescriptors[iconStyle]}. ${toneDescriptors[tone]}. Main colors: ${primaryDesc} (${primaryColor}) and ${secondaryDesc} (${secondaryColor}). ${layoutDescriptions[layout]}. Clean vector style, white background, minimal and memorable design suitable for brand identity.`;

  return prompt;
}

/**
 * Default negative prompt (empty string as per deapi.ai API format)
 */
const DEFAULT_NEGATIVE_PROMPT = "";

// ============================================================================
// API INTEGRATION
// ============================================================================

const DEAPI_API_URL = "https://api.deapi.ai/api/v1/client/txt2img";

/**
 * Main server action to generate a logo using deapi.ai API
 */
export async function generateLogo(input: GenerateLogoInput): Promise<GenerateLogoResult> {
  // Read environment variable at request time
  const DEAPI_API_KEY = process.env.DEAPI_AI_KEY;

  // Validate environment variable
  if (!DEAPI_API_KEY) {
    console.error("[LogoGenerator] DEAPI_AI_KEY environment variable is not set");
    return {
      success: false,
      error: "Logo generation service is not configured. Please contact support.",
      errorType: "server"
    };
  }

  // Validate input
  const validation = validateInput(input);
  if (!validation.valid) {
    console.warn("[LogoGenerator] Validation failed:", validation.error);
    return {
      success: false,
      error: validation.error,
      errorType: "validation"
    };
  }

  // Build the prompt
  const prompt = buildLogoPrompt(input);

  // Prepare API request
  const requestBody = {
    prompt,
    model: "ZImageTurbo_INT8",
    width: 768,
    height: 768,
    steps: 8,
    negative_prompt: DEFAULT_NEGATIVE_PROMPT,
    seed: Math.floor(Math.random() * 1000000000) // Random seed for variety
  };

  try {
    const response = await fetch(DEAPI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEAPI_API_KEY}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    // Handle unauthorized
    if (response.status === 401) {
      console.error("[LogoGenerator] Unauthorized: Invalid API key");
      return {
        success: false,
        error: "Authentication failed. Please check the API configuration.",
        errorType: "unauthorized"
      };
    }

    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`[LogoGenerator] API error ${response.status}:`, errorText);
      return {
        success: false,
        error: `Logo generation service returned an error (${response.status}). Please try again.`,
        errorType: "api"
      };
    }

    // Parse response
    const data: DeapiAIResponse = await response.json();

    if (!data.success || !data.data) {
      console.error("[LogoGenerator] API returned unsuccessful response:", data);
      return {
        success: false,
        error: data.error || data.message || "Failed to generate logo. Please try again.",
        errorType: "api"
      };
    }

    // Extract image data
    const imageUrl = data.data.url || data.data.image;
    const base64 = data.data.base64;

    if (!imageUrl && !base64) {
      console.error("[LogoGenerator] No image data in response");
      return {
        success: false,
        error: "No image data received from the generation service.",
        errorType: "api"
      };
    }

    return {
      success: true,
      imageUrl,
      base64
    };

  } catch (error) {
    // Handle network or parsing errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[LogoGenerator] Request failed:", errorMessage);

    return {
      success: false,
      error: "Network error occurred while generating the logo. Please check your connection and try again.",
      errorType: "server"
    };
  }
}

/**
 * Server Action to generate and upload a logo to Supabase storage
 * This combines generation with storage for a complete workflow
 */
export async function generateAndStoreLogo(
  input: GenerateLogoInput,
  _brandId: string
): Promise<GenerateLogoResult & { storageUrl?: string }> {
  void _brandId;

  // First generate the logo
  const result = await generateLogo(input);

  if (!result.success || !result.base64) {
    return result;
  }

  // If we have base64 data, we could upload to Supabase here
  // For now, return the base64 data which can be handled on the client
  return {
    ...result,
    storageUrl: result.imageUrl // Could be replaced with Supabase URL
  };
}
