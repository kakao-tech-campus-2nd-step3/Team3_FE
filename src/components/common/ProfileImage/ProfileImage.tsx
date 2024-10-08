import React from "react";
import StyledImage from "./ProfileImage.styles";

export type ProfileImageProps = {
  src: string;
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "Profile Image",
}) => {
  return <StyledImage src={src} alt={alt} />;
};

export default ProfileImage;
