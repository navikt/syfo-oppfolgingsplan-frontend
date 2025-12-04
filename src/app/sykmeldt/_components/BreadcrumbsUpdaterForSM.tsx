"use client";

import { useLayoutEffect } from "react";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import {
  SM_BREADCRUMB_TITLES,
  createFullUrl,
  getBaseBreadcrumbsForSM,
} from "@/common/breadcrumbs";
import { SM_SEGMENT } from "@/common/route-hrefs";

export function BreadcrumbsUpdaterForSM() {
  const segments = useSelectedLayoutSegments();
  const params = useParams<{ planId?: string }>();

  useLayoutEffect(() => {
    const baseBreadcrumbs = getBaseBreadcrumbsForSM();
    const [firstSegment] = segments;
    const title = firstSegment ? SM_BREADCRUMB_TITLES[firstSegment] : null;

    if (title && params.planId) {
      setBreadcrumbs([
        ...baseBreadcrumbs,
        {
          url: createFullUrl(`/${SM_SEGMENT}/${firstSegment}/${params.planId}`),
          title,
        },
      ]);
    } else {
      setBreadcrumbs(baseBreadcrumbs);
    }
  }, [segments, params.planId]);

  return null;
}
