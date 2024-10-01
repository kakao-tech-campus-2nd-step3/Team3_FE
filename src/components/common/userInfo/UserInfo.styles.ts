import styled from "@emotion/styled";
import { breakpoints } from "@/variants";
import { Props } from "@/components/common/UserInfo";

export const UserInfoWrapper = styled.div<Pick<Props, "size">>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 10px;

  ${(props) => {
    switch (props.size) {
      case "large":
        return {
          width: "114px",
          height: "67px",
        };
      case "small":
        return {
          width: "76px",
          height: "39px",
        };
      case "responsive":
        return {
          width: "76px",
          height: "39px",
          [breakpoints.tablet]: {
            width: "113px",
            height: "68px",
          },
          [breakpoints.desktop]: {
            width: "114px",
            height: "67px",
          },
        };
      default:
        return {
          width: "113px",
          height: "68px",
        };
    }
  }}
`;

export const NameText = styled.div<Pick<Props, "size">>`
  font-weight: bold;

  ${(props) => {
    switch (props.size) {
      case "large":
        return { fontSize: "18px" };
      case "small":
        return { fontSize: "12px" };
      case "responsive":
        return {
          fontSize: "12px",
          [breakpoints.tablet]: {
            fontSize: "16px",
          },
          [breakpoints.desktop]: {
            fontSize: "18px",
          },
        };
      default:
        return { fontSize: "16px" };
    }
  }}
`;

export const DateText = styled.div<Pick<Props, "size">>`
  color: #aab2c8;

  ${(props) => {
    switch (props.size) {
      case "large":
        return { fontSize: "18px" };
      case "small":
        return { fontSize: "12px" };
      case "responsive":
        return {
          fontSize: "12px",
          [breakpoints.tablet]: {
            fontSize: "16px",
          },
          [breakpoints.desktop]: {
            fontSize: "18px",
          },
        };
      default:
        return { fontSize: "16px" };
    }
  }}
`;
