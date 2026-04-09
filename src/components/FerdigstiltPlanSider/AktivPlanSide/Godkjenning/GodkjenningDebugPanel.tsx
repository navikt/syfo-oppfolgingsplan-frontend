"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getAGAktivPlanHref, getSMAktivPlanHref } from "@/common/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { useGodkjenningContext } from "./GodkjenningContext";

interface Props {
  agHref?: string;
  smHref?: string;
}

export function GodkjenningDebugPanel({ agHref, smHref }: Props) {
  const pathname = usePathname();
  const { status, setStatus } = useGodkjenningContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isLocalOrDemo) {
    return null;
  }

  const isSMRoute = pathname.startsWith("/sykmeldt/aktiv-plan/");
  const isAGRoute = pathname.endsWith("/aktiv-plan") && !isSMRoute;

  const agRouteHref = isAGRoute
    ? pathname
    : (agHref ?? getAGAktivPlanHref("mock-id"));
  const smRouteHref = isSMRoute
    ? pathname
    : (smHref ?? getSMAktivPlanHref("mock-id"));

  function handleStatusChange(value: string) {
    switch (value) {
      case "IKKE_BESVART":
        setStatus({ type: "IKKE_BESVART" });
        break;
      case "GODKJENT":
        setStatus({ type: "GODKJENT" });
        break;
      case "AVSLATT":
        setStatus({ type: "AVSLATT", kommentar: null });
        break;
      case "OVERSTYRT":
        setStatus({
          type: "OVERSTYRT",
          begrunnelse: "Mock-begrunnelse fra debug-panel",
        });
        break;
      default:
        break;
    }
  }

  return (
    <Box
      background="neutral-soft"
      borderColor="neutral-subtle"
      borderRadius="12"
      borderWidth="1"
      padding="space-16"
      shadow="dialog"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: 50,
        maxWidth: "300px",
        width: "calc(100vw - 2rem)",
      }}
    >
      <VStack gap="space-12">
        <HStack align="center" justify="space-between" gap="space-12">
          <Heading level="4" size="xsmall">
            🔧 Prototype
          </Heading>

          <Button
            type="button"
            variant="tertiary-neutral"
            size="small"
            iconPosition="right"
            icon={
              isCollapsed ? (
                <ChevronDownIcon aria-hidden />
              ) : (
                <ChevronUpIcon aria-hidden />
              )
            }
            onClick={() => setIsCollapsed((value) => !value)}
          >
            {isCollapsed ? "Vis" : "Skjul"}
          </Button>
        </HStack>

        {!isCollapsed && (
          <VStack gap="space-12">
            <RadioGroup
              legend="Godkjenningsstatus"
              size="small"
              value={status.type}
              onChange={handleStatusChange}
            >
              <VStack gap="space-8">
                <Radio value="IKKE_BESVART">Ikke besvart</Radio>
                <Radio value="GODKJENT">Godkjent</Radio>
                <Radio value="AVSLATT">Avslått</Radio>

                {status.type === "AVSLATT" && (
                  <TextField
                    label="Mock-kommentar"
                    size="small"
                    value={status.kommentar ?? ""}
                    onChange={(event) =>
                      setStatus({
                        type: "AVSLATT",
                        kommentar:
                          event.target.value.length > 0
                            ? event.target.value
                            : null,
                      })
                    }
                  />
                )}

                <Radio value="OVERSTYRT">Overstyrt</Radio>

                {status.type === "OVERSTYRT" && (
                  <TextField
                    label="Mock-begrunnelse"
                    size="small"
                    value={status.begrunnelse}
                    onChange={(event) =>
                      setStatus({
                        type: "OVERSTYRT",
                        begrunnelse: event.target.value,
                      })
                    }
                  />
                )}
              </VStack>
            </RadioGroup>

            <VStack gap="space-8">
              <Heading level="5" size="xsmall">
                Navigasjon
              </Heading>

              <HStack gap="space-8" wrap>
                <Link
                  as={NextLink}
                  href={agRouteHref}
                  aria-current={isAGRoute ? "page" : undefined}
                  className={isAGRoute ? "font-semibold" : undefined}
                >
                  AG-side
                </Link>

                <Link
                  as={NextLink}
                  href={smRouteHref}
                  aria-current={isSMRoute ? "page" : undefined}
                  className={isSMRoute ? "font-semibold" : undefined}
                >
                  SM-side
                </Link>
              </HStack>
            </VStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
