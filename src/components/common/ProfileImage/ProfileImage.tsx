import React from "react";
import StyledImage from "./ProfileImage.styles";
import defaultImage from "@/assets/defaultProfileImage.svg";

export type ProfileImageProps = {
  src?: string; // src를 optional로 변경
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src = defaultImage, // 기본 이미지를 src의 default 값으로 설정
  alt = "Profile Image",
}) => {
  return <StyledImage src={src} alt={alt} />;
};

export default ProfileImage;
