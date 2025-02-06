import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://554e7a8d112c190c79bc70caa0c4b2cb@o4508770016821248.ingest.us.sentry.io/4508770186690560",
  integrations: [],
});

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
