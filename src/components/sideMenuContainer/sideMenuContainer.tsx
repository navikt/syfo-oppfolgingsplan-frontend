"use client";

import React, { ReactNode } from "react";
import {
  PageContainer,
  RootPages,
  SideMenu,
} from "@navikt/dinesykmeldte-sidemeny";
import { PersonIcon } from "@navikt/aksel-icons";
import { SykmeldtInfo } from "@/schema/sykmeldtSchema";

interface Props {
  sykmeldtInfo: SykmeldtInfo;
  children: ReactNode;
}

export const SideMenuContainer = ({ sykmeldtInfo, children }: Props) => {
  const sykmeldtNavn = sykmeldtInfo.navn || "Sykmeldt";
  return (
    <PageContainer
      sykmeldt={{
        navn: sykmeldtNavn,
        fnr: sykmeldtInfo.fnr,
      }}
      header={{
        title: sykmeldtNavn,
        subtitle: "70 % sykmeldt fra 19. september til 6. november 2025",
        Icon: PersonIcon,
      }}
      navigation={
        <SideMenu
          sykmeldtName={sykmeldtNavn}
          sykmeldtId={sykmeldtInfo.narmestelederId}
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
