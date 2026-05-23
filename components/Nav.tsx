import Link from "next/link";
import { AccessibilityMenu } from "./AccessibilityMenu";
import { BrandMark } from "./BrandMark";
import { LanguagePicker } from "./LanguagePicker";
import { SiteSearch } from "./SiteSearch";
import { UserMenu } from "./UserMenu";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-bluelagoon-line bg-bluelagoon-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-none items-center gap-3">
          <Link
            href="/"
            aria-label="Blue Lagoon"
            className="flex flex-none items-center text-bluelagoon-midnight"
          >
            <span className="sm:hidden">
              <BrandMark height={20} />
            </span>
            <span className="hidden sm:inline-block">
              <BrandMark height={24} />
            </span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <SiteSearch />
        </div>

        <div className="flex flex-none items-center gap-2">
          <AccessibilityMenu />
          <LanguagePicker />
          <div className="ml-1 border-l border-bluelagoon-line pl-2 sm:ml-2 sm:pl-3">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
