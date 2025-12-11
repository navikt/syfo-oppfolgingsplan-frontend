import { HStack, Skeleton, VStack } from "@navikt/ds-react";

/**
 * Skeleton for et LinkCard.
 * Bruker navds-link-card klasser for riktig styling.
 */
function PlanLinkCardSkeleton({ isAktiv = false }: { isAktiv?: boolean }) {
  return (
    <div
      className={`navds-link-card ${isAktiv ? "bg-surface-success-subtle" : ""}`}
    >
      <div className="navds-link-card__content">
        {/* Tittel */}
        <Skeleton variant="text" width="55%" height={28} />

        {/* Datoer */}
        <VStack gap="1" className="mt-2">
          <Skeleton variant="text" width={220} height={20} />
          <Skeleton variant="text" width={200} height={20} />
        </VStack>

        {/* Tags - 3 stk som wrapper på mobil */}
        <HStack gap="2" wrap className="mt-3">
          <Skeleton variant="rounded" height={22}>
            Delt med den ansatte
          </Skeleton>
          <Skeleton variant="rounded" height={22}>
            Ikke sendt til fastlege
          </Skeleton>
          <Skeleton variant="rounded" height={22}>
            Ikke sendt til Nav
          </Skeleton>
        </HStack>
      </div>
    </div>
  );
}

/**
 * Skeleton for oversiktssiden med plan-liste.
 */
export default function PlanListeSkeleton() {
  return (
    <section className="mb-12" aria-label="Laster planer">
      <VStack gap="4">
        {/* Én aktiv plan-card */}
        <PlanLinkCardSkeleton isAktiv />
      </VStack>
    </section>
  );
}
