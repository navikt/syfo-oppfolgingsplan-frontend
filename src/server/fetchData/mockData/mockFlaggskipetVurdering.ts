import {
  DIALOGMOTE_TILTAKSPAKKE_2,
  type FlaggskipetVurderingResponse,
} from "@/schema/flaggskipetSchemas";
import { mockOrganization } from "./mockEmployeeDetails";

const mockOrgnummer = mockOrganization.orgNumber;

export const mockFlaggskipetVurderingStandard: FlaggskipetVurderingResponse =
  [];

export const mockFlaggskipetVurderingTiltakspakke2: FlaggskipetVurderingResponse =
  [
    {
      tiltakspakkeId: DIALOGMOTE_TILTAKSPAKKE_2,
      virksomheter: [
        {
          orgnummer: mockOrgnummer,
          deltakelse: "TILTAKSGRUPPE",
        },
      ],
    },
  ];
