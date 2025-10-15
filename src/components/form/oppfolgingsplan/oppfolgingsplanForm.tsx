"use client";

import { Tilrettelegging } from "@/components/form/oppfolgingsplan/tilrettelegging.tsx";
import { Oppfolging } from "@/components/form/oppfolgingsplan/oppfolging.tsx";
import React from "react";
import { useAppForm } from "../hooks/form.tsx";
import { oppfolgingsplanFormOpts } from "@/components/form/form-options.tsx";
import { Arbeidssituasjon } from "@/components/form/oppfolgingsplan/arbeidssituasjon.tsx";
import { VStack } from "@navikt/ds-react";

export const OppfolgingsplanForm = () => {
  const form = useAppForm({
    ...oppfolgingsplanFormOpts,
    onSubmit: ({ value }) => {
      console.log(value);
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <VStack gap="8">
          <Arbeidssituasjon form={form} />

          <Tilrettelegging form={form} />

          <Oppfolging form={form} />

          <form.AppForm>
            <form.BoundSubmitButton label="Lagre oppfølgingsplan" />
          </form.AppForm>
        </VStack>
      </form>
    </>
  );
};
