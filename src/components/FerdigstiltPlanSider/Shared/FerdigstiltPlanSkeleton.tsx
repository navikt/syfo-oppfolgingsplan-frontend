import { Alert, FormSummary, HStack, Skeleton, VStack } from "@navikt/ds-react";
import {
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryHeader,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";

/**
 * Skeleton for en FormSummary-seksjon.
 */
function FormSummarySkeleton({ answerCount = 3 }: { answerCount?: number }) {
  return (
    <FormSummary>
      <FormSummaryHeader>
        <Skeleton variant="text" width="40%" height={28} />
      </FormSummaryHeader>

      <FormSummaryAnswers>
        {Array.from({ length: answerCount }).map((_, i) => (
          <FormSummaryAnswer key={i}>
            <FormSummaryLabel>
              <Skeleton variant="text" width="50%" height={22} />
            </FormSummaryLabel>
            <FormSummaryValue>
              <VStack gap="space-4">
                <Skeleton variant="text" width="100%" height={24} />
                <Skeleton variant="text" width="95%" height={24} />
                <Skeleton variant="text" width="70%" height={24} />
              </VStack>
            </FormSummaryValue>
          </FormSummaryAnswer>
        ))}
      </FormSummaryAnswers>
    </FormSummary>
  );
}

/**
 * Skeleton for ferdigstilt plan-sider (aktiv og tidligere).
 * Matcher layouten i AktivPlanForAG/SM.
 */
export default function FerdigstiltPlanSkeleton() {
  return (
    <section aria-label="Laster oppfølgingsplan">
      <VStack gap="space-32">
        {/* Heading + Tags */}
        <VStack gap="space-8">
          {/* Heading (xlarge) */}
          <Skeleton variant="text" width="65%" height={44} />

          {/* Tags - 3 stk som wrapper på mobil */}
          <HStack gap="space-8" wrap>
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
        <VStack gap="space-4">
          <Skeleton variant="text" width={260} height={24} />
          <Skeleton variant="text" width={240} height={24} />
        </VStack>

        {/* FormSummary: Arbeidsoppgaver (3 felt) */}
        <FormSummarySkeleton answerCount={3} />

        {/* FormSummary: Tilrettelegging (6 felt) */}
        <FormSummarySkeleton answerCount={6} />

        {/* Alert */}
        <Alert variant="info">
          <VStack gap="space-8" className="flex-1">
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
          </VStack>
        </Alert>

        {/* Tilbake-knapp */}
        <Skeleton variant="rounded" width={200} height={48} />
      </VStack>
    </section>
  );
}
