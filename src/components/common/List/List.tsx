import styled from "@emotion/styled";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import UserInfo from "@/components/common/UserInfo/UserInfo";

export type ListProps = {
  profileSrc: string;
  name: string;
  date: string;
};

const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ProfileImageWrapper = styled.div`
  margin-right: 10px; // Profile image and list spacing
`;

const UserInfoWrapper = styled.div`
  flex-grow: 1;
  border-radius: 16px;
  padding: 10px;
`;

export const List: React.FC<ListProps> = ({ profileSrc, name, date }) => {
  return (
    <ListItemWrapper>
      <ProfileImageWrapper>
        <ProfileImage src={profileSrc} alt={name} />
      </ProfileImageWrapper>
      <UserInfoWrapper>
        <UserInfo name={name} date={date} />
      </UserInfoWrapper>
    </ListItemWrapper>
  );
};

export default List;
