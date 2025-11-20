"use client";

import React, { createContext, useContext } from "react";
import { useDelPlanMedLegeAction } from "./DelAktivPlan/useDelPlanMedLegeAction";
import { useDelPlanMedVeilederAction } from "./DelAktivPlan/useDelPlanMedVeilederAction";

// This context provider is used to share state between client components that
// are separate children of a root server component. This is a pattern to share
// state between client components without having to make all the common parent
// components also client components. See https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers.

interface PlanDelingContextValue {
  deltMedLegeTidspunkt: Date | null;
  deltMedVeilederTidspunkt: Date | null;
  delMedLegeAction: ({ planId }: { planId: string }) => void;
  delMedVeilederAction: ({ planId }: { planId: string }) => void;
  isPendingDelMedLege: boolean;
  isPendingDelMedVeileder: boolean;
  errorDelMedLege: string | null;
  errorDelMedVeileder: string | null;
}

const PlanDelingContext = createContext<PlanDelingContextValue | null>(null);

interface ProviderProps {
  initialDeltMedLegeTidspunkt: Date | null;
  initialDeltMedVeilederTidspunkt: Date | null;
  children: React.ReactNode;
}

export function PlanDelingProvider({
  initialDeltMedLegeTidspunkt,
  initialDeltMedVeilederTidspunkt,
  children,
}: ProviderProps) {
  const {
    deltMedLegeTidspunkt,
    delMedLegeAction,
    isPendingDelMedLege,
    errorDelMedLege,
  } = useDelPlanMedLegeAction(initialDeltMedLegeTidspunkt);

  const {
    deltMedVeilederTidspunkt,
    delMedVeilederAction,
    isPendingDelMedVeileder,
    errorDelMedVeileder,
  } = useDelPlanMedVeilederAction(initialDeltMedVeilederTidspunkt);

  const value: PlanDelingContextValue = {
    deltMedLegeTidspunkt,
    deltMedVeilederTidspunkt,
    delMedLegeAction,
    delMedVeilederAction,
    isPendingDelMedLege,
    isPendingDelMedVeileder,
    errorDelMedLege,
    errorDelMedVeileder,
  };

  return <PlanDelingContext value={value}>{children}</PlanDelingContext>;
}

export function usePlanDelingContext(): PlanDelingContextValue {
  const ctx = useContext(PlanDelingContext);
  if (!ctx) {
    throw new Error("useDelPlanContext must be used within a DelPlanProvider");
  }
  return ctx;
}
