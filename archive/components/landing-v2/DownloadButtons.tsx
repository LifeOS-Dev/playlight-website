import { Apple, Play } from "lucide-react";

export function DownloadButtons({ size = "lg" }: { size?: "lg" | "sm" }) {
  return (
    <div className="pl2-cta" data-size={size}>
      <a href="#" className="pl2-cta__btn pl2-cta__btn--primary">
        <Apple className="pl2-cta__icon" />
        <span>
          <span className="pl2-cta__kicker">Download on the</span>
          <span className="pl2-cta__store">App Store</span>
        </span>
      </a>
      <a href="#" className="pl2-cta__btn">
        <Play className="pl2-cta__icon fill-current" />
        <span>
          <span className="pl2-cta__kicker">Get it on</span>
          <span className="pl2-cta__store">Google Play</span>
        </span>
      </a>
    </div>
  );
}
