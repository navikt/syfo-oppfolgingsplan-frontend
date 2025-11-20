"use client";

import { useEffect } from "react";
import { scrollToAppTopForAG } from "@/utils/scrollToAppTop";

// This is used to improve UX when going from opprett-plan to aktiv-plan route.
// The navigation is then triggered by redirect in server action.
// The navigation from redirect in server action does not have quite the
// same scroll behavior as <Link> or router.push navigation.
export function ScrollToTopHelper() {
  useEffect(() => {
    scrollToAppTopForAG("instant");
  });

  return <></>;
}
