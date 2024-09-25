import styled from "@emotion/styled";

export type Props = {
  name: string;
  date: string;
  size?: "small" | "medium" | "large" | "responsive"; // 사이즈 옵션
};

const UserInfoWrapper = styled.div<Pick<Props, "size">>`
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
        return `
          width: 125px;
          height: 74px;
        `;
      case "small":
        return `
          width: 76px;
          height: 39px;
        `;
      case "responsive":
        return `
          width: 76px;
          height: 39px;
          @media (min-width: 768px) {
            width: 113px;
            height: 68px;
          }
          @media (min-width: 1024px) {
            width: 125px;
            height: 74px;
          }
        `;
      default:
        return `
          width: 113px;
          height: 68px;
        `;
    }
  }}
`;

const NameText = styled.div<Pick<Props, "size">>`
  font-weight: bold;

  ${(props) => {
    switch (props.size) {
      case "large":
        return `font-size: 18px;`;
      case "small":
        return `font-size: 12px;`;
      case "responsive":
        return `
          font-size: 12px;
          @media (min-width: 768px) {
            font-size: 16px;
          }
          @media (min-width: 1024px) {
            font-size: 18px;
          }
        `;
      default:
        return `font-size: 16px;`;
    }
  }}
`;

const DateText = styled.div<Pick<Props, "size">>`
  color: #aab2c8;

  ${(props) => {
    switch (props.size) {
      case "large":
        return `font-size: 18px;`;
      case "small":
        return `font-size: 12px;`;
      case "responsive":
        return `
          font-size: 12px;
          @media (min-width: 768px) {
            font-size: 16px;
          }
          @media (min-width: 1024px) {
            font-size: 18px;
          }
        `;
      default:
        return `font-size: 16px;`;
    }
  }}
`;

const UserInfo: React.FC<Props> = ({ name, date, size = "medium" }) => {
  return (
    <UserInfoWrapper size={size}>
      <NameText size={size}>{name}</NameText>
      <DateText size={size}>{date}</DateText>
    </UserInfoWrapper>
  );
};

export default UserInfo;
