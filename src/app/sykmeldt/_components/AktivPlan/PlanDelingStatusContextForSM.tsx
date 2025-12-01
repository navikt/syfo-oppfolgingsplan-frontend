"use client";

import React, { createContext, useContext } from "react";

// Simple read-only context for SM to display plan deling status.
// Unlike AG, SM cannot trigger actions to share the plan.

interface PlanDelingStatusContextValue {
  deltMedLegeTidspunkt: Date | null;
  deltMedVeilederTidspunkt: Date | null;
}

const PlanDelingStatusContext =
  createContext<PlanDelingStatusContextValue | null>(null);

interface ProviderProps {
  deltMedLegeTidspunkt: Date | null;
  deltMedVeilederTidspunkt: Date | null;
  children: React.ReactNode;
}

export function PlanDelingStatusProviderSM({
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
  children,
}: ProviderProps) {
  const value: PlanDelingStatusContextValue = {
    deltMedLegeTidspunkt,
    deltMedVeilederTidspunkt,
  };

  return (
    <PlanDelingStatusContext value={value}>{children}</PlanDelingStatusContext>
  );
}

export function usePlanDelingStatusContext(): PlanDelingStatusContextValue {
  const ctx = useContext(PlanDelingStatusContext);
  if (!ctx) {
    throw new Error(
      "usePlanDelingStatusContext must be used within a PlanDelingStatusProviderSM",
    );
  }
  return ctx;
}
