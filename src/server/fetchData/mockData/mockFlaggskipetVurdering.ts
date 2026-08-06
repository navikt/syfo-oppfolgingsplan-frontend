import {
  type FlaggskipetVurderingResponse,
  OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
} from "@/schema/flaggskipetSchemas";
import { mockOrganization } from "./mockEmployeeDetails";

const mockOrgnummer = mockOrganization.orgNumber;

export const mockFlaggskipetVurderingTiltaksgruppe: FlaggskipetVurderingResponse =
  [
    {
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      virksomheter: [
        {
          orgnummer: mockOrgnummer,
          deltakelse: "TILTAKSGRUPPE",
        },
      ],
    },
  ];

export const mockFlaggskipetVurderingKontrollgruppe: FlaggskipetVurderingResponse =
  [
    {
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      virksomheter: [
        {
          orgnummer: mockOrgnummer,
          deltakelse: "KONTROLLGRUPPE",
        },
      ],
    },
  ];

export const mockFlaggskipetVurderingUtenforScope: FlaggskipetVurderingResponse =
  [
    {
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      virksomheter: [
        {
          orgnummer: mockOrgnummer,
          deltakelse: "UTENFOR_SCOPE",
        },
      ],
    },
  ];
