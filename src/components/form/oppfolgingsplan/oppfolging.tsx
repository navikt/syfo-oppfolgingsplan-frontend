"use client";

import { FormSection } from "@/components/form/formComponents/formSection.tsx";
import { withForm } from "@/components/form/hooks/form.tsx";
import { oppfolgingsplanFormOpts } from "@/components/form/form-options.tsx";
import React from "react";
import { getFutureDate } from "@/utils/dateUtils.ts";

export const Oppfolging = withForm({
  ...oppfolgingsplanFormOpts,
  render: ({ form }) => {
    return (
      <FormSection
        title="Evaluering av oppfølgingsplanen"
        description="Hvordan skal dere følge opp avtalt tilrettelegging på arbeidsplassen?"
      >
        <form.AppField name="hvordanFolgeOpp">
          {(field) => (
            <field.BoundTextArea
              label="Hvordan skal dere følge opp avtalt tilrettelegging?"
              description="TODO en beskrivelse"
              maxLength={500}
            />
          )}
        </form.AppField>

        <form.AppField name="evalueringDato">
          {(field) => (
            <field.BoundDatePicker
              label="Dato for evaluering"
              description="Oppgi når dere skal evaluere planen og eventuelt forlenge eller justere planen."
              fromDate={new Date()}
              toDate={getFutureDate(6)}
            />
          )}
        </form.AppField>
      </FormSection>
    );
  },
});
