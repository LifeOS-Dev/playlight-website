import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPage } from "@/components/landing/v3/DocPage";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({
      path: "/terms",
      title: "Playlight - Terms of Use",
      description: "Terms governing use of the Playlight application and website.",
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <DocPage
      eyebrow="Light Technologies · Pakistan"
      title="Terms of Use"
      lead={
        <p>
          These Terms govern your use of the Playlight mobile application, website, and related
          services. They take effect on September 5, 2026.
        </p>
      }
    >
      <section>
        <h2>1. Who operates Playlight</h2>
        <p>
          Playlight is operated under the name Light Technologies from Islamabad, Pakistan. In these
          Terms, “Playlight,” “we,” “us,” and “our” refer to that operator, and “Service” refers to
          the Playlight app, website, and related services.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and accounts</h2>
        <p>
          You must be at least 13 years old to use Playlight, or at least 16 if you live in the
          European Economic Area. You must provide accurate account information, keep your
          credentials secure, and promptly tell us if you believe your account has been compromised.
          You are responsible for activity performed through your account unless caused by our
          failure to protect the Service.
        </p>
      </section>

      <section>
        <h2>3. The Service</h2>
        <p>
          Playlight is currently provided free of charge. It helps you manually organise information
          across areas of life and may use AI to suggest possible patterns or next steps. Features
          may change as the Service develops. We will give reasonable notice before a material
          change that adversely affects your rights or access where practical.
        </p>
        <p>
          If we introduce paid features later, we will show the price, billing period, renewal and
          cancellation terms before purchase and update these Terms where necessary.
        </p>
      </section>

      <section>
        <h2>4. Your content</h2>
        <p>
          You keep ownership of information and content you enter into Playlight. You give us a
          limited, non-exclusive licence to host, process, reproduce, and transmit that content only
          as needed to operate, secure, and improve the features you choose to use. This licence
          ends when the content is deleted, except for temporary backup copies and records we must
          retain for security or legal reasons.
        </p>
        <p>
          Do not upload content you do not have the right to use, content that violates another
          person's rights, malicious code, or unlawful or abusive material. Do not use Playlight to
          probe, disrupt, overload, reverse engineer, or gain unauthorised access to the Service.
        </p>
      </section>

      <section>
        <h2>5. AI suggestions and important limitations</h2>
        <p>
          Playlight's AI features provide suggestions, not instructions. Their output can be
          incomplete, inaccurate, or unsuitable for your circumstances. You remain responsible for
          reviewing output and deciding whether to act on it.
        </p>
        <p>
          Playlight does not provide medical, mental-health, legal, tax, investment, or other
          professional advice. Do not rely on it for emergencies, diagnosis, treatment, legal
          rights, financial transactions, or other high-impact decisions. Consult a qualified
          professional when advice is needed. In an emergency, contact the appropriate local
          emergency service.
        </p>
      </section>

      <section>
        <h2>6. Privacy</h2>
        <p>
          Our <Link to="/privacy">Privacy Policy</Link> explains what information we process and how
          we protect it. We never sell personal data and do not use it for third-party advertising.
          Optional AI features send relevant content to OpenAI or DeepSeek only after the disclosure
          and permission described in the Privacy Policy.
        </p>
      </section>

      <section>
        <h2>7. Account deletion</h2>
        <p>
          You can initiate deletion in the app at Settings → Account → Delete Account. You may also
          use our <Link to="/delete">website request page</Link>. After verification, user-owned
          account data is deleted or anonymised within 30 days. Encrypted backups may remain for up
          to 30 additional days, and narrowly limited security or legal records may be retained when
          necessary. We send a completion email when processing finishes.
        </p>
      </section>

      <section>
        <h2>8. Availability, suspension, and termination</h2>
        <p>
          We work to keep Playlight available and secure, but we do not promise uninterrupted or
          error-free operation. We may suspend access needed to protect users, investigate abuse,
          comply with law, or maintain the Service. We may terminate accounts for a material breach
          of these Terms after reasonable notice when circumstances allow.
        </p>
      </section>

      <section>
        <h2>9. Intellectual property</h2>
        <p>
          Playlight's software, design, brand, and other materials—excluding your content—belong to
          Light Technologies or its licensors and are protected by applicable intellectual-property
          laws. These Terms grant only the limited right to use the Service as provided.
        </p>
      </section>

      <section>
        <h2>10. Disclaimers and responsibility</h2>
        <p>
          To the extent permitted by law, the Service is provided on an “as available” basis. We are
          not responsible for losses caused by your reliance on AI output, information you choose to
          enter, third-party services outside our control, or events we could not reasonably
          prevent. Nothing in these Terms excludes rights or liability that applicable law does not
          allow us to exclude.
        </p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>
          These Terms are governed by the laws of Pakistan, without overriding mandatory consumer
          protections that apply where you live. Courts with jurisdiction in Islamabad, Pakistan
          will handle disputes that cannot be resolved informally, unless applicable consumer law
          requires another forum.
        </p>
      </section>

      <section>
        <h2>12. Changes and contact</h2>
        <p>
          We may update these Terms as Playlight evolves. We will publish the revised version and
          update its effective date, and provide an in-app notice before material changes take
          effect where appropriate. Questions can be sent to hello@playlight.app or +92 336 519
          2688.
        </p>
        <p>
          Light Technologies
          <br />
          Ardium, Hub Commercial Plaza #97, Phase 8, Bahria Town
          <br />
          Islamabad, Pakistan
        </p>
      </section>

      <p className="pl3-doc__note">Effective September 5, 2026 · Version 1.0</p>
    </DocPage>
  );
}
