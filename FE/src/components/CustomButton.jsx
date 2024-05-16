import styled, { css } from "styled-components";

const SIZES = {
    sm: css`
      --button-font-size: 0.875rem;
      --button-padding: 8px 12px;
      --button-radius: 4px;
    `,
    md: css`
      --button-font-size: 1rem;
      --button-padding: 12px 16px;
      --button-radius: 8px;
    `,
    lg: css`
      --button-font-size: 1.25rem;
      --button-padding: 16px 20px;
      --button-radius: 12px;
    `,
  };

const VARIANTS = {
  success: css`
    --button-color: #ffffff;
    --button-bg-color: #4169E1;
    --button-hover-bg-color: #00008B;
    --button-selected-bg-color: #00008B;
  `,
  error: css`
    --button-color: #ffffff;
    --button-bg-color: #dc3545;
    --button-hover-bg-color: #c82333;
    --button-selected-bg-color: #c82333;
  `,
  warning: css`
    --button-color: #212529;
    --button-bg-color: #ffc107;
    --button-hover-bg-color: #e0a800;
    --button-selected-bg-color: #e0a800;
  `,
};

function Button({ disabled, size, variant, children, onClick, selected }) {
  const sizeStyle = SIZES[size];
  const variantStyle = VARIANTS[variant];

  return (
    <StyledButton
    disabled={disabled}
    sizestyle={sizeStyle}
    variantstyle={variantStyle}
    onClick={onClick}
    selected={selected}
    >
    {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  margin: 0;
  border: none;
  cursor: pointer;
  font-family: "Noto Sans KR", sans-serif;
  font-size: var(--button-font-size, 1rem);
  padding: var(--button-padding, 12px 16px);
  border-radius: var(--button-radius, 8px);
  background: var(--button-bg-color, #0d6efd);
  color: var(--button-color, #ffffff);

  ${(p) => p.sizestyle}
  ${(p) => p.variantstyle}

  &:active,
  &:hover,
  &:focus {
    background: var(--button-hover-bg-color, #025ce2);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
    background: var(--button-bg-color, #025ce2);
  }

  ${(p) =>
    p.selected &&
    css`
      background: var(--button-selected-bg-color, #00008B);
    `}
`;





export default Button;