import { Tag, TagProps } from "@navikt/ds-react";

interface Props {
  tagSize: TagProps["size"];
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
  tagVariantHvisDelt?: TagProps["variant"];
  tagVariantHvisIkkeDelt?: TagProps["variant"];
}

export default function PlanDelingStatusTags({
  isDeltMedLege,
  isDeltMedVeileder,
  tagVariantHvisDelt = "success-moderate",
  tagVariantHvisIkkeDelt = "neutral-moderate",
  tagSize: size,
}: Props) {
  return (
    <>
      <Tag variant="success-moderate" size={size}>
        Delt med den ansatte
      </Tag>

      {isDeltMedLege ? (
        <Tag variant={tagVariantHvisDelt} size={size}>
          Delt med fastlege
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke delt med fastlege
        </Tag>
      )}
      {isDeltMedVeileder ? (
        <Tag variant={tagVariantHvisDelt} size={size}>
          Delt med Nav
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke delt med Nav
        </Tag>
      )}
    </>
  );
}
