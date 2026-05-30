import { useEffect } from "react";

/**
 * Injects a JSON-LD <script> into <head> for the lifetime of the component.
 * Use for per-page schema.org types like Course, Article, FAQPage, Product.
 *
 * Sitewide Organization/WebSite schema stays in index.html.
 */
export function useJsonLd(data: object | null | undefined, key: string) {
  useEffect(() => {
    if (!data) return;
    const id = `jsonld-${key}`;
    let tag = document.getElementById(id) as HTMLScriptElement | null;
    if (!tag) {
      tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(data);
    return () => {
      tag?.parentNode?.removeChild(tag);
    };
  }, [data, key]);
}
