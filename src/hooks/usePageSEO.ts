import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * Sets a unique <title>, <meta name="description">, and canonical link for the
 * current page. Restores the previous values on unmount so we don't leak the
 * About page's title onto, say, the Pricing page.
 *
 * Why: Google was showing two near-identical sitelinks for willowvibes.com
 * because the homepage and /about shared the same description from index.html.
 * Each public route now declares its own.
 */
export function usePageSEO({ title, description, canonical }: SEOOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    const descTag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const prevDesc = descTag?.getAttribute("content") ?? "";

    const canonicalTag = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    const prevCanonical = canonicalTag?.getAttribute("href") ?? "";

    document.title = title;
    if (descTag) descTag.setAttribute("content", description);
    if (canonical && canonicalTag) canonicalTag.setAttribute("href", canonical);

    // Also keep OG + Twitter in sync so social shares look right.
    const ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]'
    );
    const ogDesc = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    const ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    const twTitle = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:title"]'
    );
    const twDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:description"]'
    );

    const prevOgTitle = ogTitle?.getAttribute("content") ?? "";
    const prevOgDesc = ogDesc?.getAttribute("content") ?? "";
    const prevOgUrl = ogUrl?.getAttribute("content") ?? "";
    const prevTwTitle = twTitle?.getAttribute("content") ?? "";
    const prevTwDesc = twDesc?.getAttribute("content") ?? "";

    ogTitle?.setAttribute("content", title);
    ogDesc?.setAttribute("content", description);
    if (canonical) ogUrl?.setAttribute("content", canonical);
    twTitle?.setAttribute("content", title);
    twDesc?.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (descTag) descTag.setAttribute("content", prevDesc);
      if (canonicalTag && prevCanonical)
        canonicalTag.setAttribute("href", prevCanonical);
      ogTitle?.setAttribute("content", prevOgTitle);
      ogDesc?.setAttribute("content", prevOgDesc);
      if (prevOgUrl) ogUrl?.setAttribute("content", prevOgUrl);
      twTitle?.setAttribute("content", prevTwTitle);
      twDesc?.setAttribute("content", prevTwDesc);
    };
  }, [title, description, canonical]);
}
