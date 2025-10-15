import { HStack, Tag, TagProps } from "@navikt/ds-react";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
  notSharedTagVariant?: TagProps["variant"];
}

export default function PlanLinkPanelTags({
  isDeltMedLege,
  isDeltMedNav,
  notSharedTagVariant = "neutral-moderate",
}: Props) {
  return (
    <HStack gap="2">
      {isDeltMedLege ? (
        <Tag variant="success-moderate" size="small">
          Delt med fastlege
        </Tag>
      ) : (
        <Tag variant={notSharedTagVariant} size="small">
          Ikke delt med fastlege
        </Tag>
      )}
      {isDeltMedNav ? (
        <Tag variant="success-moderate" size="small">
          Delt med Nav
        </Tag>
      ) : (
        <Tag variant={notSharedTagVariant} size="small">
          Ikke delt med Nav
        </Tag>
      )}
    </HStack>
  );
}
