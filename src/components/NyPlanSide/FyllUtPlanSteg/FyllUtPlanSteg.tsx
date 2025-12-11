import TilbakeTilOversiktButtonForAG from "@/components/FerdigstiltPlanSider/Shared/Buttons/TilbakeTilOversiktButtonForAG.tsx";
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
  isFormReadOnly: boolean;
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
    isFormReadOnly,
  }) => {
    return (
      <section>
        <OPFormFields
          form={form}
          isChangeDisabled={isPendingProceedToOppsummering}
          isReadOnly={isFormReadOnly}
        />

        <FormErrorSummary form={form} errorSummaryRef={errorSummaryRef} />

        {isFormReadOnly ? (
          <TilbakeTilOversiktButtonForAG />
        ) : (
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
        )}
      </section>
    );
  },
});

export default FyllUtPlanSteg;
