import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
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
        <h2>Common questions</h2>

        <div className="pl3-doc__qa">
          <div>
            <h3>How do I delete my account?</h3>
            <p>
              Full steps are on our <Link to="/delete">Delete Account or Data</Link> page. Email
              hello@playlight.app from your account address (or use the form on that page). We
              acknowledge requests within about 2 business days. Deletion begins as an account
              soft-delete, then we purge or anonymise user-owned records under our deletion
              workflow - see the <Link to="/privacy">Privacy Policy</Link>.
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
        </div>
      </section>

      <p className="pl3-doc__note">Response time: within 2 business days</p>
    </DocPage>
  );
}
