import { NaisMetaTags } from "@nais/apm/react";
import { browserApmIdentity } from "./browserConfig";

export function BrowserApmMetaTags() {
  return <NaisMetaTags overrides={browserApmIdentity} />;
}
