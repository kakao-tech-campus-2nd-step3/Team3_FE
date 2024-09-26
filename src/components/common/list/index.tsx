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
  justify-content: space-between;
  background-color: #f4f4f4;
  border-radius: 16px;

  ${(props) => {
    switch (props.size) {
      case "small":
        return `
          width: 320px;
          padding: 10px;
        `;
      case "large":
        return `
          width: 1065px;
          padding: 10px;
        `;
      case "responsive":
        return `
          width: 320px;
          padding: 10px;

          @media (min-width: 768px) {
            width: 524px;
            padding: 10px;
          }

          @media (min-width: 1024px) {
            width: 1065px;
            padding: 10px;
          }
        `;
      default: // medium이 기본값
        return `
          width: 524px;
          padding: 10px;
        `;
    }
  }}
`;

const ProfileImageWrapper = styled.div`
  margin-right: 10px;
`;

const UserInfoWrapper = styled.div`
  flex-grow: 1;
`;

export default ListItem;
