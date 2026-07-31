"use client";

import { PersonIcon } from "@navikt/aksel-icons";
import {
  PageContainer,
  RootPages,
  SideMenu,
} from "@navikt/dinesykmeldte-sidemeny";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAGOversiktHref } from "@/common/route-hrefs";

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
            Oppfolgingsplaner: {
              notifications: 0,
              internalRoute: ({ children, ...rest }) => (
                <Link {...rest} href={getAGOversiktHref(narmesteLederId)}>
                  {children}
                </Link>
              ),
            },
            DineSykmeldte: 0,
          }}
        />
      }
    >
      {children}
    </PageContainer>
  );
};
