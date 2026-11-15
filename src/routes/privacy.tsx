import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPage } from "@/components/landing/v3/DocPage";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
      path: "/privacy",
      title: "Playlight - Privacy Policy",
      description:
        "Privacy Policy for Playlight by Light Technologies - what we collect, how we use it, and your rights.",
    }),
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
    <section>
      <h2>
        {number}. {title}
      </h2>
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
    <DocPage
      eyebrow="Light Technologies"
      title="Privacy Policy"
      lead={
        <p>
          Application: Playlight
          <br />
          Version: App Store submission edition
        </p>
      }
    >
      <div className="mt-2 rounded-lg border border-border bg-foreground/[0.02] p-6 text-sm text-muted-foreground">
        <div className="grid gap-2 md:grid-cols-2">
          <p>
            <span className="font-medium text-foreground">Effective Date:</span> September 5, 2026
          </p>
          <p>
            <span className="font-medium text-foreground">Last Updated:</span> September 5, 2026
          </p>
        </div>
        <p className="mt-3">
          <span className="font-medium text-foreground">Operator:</span> Light Technologies
        </p>
        <p className="mt-1">
          <span className="font-medium text-foreground">Contact:</span> hello@playlight.app
        </p>
      </div>

      <section>
        <h2>Plain English Summary</h2>
        <Callout>
          Your data is private. We never sell personal data, rent it, give it to data brokers, or
          use it for third-party advertising. Playlight stores only the account, device, security,
          and manually entered life-management information needed to provide the Service. Optional
          AI suggestions use OpenAI or DeepSeek only after you choose to use the feature and give
          permission for the described data transfer. The detailed sections below explain every
          category, provider, purpose, retention period, and deletion choice.
        </Callout>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          The sections below provide the complete detail behind that summary. If anything is
          unclear, contact us at hello@playlight.app and we will explain it in plain terms.
        </p>
      </section>

      <Section number="1" title="Who We Are">
        <p>
          Playlight is a life-management and productivity application operated under the name Light
          Technologies from Islamabad, Pakistan. This Privacy Policy applies to the Playlight mobile
          application and associated website (together, the “Service”).
        </p>
        <p>
          By creating an account and using the Service, you confirm that you have read and
          understood this policy. If you do not agree, please discontinue use immediately.
        </p>
      </Section>

      <Section number="2" title="What Information We Collect and Why">
        <p>
          We collect information needed to operate Playlight, secure accounts, deliver notifications
          and email, provide optional AI features, and improve the Service. We do not collect data
          for third-party advertising.
        </p>

        <h3 className="mt-6 text-lg font-medium text-foreground">2.1 Account and Profile Data</h3>
        <p>Collected when you register or update your profile:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Email address</span> - account identity,
            login, and essential service messages.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Full name, username, and phone number
            </span>{" "}
            - profile and account personalisation (where you provide them).
          </li>
          <li>
            <span className="font-medium text-foreground">Date of birth</span> - age eligibility and
            account records.
          </li>
          <li>
            <span className="font-medium text-foreground">Password and security flags</span> -
            password is stored as a secure hash; we also store verification timestamps, MFA status,
            password-change time, login counters, lockout state, and account status.
          </li>
          <li>
            <span className="font-medium text-foreground">Sign-in provider records</span> - if you
            use Google or Sign in with Apple, we store the provider identity, provider user ID,
            email/claims needed to link the account, and related linking metadata. Email and
            password authentication is also available.
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.2 Authentication and Security Data
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            Pending registration records (email, display name, password hash, OTP hashes,
            attempt/resend counts, registration device ID, platform, app version, and push token).
          </li>
          <li>
            Refresh sessions (hashed tokens, issue/expiry/revocation data, IP address, and
            user-agent).
          </li>
          <li>
            Password-reset tokens (token hash, expiry/use timestamps, requested IP, and user-agent).
          </li>
          <li>
            Login history and security events (email and optional user ID, IP address, user-agent,
            success/failure, event type/reason, and optional approximate location such as country,
            region, city, or coordinates when geo-IP enrichment is enabled).
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.3 Device and Notification Data
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>Device ID, platform (iOS, Android, or web), and app version.</li>
          <li>Expo push token and notification-enabled state.</li>
          <li>Last-seen and device-revocation timestamps.</li>
        </ul>
        <p>
          We use this data to deliver push notifications, keep sessions secure, and revoke lost or
          unused devices.
        </p>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.4 User-Created Life-Management Data
        </h3>
        <p>Content you voluntarily create in the app, which may include:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Tasks, schedules, priorities, completion times, and task events.</li>
          <li>Work projects, statuses, subtasks, and work-activity metadata.</li>
          <li>Habits and habit-entry history.</li>
          <li>
            Wealth folders and transactions (amount, currency, merchant/source, payment method,
            references, notes, and dates).
          </li>
          <li>Time allocations, departments, planned hours, and notes.</li>
          <li>Arcs, yearly goals, status, and priority.</li>
          <li>Notes, titles, content, types, and source metadata.</li>
          <li>Problems, impacts, severity, and resolution dates.</li>
        </ul>
        <Callout>
          Depending on what you enter, this content can reveal health, mental-health, financial,
          employment, relationship, identity, or other sensitive information. Do not enter
          information you are not comfortable storing in Playlight or that the Service cannot safely
          support.
        </Callout>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.5 AI Conversations, Memories, Insights, and Derived Data
        </h3>
        <p>If you use AI features, we may store and process:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Chat sessions, titles, messages (user and assistant), status, and timestamps.</li>
          <li>
            Agent routing outputs, evidence, draft actions, metadata, errors, provider/model, and
            usage metadata.
          </li>
          <li>Rolling chat summaries and agent memories (value, category, confidence, expiry).</li>
          <li>Draft-action payloads, reasons, results, and confirmation preferences.</li>
          <li>Generated insight reports and your feedback on them.</li>
          <li>
            Content chunks and embeddings derived from your content for retrieval (when embedding is
            enabled).
          </li>
          <li>
            AI usage logs (provider, model, feature, status, token counts, estimated cost, and
            errors).
          </li>
        </ul>
        <p>
          AI context builders may use your profile, tasks, notes, habits, arcs, time allocations,
          wealth data, prior insights, memories, and chat context to generate responses.
        </p>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.6 Product Operation and Diagnostics
        </h3>
        <p>
          The current app does not use third-party analytics or crash-reporting SDKs. Our servers
          process limited first-party operational information—such as request time, route, status,
          app version, and error details—to deliver, secure, and troubleshoot the Service. We do not
          use this information for advertising or cross-app tracking.
        </p>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.7 Support and Communications Data
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>Messages you send to hello@playlight.app (support, feedback, deletion requests).</li>
          <li>
            If you join the website waitlist, your email address, submission source, time, and
            limited request/security log information. We use it only to send the promised launch
            notice and operate the form. We delete the waitlist record within 30 days after that
            notice is sent, or earlier if you ask us to.
          </li>
          <li>
            Transactional emails we send (OTP verification, welcome, password reset) and related
            delivery metadata.
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-medium text-foreground">
          2.8 Technical, Log, and Optional Geo-Location Data
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            Request logs (method, URL, status, duration, request ID) and operational error logs.
          </li>
          <li>
            Approximate location derived from IP address through geo-IP enrichment (country, region,
            city, and approximate coordinates). We do not request GPS-level precise location for
            this purpose.
          </li>
        </ul>
      </Section>

      <Section number="3" title="How We Use Your Information">
        <p>We use personal data for the following purposes:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Provide the Service:</span> create and
            maintain your account; store and display life-management content. Legal basis (GDPR):
            performance of a contract (Art. 6(1)(b)).
          </li>
          <li>
            <span className="font-medium text-foreground">Authenticate and secure accounts:</span>{" "}
            login, session management, MFA, lockout protection, abuse prevention, and security event
            review. Legal basis: contract and legitimate interests (Art. 6(1)(b) and (f)).
          </li>
          <li>
            <span className="font-medium text-foreground">Email delivery:</span> OTP, welcome, and
            password-reset messages. Legal basis: contract (Art. 6(1)(b)).
          </li>
          <li>
            <span className="font-medium text-foreground">Push notifications:</span> deliver alerts
            you enable and manage device tokens. Legal basis: contract and, where required, consent
            (Art. 6(1)(b) or (a)).
          </li>
          <li>
            <span className="font-medium text-foreground">AI suggestions and insights:</span> when
            you choose an AI feature and give permission, process the message and selected account
            context with OpenAI or DeepSeek to return suggestions, draft actions, memories, and
            insights. Legal basis: consent and performance of the Service you requested (Art.
            6(1)(a) and (b)).
          </li>
          <li>
            <span className="font-medium text-foreground">Embeddings and retrieval:</span> create
            and store content chunks/embeddings to improve AI retrieval when that feature is
            enabled. Legal basis: contract / legitimate interests (Art. 6(1)(b) or (f)).
          </li>
          <li>
            <span className="font-medium text-foreground">Operational reliability:</span> maintain
            security, diagnose errors, and keep the Service working without third-party analytics or
            advertising SDKs. Legal basis: contract and legitimate interests (Art. 6(1)(b) and (f)).
          </li>
          <li>
            <span className="font-medium text-foreground">Support and service improvement:</span>{" "}
            respond to requests and diagnose issues. Legal basis: legitimate interests (Art.
            6(1)(f)).
          </li>
          <li>
            <span className="font-medium text-foreground">Legal compliance:</span> respond to lawful
            requests and enforce our terms. Legal basis: legal obligation and legitimate interests
            (Art. 6(1)(c) and (f)).
          </li>
        </ul>
      </Section>

      <Section number="4" title="Who We Share Your Information With">
        <p>
          We do not sell your personal data. We do not share it with advertisers or data brokers for
          commercial advertising. We use service providers (processors) to operate Playlight. The
          production Service uses the following providers:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">
              Database infrastructure (Supabase on AWS):
            </span>{" "}
            stores account and product data. See supabase.com/privacy.
          </li>
          <li>
            <span className="font-medium text-foreground">Vercel:</span> website hosting and related
            request delivery and security logs.
          </li>
          <li>
            <span className="font-medium text-foreground">Resend:</span> transactional and waitlist
            email delivery (address, message content, and delivery metadata).
          </li>
          <li>
            <span className="font-medium text-foreground">Google and Apple:</span> identity-provider
            sign-in; provider ID, email/claims for account linking.
          </li>
          <li>
            <span className="font-medium text-foreground">Expo / push infrastructure:</span> device
            and push-token delivery metadata for notifications.
          </li>
          <li>
            <span className="font-medium text-foreground">OpenAI and DeepSeek:</span> receive the
            prompt and selected context required for an AI feature after your permission, and return
            model output. OpenAI may also process text used to create retrieval embeddings.
          </li>
          <li>
            <span className="font-medium text-foreground">ipgeolocation.io:</span> IP address for
            approximate location enrichment used for account security.
          </li>
          <li>
            <span className="font-medium text-foreground">Google Fonts:</span> serves website font
            files and receives ordinary web-request information such as IP address and user-agent.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, court order, or a valid governmental
          request, or where we believe in good faith that disclosure is necessary to protect our
          rights or the safety of our users.
        </p>
        <p>
          We require every provider that processes personal data for us to protect it to the same or
          an equivalent standard promised in this Policy and required by applicable law and Apple's
          App Review Guidelines. Providers may process data only to deliver their contracted
          service, unless law requires otherwise.
        </p>
      </Section>

      <Section number="5" title="International Data Transfers">
        <p>
          Light Technologies operates internationally. Your data may be processed by vendors whose
          infrastructure is located in the United States or other countries outside your own. Those
          countries may have data protection laws that differ from those in your jurisdiction.
        </p>
        <p>
          Where required by applicable law - including the GDPR for users in the European Economic
          Area - we rely on appropriate safeguards such as data processing agreements and, where
          applicable, Standard Contractual Clauses (SCCs) approved by the European Commission.
        </p>
      </Section>

      <Section number="6" title="Data Security and Retention">
        <h3 className="mt-2 text-lg font-medium text-foreground">6.1 How We Protect Your Data</h3>
        <p>We implement the following security measures to protect your information:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            All data transmitted between your device and our servers is encrypted using TLS/HTTPS.
          </li>
          <li>
            Passwords and sensitive tokens are stored in securely hashed formats using
            industry-standard algorithms. Plain-text passwords are never stored or accessible.
          </li>
          <li>
            Database and admin access is restricted to authorised personnel using role-based access
            controls.
          </li>
        </ul>
        <p>
          No method of electronic transmission or storage is 100% secure. While we take reasonable
          precautions, we cannot guarantee absolute security against all threats.
        </p>

        <h3 className="mt-6 text-lg font-medium text-foreground">6.2 How Long We Keep Your Data</h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Account and profile data:</span> retained
            while your account is active. After a verified deletion request, active devices and
            sessions are revoked and user-owned account records are permanently deleted or
            anonymised within 30 days.
          </li>
          <li>
            <span className="font-medium text-foreground">Product content:</span> retained while
            your account is active, then deleted or anonymised within 30 days of a verified
            account-deletion request.
          </li>
          <li>
            <span className="font-medium text-foreground">
              AI chats, summaries, memories, insights, embeddings, and AI usage logs:
            </span>{" "}
            retained while needed to provide the AI features you use, then deleted or anonymised
            with other user-owned records within 30 days of a verified account-deletion request.
          </li>
          <li>
            <span className="font-medium text-foreground">Consent records:</span> retained while
            needed to record and respect your choices and for a limited audit period after
            withdrawal or account deletion where required by law.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Login / security events and geo-IP data:
            </span>{" "}
            ordinarily retained for up to 90 days. A narrowly limited record may be retained longer
            when reasonably necessary for an active security investigation, fraud prevention, or a
            legal obligation.
          </li>
          <li>
            <span className="font-medium text-foreground">Devices and refresh sessions:</span>{" "}
            devices remain until revoked or deleted; refresh sessions are cleaned up according to
            configured retention (default about 30 days for expired, revoked, or consumed sessions).
          </li>
          <li>
            <span className="font-medium text-foreground">
              Password-reset and pending registration records:
            </span>{" "}
            short-lived; password-reset tokens are cleaned up according to configured retention
            (default about 7 days).
          </li>
          <li>
            <span className="font-medium text-foreground">Technical / operational logs:</span>{" "}
            retained for a limited operational period (typically up to 90 days unless a longer
            period is required for security investigation).
          </li>
          <li>
            <span className="font-medium text-foreground">Backups and vendor-held copies:</span>{" "}
            encrypted backups and processor copies may persist for up to 30 additional days after
            the account-data purge before automatic expiry. They are isolated from ordinary use and
            are not restored except for disaster recovery or security purposes.
          </li>
          <li>
            <span className="font-medium text-foreground">Legal holds:</span> we may retain specific
            data longer where required by applicable law or a valid legal order.
          </li>
        </ul>
      </Section>

      <Section number="7" title="Your Rights and Choices">
        <p>
          Your personal data remains yours. Depending on your location, you have the following
          rights. We respond to verifiable requests within 30 days.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Access:</span> Request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <span className="font-medium text-foreground">Correction:</span> Request that we correct
            any inaccurate or incomplete information.
          </li>
          <li>
            <span className="font-medium text-foreground">Deletion:</span> Request deletion of your
            account and associated data by emailing hello@playlight.app or using our{" "}
            <Link to="/delete" className="text-accent underline-offset-4 hover:underline">
              Delete Account or Data
            </Link>{" "}
            page. The fastest route is Settings → Account → Delete Account in the app. We
            acknowledge website requests within about 2 business days, verify account ownership,
            revoke active sessions, and permanently delete or anonymise user-owned records within 30
            days. We email you when processing is complete. Security, audit, backup, and legally
            required records may be retained only as described in Section 6.2.
          </li>
          <li>
            <span className="font-medium text-foreground">Data Portability:</span> Request a
            structured, machine-readable copy of the data you have provided to us.
          </li>
          <li>
            <span className="font-medium text-foreground">Restriction:</span> Request that we limit
            processing of your data under certain circumstances.
          </li>
          <li>
            <span className="font-medium text-foreground">Objection:</span> Object to processing
            based on our legitimate interests.
          </li>
          <li>
            <span className="font-medium text-foreground">Withdraw Consent:</span> Where processing
            is based on your consent (for example AI processing or notification choices), withdraw
            it at any time without affecting the lawfulness of prior processing. Use the relevant
            in-app setting or contact hello@playlight.app. Declining AI permission prevents the
            related content from being sent to an AI provider.
          </li>
          <li>
            <span className="font-medium text-foreground">Lodge a Complaint:</span> If you are in
            the EEA or UK, you have the right to lodge a complaint with your local Data Protection
            Authority. We encourage you to contact us first so we can resolve your concern directly.
          </li>
        </ul>
        <p>To exercise any of these rights, contact us at hello@playlight.app.</p>
      </Section>

      <Section number="8" title="Cookies, Local Storage, and Tracking">
        <p>
          Playlight does not use third-party advertising cookies or ad identifiers to track you
          across other apps or websites. The Service uses local storage needed to keep you signed in
          and remember preferences.
        </p>
        <p>
          The current app does not include third-party advertising, analytics, or crash-reporting
          SDKs. Limited first-party operational logs described in Section 2.6 are used only to
          deliver, secure, and troubleshoot Playlight—not to track you across apps or websites.
        </p>
      </Section>

      <Section number="9" title="Children’s Privacy">
        <p>
          Playlight is not intended for anyone under the age of 13, or under 16 in the European
          Economic Area. We collect date of birth / age-eligibility information at registration to
          help enforce this rule. Users who do not meet eligibility requirements should not create
          an account.
        </p>
        <p>
          We do not knowingly collect personal data from children below these thresholds. If we
          discover that such data has been inadvertently collected, we will delete it. If you
          believe a child has registered, please contact us at hello@playlight.app.
        </p>
      </Section>

      <Section number="10" title="Advertising and AI Processing">
        <p>
          <span className="font-medium text-foreground">Advertising:</span> The app contains no
          advertisements and does not use third-party advertising SDKs or ad networks. We do not
          collect or share data for third-party advertising or marketing profiling.
        </p>
        <p>
          <span className="font-medium text-foreground">AI processing:</span> Playlight includes
          optional AI chat, memory, draft-action, insight, and retrieval features. Before the first
          transfer, the app explains what will be sent and asks for your explicit permission. When
          you choose a feature, the relevant message and selected account content are sent to OpenAI
          or DeepSeek to produce a suggestion. Providers may process data outside your country. We
          never sell AI conversation content or use it for advertising.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            AI features are optional. Playlight does not send manually entered content to OpenAI or
            DeepSeek unless you have permitted AI processing and invoked or enabled the related AI
            feature. You can withdraw that permission through the relevant app setting.
          </li>
          <li>
            Generated insights, memories, embeddings, and usage logs are stored as described in
            Section 2.5 and retained under Section 6.2.
          </li>
          <li>
            We configure OpenAI and DeepSeek as service processors and instruct them to process
            submitted data only to provide the requested feature. Their handling is also governed by
            the contractual and privacy terms applicable to the production service.
          </li>
        </ul>
        <Callout>
          Material changes to AI providers, data collection, or deletion behaviour will be reflected
          in an updated Privacy Policy and, where appropriate, an in-app notice before they take
          effect.
        </Callout>
      </Section>

      <Section number="11" title="Changes to This Policy">
        <p>
          We may update this Privacy Policy as the Service evolves. When we make material changes,
          we will:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Update the “Last Updated” date at the top of this document.</li>
          <li>
            Publish the revised policy at our designated public URL before the changes take effect.
          </li>
          <li>
            Send an in-app notification for any change that affects your rights or introduces new
            data practices.
          </li>
        </ul>
        <p>
          Your continued use of the Service after notification constitutes acceptance of the updated
          policy. If you do not agree, you may request account deletion and discontinue use.
        </p>
      </Section>

      <Section number="12" title="Contact Us">
        <p>
          For any questions about this policy, to exercise your data rights, or to request account
          deletion, please contact us:
        </p>
        <div className="rounded-lg border border-border bg-foreground/[0.02] p-5">
          <p>
            <span className="font-medium text-foreground">Operator:</span> Light Technologies
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Application:</span> Playlight
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Email:</span> hello@playlight.app
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Telephone:</span>{" "}
            <a href="tel:+923365192688">+92 336 519 2688</a>
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Address:</span> Ardium, Hub Commercial
            Plaza #97, Phase 8, Bahria Town, Islamabad, Pakistan
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Deletion requests:</span>{" "}
            <Link to="/delete" className="text-accent underline-offset-4 hover:underline">
              playlight.app/delete
            </Link>
          </p>
        </div>
      </Section>

      <div className="pl3-doc__note text-center">
        Playlight © 2026 Light Technologies. All rights reserved.
        <br />
        <span className="italic normal-case tracking-normal">
          App Store submission edition - Version 2.0 - Last updated September 5, 2026
        </span>
      </div>
    </DocPage>
  );
}
