import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "PlayLight — Privacy Policy" },
      {
        name: "description",
        content:
          "Privacy Policy for Play Light by Light Technologies — what we collect, how we use it, and your rights.",
      },
      { property: "og:title", content: "PlayLight — Privacy Policy" },
      {
        property: "og:description",
        content: "How Play Light handles your data — written in plain English.",
      },
    ],
  }),
  component: PrivacyPage,
});

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
        {number}. {title}
      </h2>
      <div className="mt-3 h-px w-full bg-border" />
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-6 border-l-2 border-accent bg-foreground/[0.02] px-5 py-4 text-[14px] italic leading-relaxed text-muted-foreground">
      {children}
    </blockquote>
  );
}

function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Application: Play Light
          <br />
          Version: Phase 1 — MVP Release
        </p>

        <div className="mt-10 rounded-lg border border-border bg-foreground/[0.02] p-6 text-sm text-muted-foreground">
          <div className="grid gap-2 md:grid-cols-2">
            <p>
              <span className="font-medium text-foreground">Effective Date:</span> May 21, 2026
            </p>
            <p>
              <span className="font-medium text-foreground">Last Updated:</span> May 21, 2026
            </p>
          </div>
          <p className="mt-3">
            <span className="font-medium text-foreground">Entity:</span> Light Technologies
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Contact:</span> hello@playlight.app
          </p>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Plain English Summary
          </h2>
          <div className="mt-3 h-px w-full bg-border" />
          <Callout>
            We built Play Light to help you manage your life — not to monitor it. Here is the
            short version of this policy: We store what you put in. We share it only with the
            company that hosts our database. We do not sell it, analyse it for ads, or share it
            with anyone else. You can delete everything at any time.
          </Callout>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            The sections below provide the complete legal detail behind that summary. If anything
            is unclear, contact us at hello@playlight.app and we will explain it in plain terms.
          </p>
        </section>

        <Section number="1" title="Who We Are">
          <p>
            Play Light is a life management and productivity application developed and operated by
            Light Technologies. This Privacy Policy applies to the Play Light mobile application
            and any associated website (together, the “Service”).
          </p>
          <p>
            By creating an account and using the Service, you confirm that you have read and
            understood this policy. If you do not agree, please discontinue use immediately.
          </p>
        </Section>

        <Section number="2" title="What Information We Collect and Why">
          <p>
            We apply a strict principle of data minimisation: we collect only what is necessary to
            make the Service work for you. Nothing is collected for advertising or profiling
            purposes.
          </p>

          <h3 className="mt-6 text-lg font-medium text-foreground">2.1 Account Information</h3>
          <p>Collected when you register an account:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Email Address:</span> Used to identify
              your account, enable login, and send essential service notifications. We do not use
              your email for marketing without your explicit consent.
            </li>
            <li>
              <span className="font-medium text-foreground">Display Name:</span> The name you
              choose to appear in the app. Used solely to personalise your in-app experience.
            </li>
            <li>
              <span className="font-medium text-foreground">Age Verification:</span> We ask you to
              confirm you are 13 years of age or older. We record only a confirmation of
              eligibility — we do not store your date of birth or age as a number.
            </li>
            <li>
              <span className="font-medium text-foreground">Authentication Credentials:</span> Your
              password is stored in a securely hashed, unreadable format. We never have access to
              your plain-text password.
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-foreground">2.2 User-Generated Content</h3>
          <p>The content you voluntarily create inside the app:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Tasks: titles, descriptions, due dates, priority levels, and completion status.</li>
            <li>Project Goals: names, descriptions, milestones, and progress records.</li>
            <li>Any notes, reflections, or other content you choose to input.</li>
          </ul>
          <p>
            This content belongs entirely to you. We do not read it, analyse it, or use it for any
            purpose other than storing it securely and displaying it back to you. It is never
            shared with third parties for advertising or research.
          </p>

          <h3 className="mt-6 text-lg font-medium text-foreground">2.3 Technical and Device Data</h3>
          <p>Collected automatically to keep the app stable and reliable:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Device Type and Model:</span> Helps us
              understand which devices need optimisation.
            </li>
            <li>
              <span className="font-medium text-foreground">Operating System Version:</span> Used
              to diagnose compatibility issues.
            </li>
            <li>
              <span className="font-medium text-foreground">App Version:</span> Used to identify
              which version of the app generated a crash report.
            </li>
            <li>
              <span className="font-medium text-foreground">Crash Reports and Error Logs:</span>{" "}
              Automatically generated when the app encounters an error. Contains technical details
              only — not your personal content.
            </li>
          </ul>
          <Callout>
            Important: This technical data is used exclusively for debugging and performance
            improvements. It does not include your tasks, goals, or any content you have created.
            It is never used to profile your behaviour or target you with advertising.
          </Callout>
        </Section>

        <Section number="3" title="How We Use Your Information">
          <p>We use your data for three purposes and three purposes only:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">To Provide the Service:</span> Storing
              your tasks, goals, and account information so the app functions as intended. Without
              this we cannot operate. Legal basis (GDPR): Performance of a contract (Art. 6(1)(b)).
            </li>
            <li>
              <span className="font-medium text-foreground">To Secure Your Account:</span> Using
              your email and authentication credentials to verify your identity and protect your
              account from unauthorised access. Legal basis (GDPR): Performance of a contract and
              legitimate interests (Art. 6(1)(b) and (f)).
            </li>
            <li>
              <span className="font-medium text-foreground">To Maintain App Stability:</span> Using
              crash reports and device data to identify and fix technical errors. Legal basis
              (GDPR): Legitimate interests (Art. 6(1)(f)).
            </li>
          </ul>
        </Section>

        <Section number="4" title="Who We Share Your Information With">
          <p>
            We do not sell your data. We do not share it with advertisers, data brokers, or any
            third party for commercial purposes. The only company that receives your data is our
            database infrastructure provider, who acts strictly as our data processor:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Supabase:</span> We use Supabase to host
              our secure database, manage our backend infrastructure, and handle user
              authentication. Supabase processes your data only on our instructions and is
              contractually prohibited from using it for any other purpose. Data is stored on
              Supabase’s infrastructure, which is hosted on Amazon Web Services (AWS). For
              Supabase’s own privacy practices, see: supabase.com/privacy
            </li>
          </ul>
          <p>
            We may also disclose your information if required to do so by law, court order, or a
            valid request from a governmental authority, or where we believe in good faith that
            disclosure is necessary to protect our rights or the safety of our users.
          </p>
        </Section>

        <Section number="5" title="International Data Transfers">
          <p>
            Light Technologies operates internationally. Your data is stored on Supabase’s
            infrastructure, which may be located in the United States or other countries outside
            your own. These countries may have data protection laws that differ from those in your
            jurisdiction.
          </p>
          <p>
            Where required by applicable law — including the GDPR for users in the European
            Economic Area — we ensure that appropriate safeguards are in place. These include
            reliance on Supabase’s data processing agreement and, where applicable, Standard
            Contractual Clauses (SCCs) approved by the European Commission.
          </p>
        </Section>

        <Section number="6" title="Data Security and Retention">
          <h3 className="mt-2 text-lg font-medium text-foreground">6.1 How We Protect Your Data</h3>
          <p>We implement the following security measures to protect your information:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              All data transmitted between your device and our servers is encrypted using
              TLS/HTTPS.
            </li>
            <li>
              Passwords are stored in a securely hashed format using industry-standard algorithms.
              Plain-text passwords are never stored or accessible.
            </li>
            <li>
              Database access is restricted to authorised personnel only, using role-based access
              controls.
            </li>
          </ul>
          <p>
            No method of electronic transmission or storage is 100% secure. While we take
            reasonable precautions, we cannot guarantee absolute security against all threats.
          </p>

          <h3 className="mt-6 text-lg font-medium text-foreground">6.2 How Long We Keep Your Data</h3>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Account and Content Data:</span>{" "}
              Retained for as long as your account remains active. If you delete your account,
              your data is permanently removed from our active database within 30 days.
            </li>
            <li>
              <span className="font-medium text-foreground">Crash Reports and Technical Logs:</span>{" "}
              Retained for a maximum of 90 days, after which they are automatically purged.
            </li>
            <li>
              <span className="font-medium text-foreground">Backup Copies:</span> Encrypted backup
              copies may persist for up to 30 additional days after account deletion before
              permanent erasure.
            </li>
            <li>
              <span className="font-medium text-foreground">Legal Holds:</span> We may retain
              specific data for longer periods where required by applicable law or a valid legal
              order.
            </li>
          </ul>
        </Section>

        <Section number="7" title="Your Rights and Choices">
          <p>
            You own your data. Depending on your location, you have the following rights. We will
            respond to all verifiable requests within 30 days.
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Access:</span> Request a copy of the
              personal data we hold about you.
            </li>
            <li>
              <span className="font-medium text-foreground">Correction:</span> Request that we
              correct any inaccurate or incomplete information.
            </li>
            <li>
              <span className="font-medium text-foreground">Deletion:</span> Request permanent
              deletion of your account and all associated data. You can also do this directly
              inside the app under Settings → Account → Delete Account.
            </li>
            <li>
              <span className="font-medium text-foreground">Data Portability:</span> Request a
              structured, machine-readable copy of the data you have provided to us.
            </li>
            <li>
              <span className="font-medium text-foreground">Restriction:</span> Request that we
              limit processing of your data under certain circumstances.
            </li>
            <li>
              <span className="font-medium text-foreground">Objection:</span> Object to processing
              based on our legitimate interests.
            </li>
            <li>
              <span className="font-medium text-foreground">Withdraw Consent:</span> Where
              processing is based on your consent, withdraw it at any time without affecting the
              lawfulness of prior processing.
            </li>
            <li>
              <span className="font-medium text-foreground">Lodge a Complaint:</span> If you are
              in the EEA or UK, you have the right to lodge a complaint with your local Data
              Protection Authority. We encourage you to contact us first so we can resolve your
              concern directly.
            </li>
          </ul>
          <p>To exercise any of these rights, contact us at hello@playlight.app.</p>
        </Section>

        <Section number="8" title="Cookies and Tracking">
          <p>
            Play Light does not use cookies, advertising identifiers, or third-party tracking
            technologies to monitor your behaviour. The Service uses only the minimum local
            storage required to keep you signed in and to remember your in-app preferences. We do
            not track you across other apps or websites.
          </p>
        </Section>

        <Section number="9" title="Children’s Privacy">
          <p>
            Play Light is not intended for anyone under the age of 13, or under 16 in the
            European Economic Area. We enforce this through an age eligibility confirmation at
            account registration. Users who do not confirm eligibility cannot create an account.
          </p>
          <p>
            We do not knowingly collect personal data from children below these thresholds. If we
            discover that such data has been inadvertently collected, we will delete it
            immediately. If you believe a child has registered, please contact us at
            hello@playlight.app.
          </p>
        </Section>

        <Section number="10" title="No Advertising, No AI Processing (Phase 1)">
          <p>In the current version of Play Light, we confirm the following:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>The app contains no advertisements of any kind.</li>
            <li>We do not use any third-party advertising SDK or ad network.</li>
            <li>We do not collect or share data for advertising or marketing profiling purposes.</li>
            <li>
              We do not use any AI or machine learning processing on your personal data in this
              version.
            </li>
            <li>We do not use any third-party analytics service. No behavioural tracking occurs.</li>
          </ul>
          <Callout>
            Future versions of Play Light may introduce AI-powered personalisation features,
            subscription options, and analytics tools. Any such additions will be accompanied by a
            full update to this Privacy Policy and an in-app notification before they take effect.
            We will never activate new data practices silently.
          </Callout>
        </Section>

        <Section number="11" title="Changes to This Policy">
          <p>We may update this Privacy Policy as the Service evolves. When we make material changes, we will:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Update the “Last Updated” date at the top of this document.</li>
            <li>Publish the revised policy at our designated public URL before the changes take effect.</li>
            <li>Send an in-app notification for any change that affects your rights or introduces new data practices.</li>
          </ul>
          <p>
            Your continued use of the Service after notification constitutes acceptance of the
            updated policy. If you do not agree, you may delete your account and discontinue use.
          </p>
        </Section>

        <Section number="12" title="Contact Us">
          <p>
            For any questions about this policy, to exercise your data rights, or to request
            account deletion, please contact us:
          </p>
          <div className="rounded-lg border border-border bg-foreground/[0.02] p-5">
            <p>
              <span className="font-medium text-foreground">Entity:</span> Light Technologies
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Application:</span> Play Light
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">Email:</span> hello@playlight.app
            </p>
          </div>
        </Section>

        <div className="mt-20 border-t border-border pt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Play Light © 2026 Light Technologies. All rights reserved.
          <br />
          <span className="italic normal-case tracking-normal">
            Phase 1 (MVP) — Version 1.0 — Effective May 21, 2026
          </span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}