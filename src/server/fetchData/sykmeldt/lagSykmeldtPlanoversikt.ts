import type { OppfolgingsplanHendelse } from "@/schema/oppfolgingsplanhendelseSchemas";
import type { OrganizationDetails } from "@/schema/organizationDetailsSchema";
import type { OppfolgingsplanerOversiktForSM } from "@/schema/oversiktResponseSchemas";

export interface OppfolgingsplanHendelseForVirksomhet {
  organization: OrganizationDetails;
  hendelse: OppfolgingsplanHendelse;
}

export interface SykmeldtPlanoversikt {
  gjeldendeHendelser: OppfolgingsplanHendelseForVirksomhet[];
  tidligereHendelser: OppfolgingsplanHendelseForVirksomhet[];
  harFerdigstiltePlaner: boolean;
  erITiltaksgruppe: boolean;
}

export function lagSykmeldtPlanoversikt(
  oversikt: OppfolgingsplanerOversiktForSM,
  organisasjonerITiltaksgruppe: ReadonlySet<string>,
): SykmeldtPlanoversikt {
  const virksomheter = oversikt.virksomheter
    .map(({ virksomhet, oppfolgingsplanhendelser }) => ({
      organization: virksomhet,
      oppfolgingsplanhendelser: oppfolgingsplanhendelser.filter(
        (hendelse) =>
          hendelse.type === "FERDIGSTILT_PLAN" ||
          organisasjonerITiltaksgruppe.has(virksomhet.orgNumber),
      ),
    }))
    .filter(
      ({ oppfolgingsplanhendelser }) => oppfolgingsplanhendelser.length > 0,
    );

  const gjeldendeHendelser = virksomheter.map(
    ({ organization, oppfolgingsplanhendelser }) => ({
      organization,
      hendelse: oppfolgingsplanhendelser[0],
    }),
  );

  const tidligereHendelser = virksomheter
    .flatMap(({ organization, oppfolgingsplanhendelser }) =>
      oppfolgingsplanhendelser
        .filter((hendelse, index) => {
          const erGjeldende = index === 0;
          const vurderingVisesSomInnslag =
            hendelse.type === "PLAN_IKKE_NODVENDIG";

          return !erGjeldende || vurderingVisesSomInnslag;
        })
        .map((hendelse) => ({ organization, hendelse })),
    )
    .sort(
      (a, b) =>
        Date.parse(hendelseTidspunkt(b.hendelse)) -
        Date.parse(hendelseTidspunkt(a.hendelse)),
    );

  return {
    gjeldendeHendelser,
    tidligereHendelser,
    harFerdigstiltePlaner: virksomheter.some(({ oppfolgingsplanhendelser }) =>
      oppfolgingsplanhendelser.some(
        (hendelse) => hendelse.type === "FERDIGSTILT_PLAN",
      ),
    ),
    erITiltaksgruppe: organisasjonerITiltaksgruppe.size > 0,
  };
}

function hendelseTidspunkt(hendelse: OppfolgingsplanHendelse): string {
  return hendelse.type === "FERDIGSTILT_PLAN"
    ? hendelse.ferdigstiltTidspunkt
    : hendelse.meldtTidspunkt;
}
