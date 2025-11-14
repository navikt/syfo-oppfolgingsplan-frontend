import { ReactNode } from "react";
import { PersonIcon } from "@navikt/aksel-icons";
import {
  PageContainer,
  RootPages,
  SideMenu,
} from "@navikt/dinesykmeldte-sidemeny";

interface Props {
  narmesteLederId: string;
  employeeFnr: string;
  employeeName: string;
  children: ReactNode;
}

export const ArbeidsgiverPageContainer = ({
  narmesteLederId,
  employeeFnr,
  employeeName,
  children,
}: Props) => {
  return (
    <PageContainer
      sykmeldt={{
        fnr: employeeFnr,
        navn: employeeName,
      }}
      header={{
        title: employeeName,
        subtitle: "70 % sykmeldt fra 19. september til 6. november 2025",
        Icon: PersonIcon,
      }}
      navigation={
        <SideMenu
          sykmeldtName={employeeName}
          sykmeldtId={narmesteLederId}
          activePage={RootPages.Oppfolgingsplaner}
          routes={{
            Soknader: 0,
            Sykmeldinger: 0,
            Meldinger: false,
            Dialogmoter: 0,
            Oppfolgingsplaner: 0,
            DineSykmeldte: 0,
          }}
        />
      }
    >
      {children}
    </PageContainer>
  );
};
