import { BodyLong } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";

export default function OversiktSideIntroduksjon() {
  return (
    <TextContentBox>
      <BodyLong size="large" spacing>
        En god oppfølgingsplan gir dere felles retning og gjør det lettere å
        finne tilpasninger som fungerer.
      </BodyLong>
    </TextContentBox>
  );
}
