import { createFileRoute } from "@tanstack/react-router";
import { PlaylightStory } from "@/components/landing/story/PlaylightStory";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      path: "/about",
      title: "About Playlight — a warm light for your day",
      description:
        "Meet Playlight: a calm orb that helps you hold the day — focus, protocol, and a memory of what you meant to do.",
    }),
    // The story is the only place set in Fraunces, so it pays for it.
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <PlaylightStory />;
}
