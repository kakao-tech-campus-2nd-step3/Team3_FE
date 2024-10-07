import styled from "@emotion/styled";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import UserInfo from "@/components/common/UserInfo";

export type Props = {
  profileSrc: string;
  name: string;
  date: string;
};

export const List: React.FC<Props> = ({ profileSrc, name, date }) => {
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

const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImageWrapper = styled.div`
  margin-right: 10px; // 프로필 이미지와 리스트 간의 간격
`;

const UserInfoWrapper = styled.div`
  flex-grow: 1;
  background-color: #f5f5f5; // 회색 배경
  border-radius: 16px;
  padding: 10px;
`;

export default List;
