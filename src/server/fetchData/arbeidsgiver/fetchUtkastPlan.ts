import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanForm,
  OppfolgingsplanFormAndUtkastSchema,
} from "@/schema/oppfolgingsplanFormSchemas";
import {
  ConvertedLagretUtkastData,
  utkastResponseForAGSchema,
} from "@/schema/utkastResponseSchema";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import { mockUtkastResponse } from "../mockData/mockUtkastData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchUtkastDataForAG(
  narmesteLederId: string,
): Promise<ConvertedLagretUtkastData> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockUtkastResponse;
  }

  const lagretUtkastResponse = await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: utkastResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  if (lagretUtkastResponse.utkast) {
    const convertedUtkast = convertUtkastContentToCurrentFormSchema(
      lagretUtkastResponse.utkast.content,
    );

    return {
      ...lagretUtkastResponse,
      utkast: {
        ...lagretUtkastResponse.utkast,
        content: convertedUtkast,
      },
    };
  } else {
    return {
      ...lagretUtkastResponse,
      utkast: null,
    };
  }
}

/**
 * Converts lagretUtkast content to current OppfolgingsplanForm schema.
 * This accounts for changes to the form schema since last time the utkast was
 * saved. If a field exists in the lagretUtkast but not in the current schema,
 * it will be ignored.
 * If a field that exists in the current schema is missing or has invalid value
 * in the lagretUtkast, it will be omitted from the returned object.
 */
function convertUtkastContentToCurrentFormSchema(
  lagretUtkast: Record<string, string | null>,
): Partial<OppfolgingsplanForm> {
  const oppfolgingsplanFormSchemaShape =
    OppfolgingsplanFormAndUtkastSchema.shape;

  // Iterate over current form schema fields and pick corresponding values
  // from lagretUtkast. Validate each lagretUtkast value against current schema
  // for that field.
  const result = Object.entries(oppfolgingsplanFormSchemaShape).reduce(
    (acc, [fieldKey, fieldSchema]) => {
      const lagretFieldValue = lagretUtkast[fieldKey];
      const { success, data } = fieldSchema.safeParse(lagretFieldValue);

      if (success) {
        return {
          ...acc,
          [fieldKey]: data,
        };
      } else {
        // Field is missing or has invalid value in lagretUtkast.
        return acc;
      }
    },
    {} as Partial<OppfolgingsplanForm>,
  );

  return result;
}
