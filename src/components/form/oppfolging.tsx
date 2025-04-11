"use client";

import { FormSection } from "@/components/form/formSection";
import { DatePicker, Textarea, useDatepicker } from "@navikt/ds-react";

export const Oppfolging = () => {
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date(),
    toDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    onDateChange: console.info,
  });

  return (
    <FormSection
      title="Evaluering av oppfølgingsplanen"
      description="Hvordan skal dere følge opp avtalt tilrettelegging på arbeidsplassen?"
    >
      <Textarea label="Hvordan skal dere følge opp avtalt tilrettelegging?" />

      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label="Dato for evaluering"
          description="Oppg i når dere skal evaluere planen og eventuelt forlenge eller justere planen."
        />
      </DatePicker>
    </FormSection>
  );
};
