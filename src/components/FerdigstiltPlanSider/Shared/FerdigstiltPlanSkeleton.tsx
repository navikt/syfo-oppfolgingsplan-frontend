import { HStack, Skeleton, VStack } from "@navikt/ds-react";

/**
 * Skeleton for en FormSummary-seksjon.
 * Bruker samme padding og border-styling som navds-form-summary.
 */
function FormSummarySkeleton({ answerCount = 3 }: { answerCount?: number }) {
  return (
    <div className="navds-form-summary">
      {/* Header - navds-form-summary__header */}
      <div className="navds-form-summary__header">
        <Skeleton variant="text" width="40%" height={28} />
      </div>

      {/* Answers - navds-form-summary__answers */}
      <dl className="navds-form-summary__answers" data-color="info">
        {Array.from({ length: answerCount }).map((_, i) => (
          <div key={i} className="navds-form-summary__answer">
            {/* Label */}
            <Skeleton variant="text" width="50%" height={22} />
            {/* Value - lang tekst som wrapper */}
            <VStack gap="1">
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="95%" height={24} />
              <Skeleton variant="text" width="70%" height={24} />
            </VStack>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Skeleton for ferdigstilt plan-sider (aktiv og tidligere).
 * Matcher layouten i AktivPlanForAG/SM.
 */
export default function FerdigstiltPlanSkeleton() {
  return (
    <section aria-label="Laster oppfølgingsplan">
      <VStack gap="8">
        {/* Heading + Tags */}
        <VStack gap="2">
          {/* Heading (xlarge) */}
          <Skeleton variant="text" width="65%" height={44} />

          {/* Tags - 3 stk som wrapper på mobil */}
          <HStack gap="2" wrap>
            <Skeleton variant="rounded" height={24}>
              Delt med den ansatte
            </Skeleton>
            <Skeleton variant="rounded" height={24}>
              Ikke sendt til fastlege
            </Skeleton>
            <Skeleton variant="rounded" height={24}>
              Ikke sendt til Nav
            </Skeleton>
          </HStack>
        </VStack>

        {/* Details (Opprettet + Evalueringsdato) */}
        <VStack gap="1">
          <Skeleton variant="text" width={260} height={24} />
          <Skeleton variant="text" width={240} height={24} />
        </VStack>

        {/* FormSummary: Arbeidsoppgaver (3 felt) */}
        <FormSummarySkeleton answerCount={3} />

        {/* FormSummary: Tilrettelegging (6 felt) */}
        <FormSummarySkeleton answerCount={6} />

        {/* Alert */}
        <div className="navds-alert navds-alert--info navds-alert--medium navds-body-long navds-body-long--medium">
          <VStack gap="2" className="flex-1">
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
          </VStack>
        </div>

        {/* Tilbake-knapp */}
        <Skeleton variant="rounded" width={200} height={48} />
      </VStack>
    </section>
  );
}
