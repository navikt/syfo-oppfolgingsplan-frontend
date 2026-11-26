"use client";

import { VStack } from "@navikt/ds-react";
import { useLayoutEffect, useRef } from "react";
import { recordUnntak } from "@/instrumentation/unntakTelemetry";
import { LagNyOppfolgingsplanButton } from "../PlanListe/NyPlanButton";
import MeldUnntakSection from "./MeldUnntakSection";

interface Props {
  narmesteLederId: string;
  ansattNavn: string;
}

/** Mounted only when the exception offer is available. */
export default function NyPlanOgUnntak({ narmesteLederId, ansattNavn }: Props) {
  const opened = useRef(false);

  useLayoutEffect(() => {
    return () => {
      // The parent keys this component by leader context. Also reset when
      // Next hides this page in an Activity boundary.
      // Refreshing the same visible context does not restart the visit.
      opened.current = false;
    };
  }, []);

  function recordOpening() {
    if (opened.current) return;
    opened.current = true;
    recordUnntak({ hendelse: "aapnet" });
  }

  function recordAction(hendelse: "send" | "lag_plan") {
    if (opened.current) recordUnntak({ hendelse });
  }

  return (
    <VStack gap="space-32" marginBlock="space-0 space-32">
      <LagNyOppfolgingsplanButton
        narmesteLederId={narmesteLederId}
        onClick={() => recordAction("lag_plan")}
      />
      <MeldUnntakSection
        ansattNavn={ansattNavn}
        onOpen={recordOpening}
        onSubmit={() => recordAction("send")}
      />
    </VStack>
  );
}
