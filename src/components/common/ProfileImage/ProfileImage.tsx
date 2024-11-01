import React from "react";
import StyledImage from "./StyledImage.styles";
import defaultImage from "@/assets/defaultProfileImage.svg";

export type ProfileImageProps = {
  src?: string | null; 
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src, 
  alt = "Profile Image",
}) => {
  return <StyledImage src={src || defaultImage} alt={alt} />;
};

export default ProfileImage;
