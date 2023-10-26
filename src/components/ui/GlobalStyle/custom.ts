import { css } from "styled-components";

const customCss = css`
  :root {
    --primary: #014335;
    --grey: #909090;
    --red: #e40000;
    --red-80: #ffcfcf;
    --yellow: #dcb903;
    --yellow-80: #fef2c7;
    --orange: #dc6803;
    --orange-80: #fef0c7;
    --green: #009245;
    --green-80: #cce9da;
    --green-40: #eff8f3;
    --green-10: #f1faf1;
  }

  html {
    width: 380px;
    height: auto;
  }

  body,
  #app-container {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI",
      "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif;
    background-color: #fff;
  }

  body,
  span,
  input,
  button,
  textarea,
  select,
  option {
    font-family: "Figtree", sans-serif;
    font-size: 19px;
    font-weight: 400;
    text-align: left;
    color: #101010;
    line-height: 1.25;
  }

  a {
    text-decoration: none;
    color: #101010;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }
  }
`;

export default customCss;
