import { createGlobalStyle } from "styled-components";

import customCss from "./custom";
import resetCss from "./reset";

const GlobalStyle = createGlobalStyle`
  ${resetCss}
  ${customCss}
`;

export default GlobalStyle;
