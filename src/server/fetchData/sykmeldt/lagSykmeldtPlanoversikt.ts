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
  harOppfolgingsplaner: boolean;
}

export function lagSykmeldtPlanoversikt(
  oversikt: OppfolgingsplanerOversiktForSM,
  organisasjonerITiltaksgruppe: ReadonlySet<string>,
): SykmeldtPlanoversikt {
  const virksomheter = oversikt.virksomheter
    .map(({ organization, oppfolgingsplanhendelser }) => ({
      organization,
      oppfolgingsplanhendelser: oppfolgingsplanhendelser.filter(
        (hendelse) =>
          hendelse.type === "FERDIGSTILT_PLAN" ||
          organisasjonerITiltaksgruppe.has(organization.orgNumber),
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
        .filter(
          (hendelse, index) =>
            index > 0 || hendelse.type === "PLAN_IKKE_NODVENDIG",
        )
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
    harOppfolgingsplaner: virksomheter.some(({ oppfolgingsplanhendelser }) =>
      oppfolgingsplanhendelser.some(
        (hendelse) => hendelse.type === "FERDIGSTILT_PLAN",
      ),
    ),
  };
}

function hendelseTidspunkt(hendelse: OppfolgingsplanHendelse): string {
  return hendelse.type === "FERDIGSTILT_PLAN"
    ? hendelse.ferdigstiltTidspunkt
    : hendelse.meldtTidspunkt;
}
