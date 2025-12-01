import { HStack, Skeleton, VStack } from "@navikt/ds-react";

export default function PlanListeSkeleton() {
  return (
    <section className="mb-12">
      {/* Aktive planer seksjon - valgte å kun vise dette da jeg mistenker de fleste har kun 1 aktiv plan */}
      <VStack gap="4">
        <Skeleton variant="text" width={140} height={28} />

        <div className="rounded-lg border border-border-subtle bg-surface-success-subtle p-4">
          <VStack gap="3">
            <Skeleton variant="text" width="60%" height={28} />
            <VStack gap="1">
              <Skeleton variant="text" width="45%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
            </VStack>
            <HStack gap="2" className="mt-1">
              <Skeleton variant="rounded" width={100} height={24} />
              <Skeleton variant="rounded" width={120} height={24} />
            </HStack>
          </VStack>
        </div>
      </VStack>
    </section>
  );
}
