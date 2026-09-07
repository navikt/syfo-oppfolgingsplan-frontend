import { useEffect, useRef } from "react";
import {
  getAidPlanAttributes,
  recordAidPlan,
} from "@/instrumentation/aidPlanTelemetry";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";

/** The page keys the wizard by leader context; a new context is a new visit. */
export function usePlanDeliveryTelemetry(tiltakspakke: TiltakspakkeContext) {
  const elementRef = useRef<HTMLElement>(null);
  const decisionRecorded = useRef(false);
  const viewRecorded = useRef(false);
  const { gruppe, variant } = getAidPlanAttributes(tiltakspakke);

  useEffect(() => {
    if (!decisionRecorded.current) {
      decisionRecorded.current = true;
      recordAidPlan({
        gruppe,
        variant,
        hendelse: "beslutning",
        utfall: "tilgjengelig",
      });
    }
    if (
      viewRecorded.current ||
      !elementRef.current ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    let active = true;
    const observer = new IntersectionObserver((entries) => {
      if (
        !active ||
        viewRecorded.current ||
        !entries.some((entry) => entry.isIntersecting)
      )
        return;
      viewRecorded.current = true;
      recordAidPlan({
        gruppe,
        variant,
        hendelse: "vist",
        utfall: "tilgjengelig",
      });
      observer.disconnect();
    });
    observer.observe(elementRef.current);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [gruppe, variant]);

  return elementRef;
}
