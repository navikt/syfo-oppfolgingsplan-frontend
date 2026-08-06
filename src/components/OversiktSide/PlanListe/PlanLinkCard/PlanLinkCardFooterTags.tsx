import { Tag, type TagProps } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  tagSize: TagProps["size"];
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
  /** Settes kun der delingsdatoen skal vises i taggen, for eksempel på aktiv plan. */
  deltMedLegeTidspunkt?: string | null;
  /** Settes kun der delingsdatoen skal vises i taggen, for eksempel på aktiv plan. */
  deltMedVeilederTidspunkt?: string | null;
  tagVariantHvisDelt?: TagProps["variant"];
  tagVariantHvisIkkeDelt?: TagProps["variant"];
}

function medDelingsdato(tekst: string, tidspunkt?: string | null) {
  return tidspunkt ? `${tekst} ${getFormattedDateString(tidspunkt)}` : tekst;
}

export default function PlanDelingStatusTags({
  isDeltMedLege,
  isDeltMedVeileder,
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
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
          {medDelingsdato("Sendt til fastlege", deltMedLegeTidspunkt)}
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke sendt til fastlege
        </Tag>
      )}
      {isDeltMedVeileder ? (
        <Tag variant={tagVariantHvisDelt} size={size}>
          {medDelingsdato("Sendt til Nav", deltMedVeilederTidspunkt)}
        </Tag>
      ) : (
        <Tag variant={tagVariantHvisIkkeDelt} size={size}>
          Ikke sendt til Nav
        </Tag>
      )}
    </>
  );
}
