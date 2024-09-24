import styled from "@emotion/styled";
import React from "react";

export type ProfileImageProps = {
  src: string;
  alt?: string;
  size?: "small" | "medium" | "large" | "responsive";
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "Profile Image",
  size = "medium",
  ...props
}) => {
  return <StyledImage src={src} alt={alt} size={size} {...props} />;
};

const StyledImage = styled.img<Pick<ProfileImageProps, "size">>(
  {
    borderRadius: "50%",
    objectFit: "cover",
  },
  ({ size }) => {
    switch (size) {
      case "large":
        return {
          width: "60px",
          height: "60px",
        };
      case "small":
        return {
          width: "30px",
          height: "30px",
        };
      case "responsive":
        return {
          width: "30px",
          height: "30px",
          "@media (min-width: 768px)": {
            width: "50px",
            height: "50px",
          },
          "@media (min-width: 1024px)": {
            width: "60px",
            height: "60px",
          },
        };
      default:
        return {
          widht: "50px",
          height: "50px",
        };
    }
  },
);

export default ProfileImage;
