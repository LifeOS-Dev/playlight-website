import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { DocPage } from "@/components/landing/v3/DocPage";
import { pageMeta } from "@/seo";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: pageMeta({
      path: "/support",
      title: "Playlight - Support",
      description: "Need help with Playlight? Reach the team at hello@playlight.app.",
    }),
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <DocPage
      eyebrow="Light Technologies"
      title="Support"
      lead={
        <p>
          We read every message. Whether you have a question, found a bug, or want to share
          feedback, the fastest way to reach us is by email.
        </p>
      }
    >
      <a href="mailto:hello@playlight.app" className="pl3-doc__mail">
        <Mail aria-hidden />
        <span>
          <span className="pl3-doc__mail-kicker">Write to us</span>
          <span className="pl3-doc__mail-address">hello@playlight.app</span>
        </span>
      </a>

      <section>
        <h2>Contact details</h2>
        <div className="pl3-doc__qa">
          <div>
            <h3>Operator</h3>
            <p>Light Technologies · Islamabad, Pakistan</p>
          </div>
          <div>
            <h3>Telephone</h3>
            <p>
              <a href="tel:+923365192688" className="inline-flex items-center gap-2">
                <Phone aria-hidden className="size-4" />
                +92 336 519 2688
              </a>
            </p>
          </div>
          <div>
            <h3>Postal address</h3>
            <p className="inline-flex items-start gap-2">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0" />
              <span>
                Ardium, Hub Commercial Plaza #97, Phase 8, Bahria Town, Islamabad, Pakistan
              </span>
            </p>
          </div>
          <div>
            <h3>Privacy and legal</h3>
            <p>
              Email hello@playlight.app. Please include “Privacy” or “Legal” in the subject so we
              can route your message correctly.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Common questions</h2>

        <div className="pl3-doc__qa">
          <div>
            <h3>How do I delete my account?</h3>
            <p>
              Full steps are on our <Link to="/delete">Delete Account or Data</Link> page. Email
              hello@playlight.app from your account address (or use the form on that page). We
              acknowledge requests within about 2 business days, revoke active sessions, and delete
              or anonymise user-owned records within 30 days. Encrypted backups expire within up to
              30 additional days - see the <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>

          <div>
            <h3>I forgot my password.</h3>
            <p>
              Use the “Forgot password” link on the sign-in screen to receive a secure reset link by
              email. If the email never arrives, check your spam folder or contact us.
            </p>
          </div>

          <div>
            <h3>How do I report a bug or request a feature?</h3>
            <p>
              Email us with a short description and, if possible, your device model and app version.
              We triage feedback weekly and prioritise issues that affect the most users.
            </p>
          </div>

          <div>
            <h3>Where can I read your Privacy Policy?</h3>
            <p>
              Our full Privacy Policy is available <Link to="/privacy">here</Link>. It explains what
              we collect, how we use it, and your rights.
            </p>
          </div>

          <div>
            <h3>Where can I read the Terms of Use?</h3>
            <p>
              The current Terms of Use are available <Link to="/terms">here</Link>.
            </p>
          </div>
        </div>
      </section>

      <p className="pl3-doc__note">Response time: within 2 business days</p>
    </DocPage>
  );
}
