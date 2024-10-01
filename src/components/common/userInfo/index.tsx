import { UserInfoWrapper, NameText, DateText } from "./UserInfo.styles";

export type Props = {
  name: string;
  date: string;
  size?: "small" | "medium" | "large" | "responsive"; // 사이즈 옵션
};

const UserInfo: React.FC<Props> = ({ name, date, size = "responsive" }) => {
  return (
    <UserInfoWrapper size={size}>
      <NameText size={size}>{name}</NameText>
      <DateText size={size}>{date}</DateText>
    </UserInfoWrapper>
  );
};

export default UserInfo;
