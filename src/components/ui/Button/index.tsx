import React from "react";
import styled from "styled-components";

import { HTMLComponent } from "../../../types/html-component";

type Props = {
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  prefixIcon?: React.ReactNode;
  color?: "primary" | "secondary";
  variant?: "default" | "ghost";
  size?: "default" | "small" | "large";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type ButtonProps = HTMLComponent<
  Props,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>;

const Button: React.FC<ButtonProps> = styled(
  ({
    as: Component = "button",
    href,
    loading,
    disabled = loading,
    prefixIcon,
    color = "primary",
    variant = "default",
    size = "default",
    onClick,
    className = "",
    children,
    ...rest
  }: ButtonProps) => {
    href;
    color;
    variant;
    size;
    /* if (href && !disabled) {
  return (
    <_LinkAsButton className={className} href={href}>
      {children}
    </_LinkAsButton>
  );
} */

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onClick && onClick(e);
    };

    return (
      <Component
        onClick={handleClick}
        className={className}
        disabled={disabled}
        whileTap={{ opacity: 0.8 }}
        transition={{ duration: 0.2 }}
        {...rest}
      >
        <ButtonContent>
          <div className={"flex flex-row gap-x-[15px] items-center"}>
            {prefixIcon && prefixIcon}
            {children}
          </div>
        </ButtonContent>
      </Component>
    );
  },
)<ButtonProps>`
  cursor: pointer;

  font-family: "neulis-cursive";
  font-weight: 600;
  color: #ffffff;
  background-color: var(--green);

  padding: 15px 20px;
  border: none;
  border-radius: 5px;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  line-height: 20px;
`;

export default Button;
