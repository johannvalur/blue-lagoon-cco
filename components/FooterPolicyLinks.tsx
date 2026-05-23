"use client";

import { useState } from "react";
import { PolicyModal, type PolicyKey } from "./PolicyModal";

const POLICY_LINKS: { label: string; key: PolicyKey }[] = [
  { label: "Privacy policy", key: "privacy" },
  { label: "Terms and conditions", key: "terms" },
  { label: "Cookie policy", key: "cookies" },
  { label: "Cookie settings", key: "cookie-settings" },
];

export function FooterPolicyLinks() {
  const [active, setActive] = useState<PolicyKey | null>(null);

  return (
    <>
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pb-9 text-[11px] text-bluelagoon-muted sm:justify-start sm:pb-11">
        {POLICY_LINKS.map((link, i) => (
          <li key={link.key} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActive(link.key)}
              className="transition hover:text-bluelagoon-midnight focus-visible:text-bluelagoon-midnight focus-visible:outline-none"
            >
              {link.label}
            </button>
            {i < POLICY_LINKS.length - 1 && (
              <span aria-hidden className="text-bluelagoon-line">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      <PolicyModal
        open={active !== null}
        policy={active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
