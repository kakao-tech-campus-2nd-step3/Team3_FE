import { Meta, StoryFn } from "@storybook/react";
import ProfileImage, {
  ProfileImageProps,
} from "@/components/common/profileImage";

export default {
  title: "Components/ProfileImage",
  component: ProfileImage,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large", "responsive"],
      },
    },
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

// 각 크기에 대한 스토리 정의
export const Small = Template.bind({});
Small.args = {
  src: "https://via.placeholder.com/30",
  size: "small",
};

export const Medium = Template.bind({});
Medium.args = {
  src: "https://via.placeholder.com/50",
  size: "medium",
};

export const Large = Template.bind({});
Large.args = {
  src: "https://via.placeholder.com/60",
  size: "large",
};

export const Responsive = Template.bind({});
Responsive.args = {
  src: "https://via.placeholder.com/60",
  size: "responsive",
};
