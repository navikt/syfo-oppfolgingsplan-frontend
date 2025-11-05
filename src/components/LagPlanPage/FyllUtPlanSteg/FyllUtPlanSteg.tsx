import KnapperOgUtkastLagringInfo from "./KnapperOgUtkastLagringInfo";
import SamtaleStotteGuidePanel from "./SamtalestotteGuidePanel";
import FormErrorSummary from "./form/OPFormErrorSummary";
import OPFormFields from "./form/OPFormFields";
import { oppfolgingsplanFormDefaultValues } from "./form/form-options";
import { withForm } from "./form/hooks/form";

interface Props {
  sistLagretUtkastTidspunkt: Date | null;
  isSavingUtkast: boolean;
  isGoingToOppsummering: boolean;
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
  onAvsluttOgFortsettSenereClick: () => Promise<void>;
  onGoToOppsummeringClick: () => void;
}

const FyllUtPlanSteg = withForm({
  defaultValues: oppfolgingsplanFormDefaultValues,
  props: {} as Props,
  render: ({
    form,
    isSavingUtkast,
    isGoingToOppsummering,
    sistLagretUtkastTidspunkt,
    errorSummaryRef,
    onAvsluttOgFortsettSenereClick,
    onGoToOppsummeringClick,
  }) => {
    return (
      <section>
        <SamtaleStotteGuidePanel />

        <OPFormFields form={form} />

        <FormErrorSummary form={form} errorSummaryRef={errorSummaryRef} />

        <KnapperOgUtkastLagringInfo
          isSavingUtkast={isSavingUtkast}
          isGoingToOppsummering={isGoingToOppsummering}
          sistLagretUtkastTidspunkt={sistLagretUtkastTidspunkt}
          handleAvsluttOgFortsettSenere={onAvsluttOgFortsettSenereClick}
          handleGoToOppsummering={onGoToOppsummeringClick}
        />

        <form.Subscribe selector={(state) => state.values}>
          {(values) => <pre>{JSON.stringify(values, null, 2)}</pre>}
        </form.Subscribe>
      </section>
    );
  },
});

export default FyllUtPlanSteg;
