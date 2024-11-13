// src/components/common/Button/StyledButton.styles.ts
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";
import { Props } from "./Button.types";

const StyledButton = styled.button<Pick<Props, "theme" | "size">>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: none;
  font-weight: 550;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  padding: 8px 16px; /* py-2 px-4 */
  outline: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.5); /* focus:ring-2 focus:ring-offset-2 */
  }

  ${({ theme }) => {
    switch (theme) {
      case "primary":
        return `
          background-color: #2196F3; /* bg-[#2196F3] */
          color: #ffffff; /* text-white */
          &:hover {
            background-color: #1E88E5; /* hover:bg-[#1E88E5] */
          }
          &:focus {
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.5);
          }
        `;
      case "secondary":
        return `
          background-color: #E3F2FD; /* bg-[#E3F2FD] */
          color: #1976D2; /* text-[#1976D2] */
          &:hover {
            background-color: #BBDEFB; /* hover:bg-[#BBDEFB] */
          }
          &:focus {
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.5);
          }
        `;
      case "kakao":
        return `
          background-color: #ffe401;
          color: #1e1e1f;
          &:hover {
            background-color: #ffcd00;
          }
          &:focus {
            box-shadow: 0 0 0 2px rgba(255, 205, 0, 0.5);
          }
        `;
      default:
        return `
          background-color: #f0f4fa;
          color: #4a4a4a;
        `;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case "small":
        return `
          height: 36px;
          font-size: 14px;
          width: 100px;
          min-width: 95px;
        `;
      case "large":
        return `
          height: 38px;
          font-size: 16px;
          width: 110px;
          min-width: 103px;
        `;
      case "long":
        return `
          width: 150px;
          min-width: 150px;
          height: 40px;
          font-size: 14px;
        `;
      default: // 반응형
        return `
            height: 38px;
          font-size: 16px;
          width: 110px;
          min-width: 103px;
          ${breakpoints.mobile} {
            height: 36px;
            font-size: 14px;
            width: 100px;
          }    
        `;
    }
  }}
`;

export default StyledButton;
