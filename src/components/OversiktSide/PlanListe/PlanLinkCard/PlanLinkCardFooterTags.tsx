import { Tag, type TagProps } from "@navikt/ds-react";

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
      <Tag data-color="success" variant="moderate" size={size}>
        Delt med den ansatte
      </Tag>
      {isDeltMedLege ? (
        <Tag variant={tagVariantHvisDelt} size={size}>
          Sendt til fastlege
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke sendt til fastlege
        </Tag>
      )}
      {isDeltMedVeileder ? (
        <Tag variant={tagVariantHvisDelt} size={size}>
          Sendt til Nav
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke sendt til Nav
        </Tag>
      )}
    </>
  );
}
