import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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

function DeleteRequestForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"account" | "data">("account");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const subject =
      mode === "account"
        ? "Play Light account deletion request"
        : "Play Light data deletion request";

    const body = [
      `Request type: ${mode === "account" ? "Delete account and associated data" : "Delete data only (keep account)"}`,
      `Account email: ${trimmedEmail}`,
      reason.trim() ? `Reason: ${reason.trim()}` : "Reason: (not provided)",
      "",
      "Please process this Play Light deletion request from Light Technologies.",
    ].join("\n");

    const mailto = `mailto:hello@playlight.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <fieldset className="space-y-3">
        <legend className="sr-only">Request type</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
          <input
            type="radio"
            name="mode"
            value="account"
            checked={mode === "account"}
            onChange={() => setMode("account")}
            className="accent-[var(--accent)]"
          />
          Delete my account and all associated data
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
          <input
            type="radio"
            name="mode"
            value="data"
            checked={mode === "data"}
            onChange={() => setMode("data")}
            className="accent-[var(--accent)]"
          />
          Delete some or all of my data, but keep my account
        </label>
      </fieldset>

      <div>
        <label htmlFor="account-email" className="block text-sm text-muted-foreground">
          Account email
        </label>
        <input
          id="account-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-accent placeholder:text-muted-foreground/50 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm text-muted-foreground">
          Reason (optional — helps us improve)
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-accent placeholder:text-muted-foreground/50 focus:ring-2"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        Request deletion
      </button>

      {submitted ? (
        <p className="text-sm text-muted-foreground">
          Your email app should open with the request filled in. Send it to complete the request.
          If nothing opens, email{" "}
          <a
            href="mailto:hello@playlight.app"
            className="text-accent underline-offset-4 hover:underline"
          >
            hello@playlight.app
          </a>{" "}
          directly.
        </p>
      ) : null}
    </form>
  );
}

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

      <main className="mx-auto w-full max-w-xl px-6 py-12 md:px-10 md:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Light Technologies · Play Light
        </p>
        <h1 className="mt-4 text-4xl font-light tracking-tight text-foreground md:text-5xl">
          Delete your Play Light account
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Submitting this form starts a request to permanently delete your Play Light account and
          associated data (or selected data only). This cannot be undone once processed.
        </p>

        <DeleteRequestForm />

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          We delete your account record, user-generated content (tasks, goals, notes), preferences,
          and identifiers from our active systems. Crash logs without your personal content may be
          retained up to 90 days; encrypted backups up to 30 days after deletion. Aggregated,
          de-identified data may be retained. See our{" "}
          <Link to="/privacy" className="text-accent underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </p>

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Other ways to request deletion
          </h2>
          <div className="mt-3 h-px w-full bg-border" />

          <section className="mt-10">
            <h3 className="text-lg font-medium text-foreground">In the Play Light app</h3>
            <ol className="mt-3 ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-muted-foreground">
              <li>Open Play Light and sign in.</li>
              <li>
                Go to <span className="text-foreground">Settings → Account → Delete Account</span>.
              </li>
              <li>Confirm the deletion when prompted.</li>
            </ol>
          </section>

          <section className="mt-10">
            <h3 className="text-lg font-medium text-foreground">
              Delete data without deleting your account
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Choose “Delete some or all of my data, but keep my account” in the form above, or
              email{" "}
              <a
                href="mailto:hello@playlight.app?subject=Play%20Light%20data%20deletion%20request"
                className="text-accent underline-offset-4 hover:underline"
              >
                hello@playlight.app
              </a>{" "}
              and specify what to remove. We process verifiable requests within 30 days.
            </p>
          </section>

          <section className="mt-10">
            <h3 className="text-lg font-medium text-foreground">What is deleted vs kept</h3>
            <ul className="mt-3 ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Deleted:</span> email, display name,
                credentials, tasks, goals, notes, and account preferences (for full account
                deletion).
              </li>
              <li>
                <span className="font-medium text-foreground">May be kept briefly:</span> encrypted
                backups (up to 30 days after deletion), crash/technical logs without personal
                content (up to 90 days), or data required by law.
              </li>
            </ul>
          </section>

          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Response: within 2 business days · Deletion: within 30 days
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
