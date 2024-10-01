import { Meta, StoryFn } from "@storybook/react";
import List, { Props } from "@/components/common/List";

// 다른 스토리 파일에서 `args` 재사용
import {
  Small as UserInfoSmall,
  Medium as UserInfoMedium,
  Large as UserInfoLarge,
  Responsive as UserInfoResponsive,
} from "@/components/common/UserInfo/UserInfo.stories";
import {
  Small as ProfileImageSmall,
  Medium as ProfileImageMedium,
  Large as ProfileImageLarge,
  Responsive as ProfileImageResponsive,
} from "@/components/common/ProfileImage/ProfileImage.stories";

// 스토리북 메타데이터 설정
export default {
  title: "Components/ListItem",
  component: List,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large", "responsive"],
      },
    },
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

// 각 사이즈별 스토리 생성
export const Small = Template.bind({});
Small.args = {
  profileSrc: ProfileImageSmall.args?.src,
  name: UserInfoSmall.args?.name,
  date: UserInfoSmall.args?.date,
  size: "small",
};

export const Medium = Template.bind({});
Medium.args = {
  profileSrc: ProfileImageMedium.args?.src,
  name: UserInfoMedium.args?.name,
  date: UserInfoMedium.args?.date,
  size: "medium",
};

export const Large = Template.bind({});
Large.args = {
  profileSrc: ProfileImageLarge.args?.src,
  name: UserInfoLarge.args?.name,
  date: UserInfoLarge.args?.date,
  size: "large",
};

export const Responsive = Template.bind({});
Responsive.args = {
  profileSrc: ProfileImageResponsive.args?.src,
  name: UserInfoResponsive.args?.name,
  date: UserInfoResponsive.args?.date,
  size: "responsive",
};
