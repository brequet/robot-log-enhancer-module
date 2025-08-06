import tailwindStyleSheet from "./tailwind.css?inline";

/**
 * Since Tailwind v4, Tailwind CSS uses `@property` to define custom properties.
 * However, these properties are not supported in Shadow DOM.
 * This function injects a fixed version of the Tailwind CSS styles
 * that replaces `@property` declarations with manual CSS variables
 * to ensure compatibility with Shadow DOM.
 *
 * @param host The host element to inject the Tailwind CSS styles into.
 */
export function injectTailwindStyleForShadowDOM(host: HTMLElement) {
  const style = document.createElement("style");
  style.textContent = fixTailwindForShadowDOM(tailwindStyleSheet);
  if (!host.shadowRoot) {
    throw new Error("Host element does not have a shadow root.");
  }
  host.shadowRoot.appendChild(style);
}

function fixTailwindForShadowDOM(css: string): string {
  const propertyDeclarations = new Map<string, string>();

  // Extract @property declarations
  const propertyRegex = /@property\s+([^{]+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = propertyRegex.exec(css)) !== null) {
    const propName = match[1].trim();
    const propBody = match[2].trim();

    // Parse initial-value from @property
    const initialMatch = propBody.match(/initial-value:\s*([^;]+)/);
    if (initialMatch) {
      propertyDeclarations.set(propName, initialMatch[1].trim());
    }
  }

  // Remove @property declarations and add manual CSS variables
  let fixedCSS = css.replace(propertyRegex, "");

  // Add manual CSS variables to :host
  if (propertyDeclarations.size > 0) {
    const manualVars = Array.from(propertyDeclarations.entries())
      .map(([prop, value]) => `    ${prop}: ${value};`)
      .join("\n");

    fixedCSS = fixedCSS.replace(/(:host\s*{[^}]*)/, `$1\n${manualVars}`);
  }

  return fixedCSS.replace(/:root(?!\s*,\s*:host)/g, ":root, :host");
}
