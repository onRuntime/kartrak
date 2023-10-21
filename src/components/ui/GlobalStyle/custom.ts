import { css } from "styled-components";

const customCss = css`
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
