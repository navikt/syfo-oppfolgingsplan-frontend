"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { GodkjenningStatus } from "./godkjenningTypes";

const IKKE_BESVART_STATUS: GodkjenningStatus = { type: "IKKE_BESVART" };

interface GodkjenningContextValue {
  status: GodkjenningStatus;
  godkjenn: () => void;
  avslaa: (kommentar: string | null) => void;
  overstyr: (begrunnelse: string) => void;
  setStatus: (status: GodkjenningStatus) => void;
}

const GodkjenningContext = createContext<GodkjenningContextValue | null>(null);

interface ProviderProps {
  planId: string;
  initialStatus?: GodkjenningStatus;
  children: React.ReactNode;
}

function isGodkjenningStatus(value: unknown): value is GodkjenningStatus {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  switch (value.type) {
    case "IKKE_BESVART":
    case "GODKJENT":
      return true;
    case "AVSLATT":
      return (
        "kommentar" in value &&
        (typeof value.kommentar === "string" || value.kommentar === null)
      );
    case "OVERSTYRT":
      return "begrunnelse" in value && typeof value.begrunnelse === "string";
    default:
      return false;
  }
}

export function GodkjenningProvider({
  planId,
  initialStatus,
  children,
}: ProviderProps) {
  const [status, setStatus] = useState<GodkjenningStatus>(
    initialStatus ?? IKKE_BESVART_STATUS,
  );
  const [hasHydrated, setHasHydrated] = useState(!!initialStatus);
  const storageKey = `godkjenning-prototype-status-${planId}`;

  useEffect(() => {
    if (initialStatus) {
      return;
    }

    try {
      const storedStatus = window.localStorage.getItem(storageKey);

      if (!storedStatus) {
        setStatus(IKKE_BESVART_STATUS);
        setHasHydrated(true);
        return;
      }

      const parsedStatus: unknown = JSON.parse(storedStatus);

      if (isGodkjenningStatus(parsedStatus)) {
        setStatus(parsedStatus);
      } else {
        console.error("Invalid godkjenning status in localStorage", {
          storageKey,
          parsedStatus,
        });
        setStatus(IKKE_BESVART_STATUS);
      }
    } catch (error) {
      console.error("Failed to read godkjenning status from localStorage", {
        storageKey,
        error,
      });
      setStatus(IKKE_BESVART_STATUS);
    }

    setHasHydrated(true);
  }, [storageKey, initialStatus]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(status));
    } catch (error) {
      console.error("Failed to write godkjenning status to localStorage", {
        storageKey,
        status,
        error,
      });
    }
  }, [hasHydrated, status, storageKey]);

  const value: GodkjenningContextValue = {
    status,
    godkjenn: () => setStatus({ type: "GODKJENT" }),
    avslaa: (kommentar) => setStatus({ type: "AVSLATT", kommentar }),
    overstyr: (begrunnelse) => setStatus({ type: "OVERSTYRT", begrunnelse }),
    setStatus,
  };

  return <GodkjenningContext value={value}>{children}</GodkjenningContext>;
}

export function useGodkjenningContext(): GodkjenningContextValue {
  const ctx = useContext(GodkjenningContext);

  if (!ctx) {
    throw new Error(
      "useGodkjenningContext must be used within a GodkjenningProvider",
    );
  }

  return ctx;
}
