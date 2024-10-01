import styled from "@emotion/styled";
import ProfileImage from "@/components/common/profileImage";
import UserInfo from "@/components/common/userInfo";

export type Props = {
  profileSrc: string;
  name: string;
  date: string;
  size?: "small" | "medium" | "large" | "responsive";
};

const ListItem: React.FC<Props> = ({
  profileSrc,
  name,
  date,
  size = "medium",
}) => {
  return (
    <ListItemWrapper size={size}>
      <ProfileImageWrapper>
        <ProfileImage src={profileSrc} alt={name} size={size} />
      </ProfileImageWrapper>
      <UserInfoWrapper>
        <UserInfo name={name} date={date} size={size} />
      </UserInfoWrapper>
    </ListItemWrapper>
  );
};

const ListItemWrapper = styled.div<Pick<Props, "size">>`
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

export default ListItem;
