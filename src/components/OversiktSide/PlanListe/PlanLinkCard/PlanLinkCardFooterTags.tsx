import { Tag, TagProps } from "@navikt/ds-react";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
  sharedStatusTagVariant?: TagProps["variant"];
  notSharedStatusTagVariant: TagProps["variant"];
}

export default function PlanLinkCardShareStatusFooterTags({
  isDeltMedLege,
  isDeltMedNav,
  sharedStatusTagVariant = "success-moderate",
  notSharedStatusTagVariant = "neutral-moderate",
}: Props) {
  return (
    <>
      {isDeltMedLege ? (
        <Tag variant={sharedStatusTagVariant} size="small">
          Delt med fastlege
        </Tag>
      ) : (
        <Tag variant={notSharedStatusTagVariant} size="small">
          Ikke delt med fastlege
        </Tag>
      )}
      {isDeltMedNav ? (
        <Tag variant={sharedStatusTagVariant} size="small">
          Delt med Nav
        </Tag>
      ) : (
        <Tag variant={notSharedStatusTagVariant} size="small">
          Ikke delt med Nav
        </Tag>
      )}
    </>
  );
}
