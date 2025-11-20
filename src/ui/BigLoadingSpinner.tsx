import { HStack, Loader } from "@navikt/ds-react";

export function BigLoadingSpinner() {
  return (
    <HStack justify="center" marginBlock="space-48">
      <Loader size="3xlarge" title="Laster data..." />
    </HStack>
  );
}
