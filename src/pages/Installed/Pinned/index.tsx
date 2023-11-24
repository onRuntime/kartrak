import "./index.css";
import "./../../styles/fonts.css";

import React from "react";
import { createRoot } from "react-dom/client";

import InstalledPinnedPage from "./InstalledPinned";

const container = document.getElementById("app-container");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<InstalledPinnedPage />);
