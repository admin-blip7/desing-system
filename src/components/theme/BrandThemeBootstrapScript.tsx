import { BRAND_THEME_STORAGE_KEY, BRAND_THEME_VARS_STORAGE_KEY } from "@/lib/design-tokens/storage";

const script = `(function () {
  try {
    var root = document.documentElement;
    var themeId = window.localStorage.getItem("${BRAND_THEME_STORAGE_KEY}");
    if (themeId) {
      root.setAttribute("data-brand-theme", themeId);
    }

    var serializedVars = window.localStorage.getItem("${BRAND_THEME_VARS_STORAGE_KEY}");
    if (!serializedVars) return;

    var vars = JSON.parse(serializedVars);
    if (!vars || typeof vars !== "object") return;

    for (var key in vars) {
      if (!Object.prototype.hasOwnProperty.call(vars, key)) continue;
      var value = vars[key];
      if (typeof value !== "string") continue;
      root.style.setProperty(key, value);
    }
  } catch (error) {
    // Ignore read/apply errors to avoid blocking initial paint.
  }
})();`;

export default function BrandThemeBootstrapScript() {
  return <script id="brand-theme-bootstrap" dangerouslySetInnerHTML={{ __html: script }} />;
}
