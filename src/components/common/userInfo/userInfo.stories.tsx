import { Meta, StoryFn } from "@storybook/react";
import UserInfo, { Props } from "@/components/common/UserInfo";

// 스토리북 메타데이터 설정
export default {
  title: "Components/UserInfo",
  component: UserInfo,
  argTypes: {
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

// Responsive 스토리 생성
export const Responsive = Template.bind({});
Responsive.args = {
  name: "네오",
  date: "2024-09-24",
};
