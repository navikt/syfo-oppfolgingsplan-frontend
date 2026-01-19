import { HStack, LinkCard, Skeleton, VStack } from "@navikt/ds-react";
import {
  LinkCardDescription,
  LinkCardFooter,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";

/**
 * Skeleton for et LinkCard.
 */
function PlanLinkCardSkeleton({ isAktiv = false }: { isAktiv?: boolean }) {
  return (
    <LinkCard className={isAktiv ? "bg-ax-bg-success-soft" : undefined}>
      <LinkCardTitle>
        <Skeleton variant="text" width="55%" height={28} />
      </LinkCardTitle>

      <LinkCardDescription>
        <VStack gap="space-4" className="mt-2">
          <Skeleton variant="text" width={220} height={20} />
          <Skeleton variant="text" width={200} height={20} />
        </VStack>
      </LinkCardDescription>

      <LinkCardFooter>
        <HStack gap="space-8" wrap className="mt-3">
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
      </LinkCardFooter>
    </LinkCard>
  );
}

/**
 * Skeleton for oversiktssiden med plan-liste.
 */
export default function PlanListeSkeleton() {
  return (
    <section className="mb-12" aria-label="Laster planer">
      <VStack gap="space-16">
        {/* Én aktiv plan-card */}
        <PlanLinkCardSkeleton isAktiv />
      </VStack>
    </section>
  );
}
