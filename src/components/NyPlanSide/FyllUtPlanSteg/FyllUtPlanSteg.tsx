import { Alert } from "@navikt/ds-react";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { getGeneralActionErrorMessage } from "@/utils/error-messages";
import FyllUtPlanButtonsAndSavingInfo from "./FyllUtPlanButtonsAndSavingInfo";
import UtkastLagringInfo from "./UtkastLagringInfo";
import FormErrorSummary from "./form/OPFormErrorSummary";
import OPFormFields from "./form/OPFormFields";
import { oppfolgingsplanFormDefaultValues } from "./form/form-options";
import { withForm } from "./form/hooks/form";

interface Props {
  utkastSistLagretTidspunkt: string | null;
  isSavingUtkast: boolean;
  isPendingProceedToOppsummering: boolean;
  isPendingExitAndContinueLater: boolean;
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
  onAvsluttOgFortsettSenereClick: () => void;
  onGoToOppsummeringClick: () => void;
  error: FetchResultError | null;
}

const FyllUtPlanSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({
    form,
    isSavingUtkast,
    isPendingProceedToOppsummering,
    isPendingExitAndContinueLater,
    utkastSistLagretTidspunkt,
    errorSummaryRef,
    onAvsluttOgFortsettSenereClick,
    onGoToOppsummeringClick,
    error,
  }) => {
    return (
      <section>
        <OPFormFields
          form={form}
          isChangeDisabled={isPendingProceedToOppsummering}
        />

        <FormErrorSummary form={form} errorSummaryRef={errorSummaryRef} />

        <FyllUtPlanButtonsAndSavingInfo
          isPendingProceed={isPendingProceedToOppsummering}
          isPendingExit={isPendingExitAndContinueLater}
          onAvsluttOgFortsettSenereClick={onAvsluttOgFortsettSenereClick}
          onGoToOppsummeringClick={onGoToOppsummeringClick}
          utkastLagringInfo={
            <UtkastLagringInfo
              isSavingUtkast={isSavingUtkast}
              utkastSistLagretTidspunkt={utkastSistLagretTidspunkt}
            />
          }
        />
        {error && (
          <div className="mt-8">
            <Alert variant="error">
              {getGeneralActionErrorMessage(
                error,
                "Vi klarte ikke å lagre utkastet ditt. Vennligst prøv igjen senere.",
              )}
            </Alert>
          </div>
        )}
      </section>
    );
  },
});

export default FyllUtPlanSteg;
