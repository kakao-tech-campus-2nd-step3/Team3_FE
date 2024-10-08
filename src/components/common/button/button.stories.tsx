import { Meta, StoryFn } from "@storybook/react";
import Button, { Props } from "@/components/common/Button";

// Storybook의 메타데이터 설정
export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    theme: {
      control: {
        type: "select",
        options: ["primary", "secondary"], // theme 옵션 정의
      },
    },
    children: {
      control: "text",
    },
  },
} as Meta<typeof Button>;

// Template 생성 (StoryFn으로 대체)
const Template: StoryFn<Props> = (args) => <Button {...args} />;

// 각 스토리 생성
export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  theme: "primary",
  children: "Primary Button",
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  theme: "secondary",
  children: "Secondary Button",
};

export const ResponsiveButton = Template.bind({});
ResponsiveButton.args = {
  theme: "primary",
  children: "Responsive Button",
};
