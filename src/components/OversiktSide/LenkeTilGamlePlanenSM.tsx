import { Heading, LinkCard } from "@navikt/ds-react";
import { LinkCardAnchor, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { publicEnv } from "@/env-variables/publicEnv";

export const LenkeTilGamlePlanenSM = () => {
  const gammelOppfolgingsplanUrl =
    publicEnv.NEXT_PUBLIC_GAMMEL_OPPFOLGINGSPLAN_URL;

  return (
    <div className="mt-16">
      <Heading level="3" size="medium" spacing>
        Leter du etter den gamle oppfølgingsplanen?
      </Heading>

      <LinkCard className="bg-ax-bg-info-soft">
        <LinkCardTitle>
          <LinkCardAnchor href={`${gammelOppfolgingsplanUrl}/sykmeldt`}>
            Gå til den gamle oppfølgingsplanen
          </LinkCardAnchor>
        </LinkCardTitle>
      </LinkCard>
    </div>
  );
};
