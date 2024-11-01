import { UserInfoWrapper, NameText, DateText } from "./UserInfo.styles";

export type Props = {
  name: string;
  date?: string;
};

const UserInfo: React.FC<Props> = ({ name, date }) => {
  return (
    <UserInfoWrapper>
      <NameText>{name}</NameText>
      <DateText>{date}</DateText>
    </UserInfoWrapper>
  );
};

export default UserInfo;
