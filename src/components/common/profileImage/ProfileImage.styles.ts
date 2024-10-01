import styled from "@emotion/styled";
import { breakpoints } from "@/variants";
import { ProfileImageProps } from "@/components/common/ProfileImage";

export const StyledImage = styled.img<Pick<ProfileImageProps, "size">>(
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
          [breakpoints.tablet]: {
            width: "50px",
            height: "50px",
          },
          [breakpoints.desktop]: {
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
