import styled from "@emotion/styled";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import UserInfo from "@/components/common/UserInfo/UserInfo";

export type ButtonProps = {
  label: string;
  onClick: () => void;
  theme: "primary" | "secondary"; 
};

export type ListProps = {
  profileSrc: string;
  name: string;
  date: string;
  buttons?: ButtonProps[]; 
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
  background-color: #f5f5f5; // Gray background
  border-radius: 16px;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  right: 10px;
  margin-right: auto;
`;

const Button = styled.button<{ themeType: "primary" | "secondary" }>`
  width: 100px;
  height: 50px;
  padding: 8px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  ${({ themeType }) =>
    themeType === "primary"
      ? `
    background: #39A7F7;
    color: white;
    border: none;
  `
      : `
    background: white;
    color: #39A7F7;
    border: 1.5px solid #39A7F7;
  `}
`;

export const List: React.FC<ListProps> = ({ profileSrc, name, date, buttons }) => {
  return (
    <ListItemWrapper>
      <ProfileImageWrapper>
        <ProfileImage src={profileSrc} alt={name} />
      </ProfileImageWrapper>
      <UserInfoWrapper>
        <UserInfo name={name} date={date} />
      </UserInfoWrapper>
      {buttons && (
        <ButtonContainer>
          {buttons.map((button, index) => (
            <Button
              key={index}
              themeType={button.theme}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </ButtonContainer>
      )}
    </ListItemWrapper>
  );
};

export default List;
