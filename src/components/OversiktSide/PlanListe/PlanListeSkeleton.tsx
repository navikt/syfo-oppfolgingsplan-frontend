import { HStack, Loader } from "@navikt/ds-react";

export default function PlanListeSkeleton() {
  // TODO: Lage pent skeleton UI for plan-liste
  return (
    <HStack justify="center" margin="space-32">
      <Loader size="3xlarge" title="Laster data..." />
    </HStack>
  );
}
