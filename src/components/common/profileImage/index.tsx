import React from "react";
import { StyledImage } from "./ProfileImage.styles";

export type ProfileImageProps = {
  src: string;
  alt?: string;
  size?: "small" | "medium" | "large" | "responsive";
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "Profile Image",
  size = "responsive",
  ...props
}) => {
  return <StyledImage src={src} alt={alt} size={size} {...props} />;
};

export default ProfileImage;
