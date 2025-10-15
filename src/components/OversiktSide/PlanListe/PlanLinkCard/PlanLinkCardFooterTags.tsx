import { Tag, TagProps } from "@navikt/ds-react";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
  tagVariantHvisDelt?: TagProps["variant"];
  tagVariantHvisIkkeDelt: TagProps["variant"];
}

export default function PlanLinkCardDelingStatusFooterTags({
  isDeltMedLege,
  isDeltMedNav,
  tagVariantHvisDelt = "success-moderate",
  tagVariantHvisIkkeDelt = "neutral-moderate",
}: Props) {
  return (
    <>
      {isDeltMedLege ? (
        <Tag variant={tagVariantHvisDelt} size="small">
          Delt med fastlege
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size="small">
          Ikke delt med fastlege
        </Tag>
      )}
      {isDeltMedNav ? (
        <Tag variant={tagVariantHvisDelt} size="small">
          Delt med Nav
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size="small">
          Ikke delt med Nav
        </Tag>
      )}
    </>
  );
}
