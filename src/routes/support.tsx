import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "PlayLight — Support" },
      {
        name: "description",
        content: "Need help with Play Light? Reach the team at hello@playlight.app.",
      },
      { property: "og:title", content: "PlayLight — Support" },
      {
        property: "og:description",
        content: "Contact the Play Light team for help, feedback, or account requests.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute left-6 top-6 z-20 md:left-10 md:top-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
      </div>
      <SiteNav />

      <main className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10 md:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Light Technologies
        </p>
        <h1 className="mt-4 text-5xl font-light tracking-tight text-accent md:text-6xl">
          Support
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          We read every message. Whether you have a question, found a bug, or want to share
          feedback, the fastest way to reach us is by email.
        </p>

        <a
          href="mailto:hello@playlight.app"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-5 w-5" />
          <span className="text-left leading-tight">
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] opacity-70">
              Write to us
            </span>
            <span className="block text-sm font-medium">hello@playlight.app</span>
          </span>
        </a>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Common Questions
          </h2>
          <div className="mt-3 h-px w-full bg-border" />

          <div className="mt-6 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
            <div>
              <h3 className="text-lg font-medium text-foreground">How do I delete my account?</h3>
              <p className="mt-2">
                Full steps are on our{" "}
                <Link to="/delete" className="text-accent underline-offset-4 hover:underline">
                  Delete Account or Data
                </Link>{" "}
                page. In short: use{" "}
                <span className="text-foreground">Settings → Account → Delete Account</span> in
                the app, or email hello@playlight.app if you cannot access the app. Your data is
                permanently removed from our active database within 30 days.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground">I forgot my password.</h3>
              <p className="mt-2">
                Use the “Forgot password” link on the sign-in screen to receive a secure reset
                link by email. If the email never arrives, check your spam folder or contact us.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground">How do I report a bug or request a feature?</h3>
              <p className="mt-2">
                Email us with a short description and, if possible, your device model and app
                version. We triage feedback weekly and prioritise issues that affect the most
                users.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground">Where can I read your Privacy Policy?</h3>
              <p className="mt-2">
                Our full Privacy Policy is available{" "}
                <Link to="/privacy" className="text-accent underline-offset-4 hover:underline">
                  here
                </Link>
                . It explains what we collect, how we use it, and your rights.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Response time: within 2 business days
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}