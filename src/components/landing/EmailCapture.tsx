import { useState } from "react";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

interface EmailCaptureProps {
  id: string;
  buttonLabel?: string;
  placeholder?: string;
  centered?: boolean;
}

export function EmailCapture({
  id,
  buttonLabel = "Join the Blueprint",
  placeholder = "you@domain.com",
  centered = false,
}: EmailCaptureProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid email");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("success");
    setValue("");
  };

  if (status === "success") {
    return (
      <div
        aria-live="polite"
        className={`flex items-center gap-3 rounded-full border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-sm text-foreground ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="text-accent">→</span>
        <span>You're on the list. We'll be in touch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-full sm:border sm:border-border sm:bg-background/80 sm:p-1.5 sm:shadow-sm sm:backdrop-blur sm:focus-within:border-foreground/60 sm:transition-colors">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-border bg-background px-5 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:border-0 sm:bg-transparent sm:py-2.5"
        />
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98] sm:py-2.5"
        >
          <span>{buttonLabel}</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>
      {error && (
        <p className={`mt-2 font-mono text-xs text-destructive ${centered ? "text-center" : ""}`} aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}