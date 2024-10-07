import React from "react";
import StyledImage from "./ProfileImage.styles";

export type ProfileImageProps = {
  src: string;
  alt?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "Profile Image",
  onClick,
}) => {
  return <StyledImage src={src} alt={alt} onClick={onClick} />;
};

export default ProfileImage;
