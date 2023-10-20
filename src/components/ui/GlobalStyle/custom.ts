import { css } from "styled-components";

const customCss = css`
  html {
    width: 380px;
    height: 600px;
    padding: 10px;
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
    border-radius: 10px;
    border: 1px solid rgba(1, 67, 53, 0.1);
  }

  body,
  span,
  input,
  button,
  textarea,
  select,
  option {
    font-family: "Figtree", sans-serif;
    font-size: 16px;
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
