import { Meta, StoryFn } from "@storybook/react";
import ProfileImage, {
  ProfileImageProps,
} from "@/components/common/ProfileImage";

export default {
  title: "Components/ProfileImage",
  component: ProfileImage,
  argTypes: {
    src: {
      control: "text",
    },
    alt: {
      control: "text",
    },
  },
} as Meta;

// 기본 템플릿을 설정
const Template: StoryFn<ProfileImageProps> = (args) => (
  <ProfileImage {...args} />
);

// Responsive 크기 스토리 정의
export const Responsive = Template.bind({});
Responsive.args = {
  src: "https://via.placeholder.com/60",
  alt: "Responsive Profile Image",
};
