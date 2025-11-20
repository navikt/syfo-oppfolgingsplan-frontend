import FyllUtPlanButtonsAndSavingInfo from "./FyllUtPlanButtonsAndSavingInfo";
import UtkastLagringInfo from "./UtkastLagringInfo";
import FormErrorSummary from "./form/OPFormErrorSummary";
import OPFormFields from "./form/OPFormFields";
import { oppfolgingsplanFormDefaultValues } from "./form/form-options";
import { withForm } from "./form/hooks/form";

interface Props {
  sistLagretUtkastTidspunkt: Date | null;
  isSavingUtkast: boolean;
  isPendingProceedToOppsummering: boolean;
  isPendingExitAndContinueLater: boolean;
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
  onAvsluttOgFortsettSenereClick: () => void;
  onGoToOppsummeringClick: () => void;
}

const FyllUtPlanSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({
    form,
    isSavingUtkast,
    isPendingProceedToOppsummering,
    isPendingExitAndContinueLater,
    sistLagretUtkastTidspunkt,
    errorSummaryRef,
    onAvsluttOgFortsettSenereClick,
    onGoToOppsummeringClick,
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
              sistLagretUtkastTidspunkt={sistLagretUtkastTidspunkt}
            />
          }
        />
      </section>
    );
  },
});

export default FyllUtPlanSteg;
