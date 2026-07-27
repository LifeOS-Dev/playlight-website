import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/delete")({
  head: () => ({
    meta: [
      { title: "Play Light — Delete Account or Data" },
      {
        name: "description",
        content:
          "Request deletion of your Play Light account or associated data. Steps for Light Technologies users.",
      },
      { property: "og:title", content: "Play Light — Delete Account or Data" },
      {
        property: "og:description",
        content:
          "How to request that your Play Light account and data are deleted by Light Technologies.",
      },
    ],
  }),
  component: DeletePage,
});

function DeletePage() {
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
          Delete Account or Data
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          This page explains how users of{" "}
          <span className="text-foreground">Play Light</span>, the mobile app by{" "}
          <span className="text-foreground">Light Technologies</span>, can request deletion of
          their account and associated data — or request deletion of some or all of their data
          without deleting their account.
        </p>

        <div className="mt-10 rounded-lg border border-border bg-foreground/[0.02] p-6 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Application:</span> Play Light
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Developer:</span> Light Technologies
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Contact:</span> hello@playlight.app
          </p>
        </div>

        <a
          href="mailto:hello@playlight.app?subject=Play%20Light%20deletion%20request"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-5 w-5" />
          <span className="text-left leading-tight">
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] opacity-70">
              Email a deletion request
            </span>
            <span className="block text-sm font-medium">hello@playlight.app</span>
          </span>
        </a>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            1. Delete your Play Light account and associated data
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            Use one of the following methods. Both permanently delete your Play Light account and
            the personal data linked to it.
          </p>

          <h3 className="mt-8 text-lg font-medium text-foreground">Option A — In the app</h3>
          <ol className="mt-3 ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>Open the Play Light app and sign in.</li>
            <li>
              Go to <span className="text-foreground">Settings → Account → Delete Account</span>.
            </li>
            <li>Confirm the deletion when prompted.</li>
          </ol>

          <h3 className="mt-8 text-lg font-medium text-foreground">
            Option B — By email (if you cannot access the app)
          </h3>
          <ol className="mt-3 ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              Email{" "}
              <a
                href="mailto:hello@playlight.app?subject=Play%20Light%20account%20deletion%20request"
                className="text-accent underline-offset-4 hover:underline"
              >
                hello@playlight.app
              </a>{" "}
              from the email address associated with your Play Light account.
            </li>
            <li>
              Use the subject line{" "}
              <span className="text-foreground">“Play Light account deletion request”</span>.
            </li>
            <li>
              Include your account email (and display name if you remember it) so we can verify
              the request.
            </li>
            <li>
              We will confirm receipt and complete the deletion. We respond within 2 business days
              and process verifiable requests within 30 days.
            </li>
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            2. Request deletion of data without deleting your account
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            You can ask Light Technologies to delete some or all of your Play Light data while
            keeping your account active.
          </p>
          <ol className="mt-6 ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              Email{" "}
              <a
                href="mailto:hello@playlight.app?subject=Play%20Light%20data%20deletion%20request"
                className="text-accent underline-offset-4 hover:underline"
              >
                hello@playlight.app
              </a>{" "}
              from the email address associated with your Play Light account.
            </li>
            <li>
              Use the subject line{" "}
              <span className="text-foreground">“Play Light data deletion request”</span>.
            </li>
            <li>
              State clearly which data you want deleted (for example: all tasks and goals, specific
              content, or all user-generated content) and that you want to keep your account.
            </li>
            <li>
              We will verify your identity, confirm what will be deleted, and complete the request
              within 30 days.
            </li>
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            3. What data is deleted
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            When you delete your account, or when you request deletion of the corresponding data,
            we remove the following from our active systems:
          </p>
          <ul className="mt-4 ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Account information:</span> email
              address, display name, age eligibility confirmation, and authentication credentials.
            </li>
            <li>
              <span className="font-medium text-foreground">User-generated content:</span> tasks,
              project goals, notes, reflections, and other content you created in Play Light.
            </li>
            <li>
              <span className="font-medium text-foreground">App preferences</span> stored for your
              account.
            </li>
          </ul>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            For a data-only request (account kept), we delete the categories you specify. Minimum
            account fields required to keep the account working (such as email and login
            credentials) are retained unless you also request full account deletion.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            4. What data may be kept, and for how long
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <ul className="mt-6 ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Active database:</span> Account and
              content data are permanently removed from our active database within{" "}
              <span className="text-foreground">30 days</span> of a verified deletion request.
            </li>
            <li>
              <span className="font-medium text-foreground">Encrypted backups:</span> May persist
              for up to <span className="text-foreground">30 additional days</span> after account
              deletion, then are permanently erased.
            </li>
            <li>
              <span className="font-medium text-foreground">Crash reports and technical logs:</span>{" "}
              Do not include your personal content. Retained for a maximum of{" "}
              <span className="text-foreground">90 days</span>, then automatically purged.
            </li>
            <li>
              <span className="font-medium text-foreground">Legal holds:</span> We may retain
              specific data longer where required by applicable law or a valid legal order.
            </li>
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            5. Related information
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            Full details about what Play Light collects and how Light Technologies handles it are
            in our{" "}
            <Link to="/privacy" className="text-accent underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            . For other help, visit{" "}
            <Link to="/support" className="text-accent underline-offset-4 hover:underline">
              Support
            </Link>
            .
          </p>
        </section>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Response time: within 2 business days · Deletion: within 30 days
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
