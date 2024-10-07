import { Meta, StoryFn } from "@storybook/react";
import List, { Props } from "@/components/common/List";

// 다른 스토리 파일에서 `args` 재사용
import { Responsive as UserInfoResponsive } from "@/components/common/UserInfo/UserInfo.stories";
import { Responsive as ProfileImageResponsive } from "@/components/common/ProfileImage/ProfileImage.stories";

// 스토리북 메타데이터 설정
export default {
  title: "Components/ListItem",
  component: List,
  argTypes: {
    profileSrc: {
      control: "text",
    },
    name: {
      control: "text",
    },
    date: {
      control: "text",
    },
  },
} as Meta<typeof List>;

// 기본 템플릿 생성
const Template: StoryFn<Props> = (args) => <List {...args} />;

// Responsive 스토리 생성
export const Responsive = Template.bind({});
Responsive.args = {
  profileSrc: ProfileImageResponsive.args?.src,
  name: UserInfoResponsive.args?.name,
  date: UserInfoResponsive.args?.date,
};
