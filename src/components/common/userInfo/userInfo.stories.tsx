import { Meta, StoryFn } from "@storybook/react";
import UserInfo, { Props } from "@/components/common/userInfo";

// 스토리북 메타데이터 설정
export default {
  title: "Components/UserInfo",
  component: UserInfo,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large", "responsive"], // size 옵션 설정
      },
    },
    name: {
      control: "text",
    },
    date: {
      control: "text",
    },
  },
} as Meta<typeof UserInfo>;

// 기본 템플릿 생성 (StoryFn 사용)
const Template: StoryFn<Props> = (args) => <UserInfo {...args} />;

// 각각의 스토리 생성
export const Small = Template.bind({});
Small.args = {
  name: "어피치",
  date: "2024-09-24",
  size: "small",
};

export const Medium = Template.bind({});
Medium.args = {
  name: "라이언",
  date: "2024-09-24",
  size: "medium",
};

export const Large = Template.bind({});
Large.args = {
  name: "프로도",
  date: "2024-09-24",
  size: "large",
};

export const Responsive = Template.bind({});
Responsive.args = {
  name: "네오",
  date: "2024-09-24",
  size: "responsive",
};
