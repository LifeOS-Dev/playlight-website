/**
 * Everything search and social see.
 *
 * One place, because the name had drifted into four spellings across the
 * routes — Playlight, PlayLight, Play Light and playlight — and because a
 * share card that renders blank is a first impression too.
 */
export const SITE = {
  name: "Playlight",
  url: "https://www.playlight.app",
  image: "https://www.playlight.app/og-image.jpg",
  imageAlt: "A single warm light resting on a dark road",
} as const;

export function pageMeta({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE.url}${path}` },
    { property: "og:image", content: SITE.image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: SITE.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: SITE.image },
  ];
}
