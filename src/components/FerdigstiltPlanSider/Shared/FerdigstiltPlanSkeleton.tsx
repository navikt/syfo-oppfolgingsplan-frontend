import { HStack, Skeleton, VStack } from "@navikt/ds-react";

function FormSummarySkeleton() {
  return (
    <div className="rounded-lg border border-border-subtle">
      {/* Header */}
      <div className="border-b border-border-subtle bg-surface-subtle px-6 py-4">
        <Skeleton variant="text" width="40%" height={24} />
      </div>

      {/* Answers */}
      <VStack gap="0" className="divide-y divide-border-subtle">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-6 py-4">
            <VStack gap="2">
              <Skeleton variant="text" width="35%" height={18} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="75%" height={20} />
            </VStack>
          </div>
        ))}
      </VStack>
    </div>
  );
}

export default function FerdigstiltPlanSkeleton() {
  return (
    <section>
      <VStack gap="8">
        {/* Heading and tags */}
        <VStack gap="2">
          <Skeleton variant="text" width="70%" height={40} />
          <HStack gap="2">
            <Skeleton variant="rounded" width={100} height={24} />
            <Skeleton variant="rounded" width={120} height={24} />
          </HStack>
        </VStack>

        {/* Details (Opprettet + Evalueringsdato) */}
        <VStack gap="1">
          <Skeleton variant="text" width={280} height={22} />
          <Skeleton variant="text" width={320} height={22} />
        </VStack>

        {/* FormSummary sections */}
        <VStack gap="8">
          <FormSummarySkeleton />
          <FormSummarySkeleton />
        </VStack>

        {/* Alert */}
        <div className="mt-8 rounded-lg border-l-4 border-border-info bg-surface-info-subtle p-4">
          <VStack gap="2">
            <Skeleton variant="text" width="60%" height={22} />
            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </VStack>
        </div>

        {/* Button */}
        <Skeleton variant="rounded" width={200} height={48} />
      </VStack>
    </section>
  );
}
