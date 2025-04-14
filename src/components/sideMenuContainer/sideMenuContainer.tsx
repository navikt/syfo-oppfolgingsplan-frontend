"use client";

import React, { ReactNode } from "react";
import {
  PageContainer,
  RootPages,
  SideMenu,
} from "@navikt/dinesykmeldte-sidemeny";
import { PersonIcon } from "@navikt/aksel-icons";
import { Sykmeldt } from "@/schema/sykmeldtSchema";

interface Props {
  sykmeldtData: Sykmeldt;
  children: ReactNode;
}

export const SideMenuContainer = ({ sykmeldtData, children }: Props) => {
  const sykmeldtNavn = sykmeldtData.navn || "Sykmeldt";
  return (
    <PageContainer
      sykmeldt={{
        navn: sykmeldtNavn,
        fnr: sykmeldtData.fnr,
      }}
      header={{
        title: "Oppfølgingsplan for " + sykmeldtNavn,
        subtitle: "Todo: Her kan vi legge inn f.eks sykmeldingsgrad og periode",
        Icon: PersonIcon,
      }}
      navigation={
        <SideMenu
          sykmeldtName={sykmeldtNavn}
          sykmeldtId={sykmeldtData.narmestelederId}
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
