import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPage } from "@/components/landing/v3/DocPage";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/delete")({
  head: () => ({
    meta: pageMeta({
      path: "/delete",
      title: "Playlight — Delete Account or Data",
      description:
        "Request deletion of your Playlight account or associated data. Steps for Light Technologies users.",
    }),
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
        ? "Playlight account deletion request"
        : "Playlight data deletion request";

    const body = [
      `Request type: ${mode === "account" ? "Delete account and associated data" : "Delete data only (keep account)"}`,
      `Account email: ${trimmedEmail}`,
      reason.trim() ? `Reason: ${reason.trim()}` : "Reason: (not provided)",
      "",
      "Please process this Playlight deletion request from Light Technologies.",
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
          Your email app should open with the request filled in. Send it to complete the request. If
          nothing opens, email{" "}
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
    <DocPage
      eyebrow="Light Technologies · Playlight"
      title="Delete your Playlight account"
      lead={
        <p>
          Submitting this form emails a deletion request to Light Technologies. We acknowledge
          verifiable requests within about 2 business days. Deletion currently begins as an account
          soft-delete (account marked deleted; devices revoked), then we purge or anonymise
          user-owned records under our deletion workflow. This cannot be undone once processed.
        </p>
      }
    >
      <DeleteRequestForm />

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          After processing, we remove or anonymise account profile data and user-owned product
          content (tasks, projects, habits, notes, wealth records, AI chats/memories/insights where
          applicable, and related preferences). Security events, audit records, backups, and data
          required by law may be retained as described in our{" "}
          <Link to="/privacy" className="text-accent underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </p>

        <div>
          <h2>How to request deletion</h2>

          <section className="mt-10">
            <h3 className="text-lg font-medium text-foreground">By email</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Use the form above, or email{" "}
              <a
                href="mailto:hello@playlight.app?subject=Play%20Light%20account%20deletion%20request"
                className="text-accent underline-offset-4 hover:underline"
              >
                hello@playlight.app
              </a>{" "}
              from your account email with the subject “Playlight account deletion request” and
              your account email address.
            </p>
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
                <span className="font-medium text-foreground">Deleted or anonymised:</span> profile
                fields, credentials, life-management content, AI user-owned records, devices, and
                preferences (for full account deletion), subject to purge completion.
              </li>
              <li>
                <span className="font-medium text-foreground">May be kept:</span> security/audit
                events needed for abuse prevention, encrypted backups for a limited period,
                operational logs, aggregated de-identified data, or data required by law.
              </li>
            </ul>
          </section>

          <p className="pl3-doc__note">
            Response: within 2 business days · Purge: per deletion workflow (see Privacy Policy)
          </p>
        </div>
    </DocPage>
  );
}
