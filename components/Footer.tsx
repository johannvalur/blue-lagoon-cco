import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { BrandMark } from "./BrandMark";
import { FooterPolicyLinks } from "./FooterPolicyLinks";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink">

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center gap-5 pb-3 pt-9 sm:flex-row-reverse sm:justify-between sm:pb-4 sm:pt-11">
          <BrandMark height={28} variant="navy" />

          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/bluelagoon/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Blue Lagoon on Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bluelagoon-mist text-bluelagoon-muted ring-1 ring-inset ring-bluelagoon-line transition hover:bg-bluelagoon-cloud hover:text-bluelagoon-midnight"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.facebook.com/BlueLagoon/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Blue Lagoon on Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bluelagoon-mist text-bluelagoon-muted ring-1 ring-inset ring-bluelagoon-line transition hover:bg-bluelagoon-cloud hover:text-bluelagoon-midnight"
            >
              <FontAwesomeIcon icon={faFacebookF} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/company/bluelagoon/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Blue Lagoon on LinkedIn"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bluelagoon-mist text-bluelagoon-muted ring-1 ring-inset ring-bluelagoon-line transition hover:bg-bluelagoon-cloud hover:text-bluelagoon-midnight"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.youtube.com/bluelagoon"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Blue Lagoon on YouTube"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bluelagoon-mist text-bluelagoon-muted ring-1 ring-inset ring-bluelagoon-line transition hover:bg-bluelagoon-cloud hover:text-bluelagoon-midnight"
            >
              <FontAwesomeIcon icon={faYoutube} className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-center text-[11px] text-bluelagoon-muted sm:text-left">
            © 2026 Blue Lagoon · Concept exploration — synthetic data, no real bookings.
          </p>
        </div>

        <FooterPolicyLinks />
      </div>
    </footer>
  );
}
