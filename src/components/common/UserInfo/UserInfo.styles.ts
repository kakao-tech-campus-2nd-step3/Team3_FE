import styled from "@emotion/styled";
import breakpoints from "@/variants/variants";

export const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 10px;
  width: 76px;
  height: 39px;

  ${breakpoints.tablet} {
    width: 113px;
    height: 48px;
  }
`;

export const NameText = styled.div`
  font-weight: bold;
  font-size: 12px;

  ${breakpoints.tablet} {
    font-size: 14px;
  }
`;

export const DateText = styled.div`
  color: #aab2c8;
  font-size: 12px;

  ${breakpoints.tablet} {
    font-size: 14px;
  }
`;
