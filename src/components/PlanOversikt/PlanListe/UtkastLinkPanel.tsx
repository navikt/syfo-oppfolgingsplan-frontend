import NextLink from "next/link";
import { UtkastDataForOversikt } from "@/schema/oppfolgingsplanOversiktSchema";
import { BodyShort, LinkCard, Tag } from "@navikt/ds-react";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { getDatoStringWithTime } from "@/ui-helpers/dateAndTime";

interface Props {
  utkast: UtkastDataForOversikt;
}

export default function UtkastLinkPanel({}: Props) {
  return (
    <LinkCard className="bg-ax-bg-brand-beige-soft">
      <LinkCardTitle>
        <LinkCardAnchor asChild>
          <NextLink href="TODO_REDIGER_UTKAST">
            Utkast til oppfølgingsplan
          </NextLink>
        </LinkCardAnchor>
      </LinkCardTitle>

      <LinkCardDescription>
        <BodyShort size="small" spacing>
          <em>Sist lagret (TODO) {getDatoStringWithTime(new Date())}</em>
        </BodyShort>
      </LinkCardDescription>

      <LinkCardFooter>
        <Tag variant="neutral-moderate" size="small">
          Kun synlig for deg
        </Tag>
      </LinkCardFooter>
    </LinkCard>
  );
}
