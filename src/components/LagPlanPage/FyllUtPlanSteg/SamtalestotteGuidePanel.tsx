import Link from "next/link";
import { BodyLong, GuidePanel } from "@navikt/ds-react";

export default function SamtaleStotteGuidePanel() {
  return (
    <GuidePanel className="mb-8">
      <BodyLong className="mb-4">
        Samtaler rundt sykefravær kan være vanskelige. Vi har laget et verktøy
        for arbeidsgivere for å gjøre det lettere å forberede seg til samtaler
        med medarbeidere.
      </BodyLong>
      <BodyLong>
        <Link
          href="https://www.nav.no/arbeidsgiver/samtalestotte-arbeidsgiver"
          className="underline text-ax-text-accent-subtle"
          target="_blank"
        >
          Gå til samtalestøtten (åpner i ny fane)
        </Link>
      </BodyLong>
    </GuidePanel>
  );
}
